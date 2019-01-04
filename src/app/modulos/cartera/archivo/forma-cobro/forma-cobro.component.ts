import { Component, OnInit, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { CarPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarPagosCobrosFormaTO';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FormaPagoService } from '../forma-pago/forma-pago.service';
import { FormaCobroService } from './forma-cobro.service';

@Component({
  selector: 'app-forma-cobro',
  templateUrl: './forma-cobro.component.html',
  styleUrls: ['./forma-cobro.component.css']
})
export class FormaCobroComponent implements OnInit {

  public listaResultado: Array<CarPagosCobrosFormaTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];

  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public objetoSeleccionado: CarPagosCobrosFormaTO = new CarPagosCobrosFormaTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();

  //cuenta
  public codigoCuenta: String = null;
  public tamanioEstructura: number = 0;

  public constantes: any = LS;
  public accion: String = null;
  public tituloForm: String = LS.TITULO_FILTROS;

  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";

  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};
  public indexTablaEditar: number = 0;

  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    private planContableService: PlanContableService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private formaPagoService: FormaPagoService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private formaCobroService: FormaCobroService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['formaCobroCartera'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.planContableService.getTamanioListaConEstructura({ empresa: LS.KEY_EMPRESA_SELECT }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    this.listaSectores = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarFc') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoFc') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesFormaCobro(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesFormaCobro(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [OPERACIONES]
  operacionesFormaCobro(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarFormaCobro();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.mostrarFormulario(new CarPagosCobrosFormaTO(), LS.ACCION_CREAR);
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.mostrarFormulario(this.objetoSeleccionado, LS.ACCION_CONSULTAR);
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.indexTablaEditar = this.objetoSeleccionado.fpSecuencial ? this.listaResultado.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial) :
            this.listaResultado.findIndex(item => item.ctaCodigo === this.objetoSeleccionado.ctaCodigo);
          this.mostrarFormulario(this.objetoSeleccionado, LS.ACCION_EDITAR);
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.indexTablaEditar = this.objetoSeleccionado.fpSecuencial ? this.listaResultado.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial) :
            this.listaResultado.findIndex(item => item.ctaCodigo === this.objetoSeleccionado.ctaCodigo);
          this.actualizarEstadoFormaCobro();
        }
        break;
      }
    }
  }

  refrescarTabla(carPagosCobrosFormaTO: CarPagosCobrosFormaTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(carPagosCobrosFormaTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        this.resetear();
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        let listaTemporal = [... this.listaResultado];
        listaTemporal[this.indexTablaEditar] = carPagosCobrosFormaTO;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(this.indexTablaEditar);
        this.resetear();
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.ctaCodigo === carPagosCobrosFormaTO.ctaCodigo);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        this.resetear();
        break;
      }
    }
  }

  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.parametrosFormulario = null;
    this.vistaFormulario = false;
    this.generarAtajosTeclado();
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  mostrarFormulario(formaCobro, accion) {
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      activar: this.activar,
      accion: accion,
      listaSectores: this.listaSectores,
      tamanioEstructura: this.tamanioEstructura,
      formaCobro: { ...formaCobro },
      listaResultado: this.listaResultado
    }
  }

  //#region [BUSCAR FORMA PAGO]
  buscarFormasCobro(inactivos) {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, accion: 'C', inactivos: inactivos };
    this.filasTiempo.iniciarContador();
    this.formaPagoService.listarCarListaPagosCobrosFormaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCarListaPagosCobrosFormaTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }
  //#endregion

  //#region [ACTUALIZAR ESTADO] 
  actualizarEstadoFormaCobro() {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let FormaCobroCopia = JSON.parse(JSON.stringify(this.objetoSeleccionado));
      let parametros = {
        title: FormaCobroCopia.fpInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (FormaCobroCopia.fpInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Forma de cobro: " + FormaCobroCopia.fpDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          FormaCobroCopia.fpInactivo = !FormaCobroCopia.fpInactivo;
          let parametro = { carPagosCobrosFormaTO: FormaCobroCopia, estado: FormaCobroCopia.fpInactivo };
          this.formaCobroService.modificarEstadoFormaCobro(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.resetear();
        }
      });
    }
  }

  despuesDeModificarEstadoFormaCobro(respuesta) {
    this.cargando = false;
    if (respuesta) {
      this.refrescarTabla(respuesta.formaCobro, 'U')
      this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    }
    this.resetear();
  }
  //#endregion

  //#region [ELIMINAR FORMA PAGO]
  eliminarFormaCobro() {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.objetoSeleccionado));
      item.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { accion: 'E', carPagosCobrosFormaTO: item }
          this.formaCobroService.accionCarCobrosForma(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.resetear();
        }
      });
    }
  }

  despuesDeAccionCarCobroForma(respuesta) {
    this.cargando = false;
    if (respuesta) {
      this.toastr.success(respuesta.operacionMensaje, 'Aviso');
      this.refrescarTabla(this.objetoSeleccionado, 'D');
    }
    this.resetear();
  }
  //#endregion

  //#region [IMPRIMIR Y EXPORTAR FORMA PAGO]
  imprimirFormaCobro() {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      let parametros = { listado: this.listaResultado, tipo: 'C' };
      this.formaCobroService.imprimirFormaCobro(this, parametros, this.empresaSeleccionada);
    }
  }

  exportarFormaCobro() {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      let parametros = { listadoCarPagosForma: this.listaResultado, tipo: 'C' };
      this.formaCobroService.exportarFormaCobro(this, parametros, this.empresaSeleccionada);
    }
  }
  //#endregion

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.formaPagoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  generarOpciones() {
    let perEditar = this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perInactivar = this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true) && !this.objetoSeleccionado.fpInactivo;
    let perActivar = this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.objetoSeleccionado.fpInactivo;
    let perEliminar = this.formaCobroService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesFormaCobro(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesFormaCobro(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesFormaCobro(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesFormaCobro(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesFormaCobro(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CREADO://Fue creado o modificado
        if (event.tipo === 'I') {
          this.refrescarTabla(event.formaCobro, 'I');
        } else {
          this.refrescarTabla(event.formaCobro, 'U');
        }
        break;
      case LS.ACCION_CANCELAR:
        this.listaResultado.length === 0 ? this.activar = false : null;
        this.resetear();
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
    }
  }

}
