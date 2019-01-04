import { Component, OnInit, ViewChild } from '@angular/core';
import { CarPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarPagosCobrosFormaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FormaPagoService } from './forma-pago.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css']
})
export class FormaPagoComponent implements OnInit {
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
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['formaPagoCartera'];
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
      let element: HTMLElement = document.getElementById('btnBuscarFp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoFp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesFormaPago(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesFormaPago(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarFp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirFormaPago') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarFormaPago') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarFormaPago') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //#region [OPERACIONES]
  operacionesFormaPago(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.formaPagoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarFormaPago();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.formaPagoService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.mostrarFormulario(new CarPagosCobrosFormaTO(), LS.ACCION_CREAR);
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.mostrarFormulario(this.objetoSeleccionado, LS.ACCION_CONSULTAR);
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.indexTablaEditar = this.objetoSeleccionado.fpSecuencial ? this.listaResultado.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial) :
            this.listaResultado.findIndex(item => item.ctaCodigo === this.objetoSeleccionado.ctaCodigo);
          this.mostrarFormulario(this.objetoSeleccionado, LS.ACCION_EDITAR);
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.indexTablaEditar = this.objetoSeleccionado.fpSecuencial ? this.listaResultado.findIndex(item => item.fpSecuencial === this.objetoSeleccionado.fpSecuencial) :
            this.listaResultado.findIndex(item => item.ctaCodigo === this.objetoSeleccionado.ctaCodigo);
          this.actualizarEstadoFormaPago();
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

  mostrarFormulario(formaPago, accion) {
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      activar: this.activar,
      accion: accion,
      listaSectores: this.listaSectores,
      tamanioEstructura: this.tamanioEstructura,
      formaPago: { ...formaPago },
      listaResultado: this.listaResultado
    }
  }

  //#region [BUSCAR FORMA PAGO]
  buscarFormasPago(inactivos) {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, accion: 'P', inactivos: inactivos };
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
  actualizarEstadoFormaPago() {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let formaPagoCopia = JSON.parse(JSON.stringify(this.objetoSeleccionado));
      let parametros = {
        title: formaPagoCopia.fpInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (formaPagoCopia.fpInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Forma de pago: " + formaPagoCopia.fpDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          formaPagoCopia.fpInactivo = !formaPagoCopia.fpInactivo;
          let parametro = { carPagosCobrosFormaTO: formaPagoCopia, estado: formaPagoCopia.fpInactivo };
          this.formaPagoService.modificarEstadoFormaPago(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.resetear();
        }
      });
    }
  }

  despuesDeModificarEstadoFormaPago(respuesta) {
    this.cargando = false;
    if (respuesta) {
      this.refrescarTabla(respuesta.formaPago, 'U')
      this.toastr.success(respuesta.operacionMensaje, 'Aviso');
    }
    this.resetear();
  }
  //#endregion

  //#region [ELIMINAR FORMA PAGO]
  eliminarFormaPago() {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
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
          this.formaPagoService.accionCarPagosForma(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.resetear();
        }
      });
    }
  }

  despuesDeAccionCarPagosForma(respuesta) {
    this.cargando = false;
    if (respuesta) {
      this.toastr.success(respuesta.operacionMensaje, 'Aviso');
      this.refrescarTabla(this.objetoSeleccionado, 'D');
    }
    this.resetear();
  }
  //#endregion

  //#region [IMPRIMIR Y EXPORTAR FORMA PAGO]
  imprimirFormaPago() {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      let parametros = { listado: this.listaResultado, tipo: 'P' };
      this.formaPagoService.imprimirFormaPago(this, parametros, this.empresaSeleccionada);
    }
  }

  exportarFormaPago() {
    if (this.formaPagoService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      let parametros = { listadoCarPagosForma: this.listaResultado, tipo: 'P' };
      this.formaPagoService.exportarFormaPago(this, parametros, this.empresaSeleccionada);
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
    let perEditar = this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perInactivar = this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true) && !this.objetoSeleccionado.fpInactivo;
    let perActivar = this.formaPagoService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.objetoSeleccionado.fpInactivo;
    let perEliminar = this.formaPagoService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesFormaPago(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesFormaPago(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesFormaPago(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesFormaPago(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesFormaPago(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CREADO://Fue creado o modificado
        if (event.tipo === 'I') {
          this.refrescarTabla(event.formaPago, 'I');
        } else {
          this.refrescarTabla(event.formaPago, 'U');
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
