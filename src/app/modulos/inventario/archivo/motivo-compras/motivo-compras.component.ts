import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { InvComprasMotivoTO } from '../../../../entidadesTO/inventario/InvComprasMotivoTO';
import { MenuItem } from 'primeng/api';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { LS } from '../../../../constantes/app-constants';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { MotivoComprasService } from './motivo-compras.service';
import { NgForm } from '@angular/forms';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-motivo-compras',
  templateUrl: './motivo-compras.component.html',
  styleUrls: ['./motivo-compras.component.css']
})
export class MotivoComprasComponent implements OnInit {
  public listaFormaImprimir: Array<string> = LS.LISTA_MOTIVOS_COMPRA_FORMA_IMPRIMIR;
  public listaFormaContabilizar: Array<string> = LS.LISTA_MOTIVOS_COMPRA_FORMA_CONTABILIZAR;
  public listaResultado: Array<InvComprasMotivoTO> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public objetoSeleccionado: InvComprasMotivoTO = new InvComprasMotivoTO();
  public invComprasMotivoTO: InvComprasMotivoTO = new InvComprasMotivoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public formaContabilizarSeleccionado: string = "";
  public formaImprimirSeleccionado: string = "";
  public constantes: any = LS;
  public tamanioEstructura: number = 0;
  public accion: string = null;
  public codigoCuenta: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
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
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};

  constructor(
    private tipoContableService: TipoContableService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private motivoComprasService: MotivoComprasService) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['motivoCompras'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //Operaciones
  /** Metodo para listar los motivos de compra dependiendo de la empresa*/
  buscarInvComprasMotivoTO(activos) {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activos: activos };
    this.filasTiempo.iniciarContador();
    this.motivoComprasService.listarInvComprasMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo buscarInvComprasMotivoTO()*/
  despuesDeListarInvComprasMotivoTO(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  operacionesMotivoCompras(accion) {
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.activar = false;
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invCompraMotivoTO: new InvComprasMotivoTO(this.objetoSeleccionado),
            listaTipos: this.listaTipos,
            accion: LS.ACCION_CONSULTAR
          }
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.activar = false;
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invComprasMotivoTO: new InvComprasMotivoTO(),
            listaTipos: this.listaTipos,
            accion: LS.ACCION_CREAR
          }
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.activar = false;
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invCompraMotivoTO: new InvComprasMotivoTO(this.objetoSeleccionado),
            listaTipos: this.listaTipos,
            accion: LS.ACCION_EDITAR
          }
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.invComprasMotivoTO = new InvComprasMotivoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.actualizarEstadoInvComprasMotivoTO();
        }
        break;
      }
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.invComprasMotivoTO = new InvComprasMotivoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarInvComprasMotivoTO();
        }
        break;
      }
    }
  }

  actualizarEstadoInvComprasMotivoTO() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let invCompraMotivoTOCopia = JSON.parse(JSON.stringify(this.invComprasMotivoTO));
      let parametros = {
        title: invCompraMotivoTOCopia.cmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (invCompraMotivoTOCopia.cmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo de compra: " + invCompraMotivoTOCopia.cmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          invCompraMotivoTOCopia.cmInactivo = !invCompraMotivoTOCopia.cmInactivo;
          this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvComprasMotivoTO", { invCompraMotivoTO: invCompraMotivoTOCopia }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(invCompraMotivoTOCopia, 'U')
                this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              } else {
                this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              }
              this.resetear();
            }).catch(err => this.utilService.handleError(err, this));

        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  eliminarInvComprasMotivoTO() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.invComprasMotivoTO));
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
          this.api.post("todocompuWS/inventarioWebController/eliminarInvComprasMotivoTO", { invCompraMotivoTO: item }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(item, 'D');
                this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              } else {
                this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              }
              this.resetear();
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  imprimirMotivoCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteMotivoCompra", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoMotivoCompras.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMotivoCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteMotivoCompra", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoMotivoCompras_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.tipoSeleccionado = null;
    this.listarTipos();
    this.limpiarResultado();
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.actualizarFilas();
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
    this.refreshGrid();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perConsultar = true;
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.objetoSeleccionado.cmInactivo;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.objetoSeleccionado.cmInactivo;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operacionesMotivoCompras(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesMotivoCompras(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesMotivoCompras(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesMotivoCompras(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesMotivoCompras(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesMotivoCompras(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesMotivoCompras(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesMotivoCompras(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMotivoCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMotivoCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  ejecutarAccion(event) {
    switch (event.accionChar) {
      case 'I':
        this.refrescarTabla(event.invCompraMotivoTOCopia, 'I');
        this.vistaFormulario = false;
        break;
      case 'U':
        this.refrescarTabla(event.invCompraMotivoTOCopia, 'U');
        this.vistaFormulario = false;
        break;
    }
  }

  refrescarTabla(invComprasMotivoTO: InvComprasMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(invComprasMotivoTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.cmCodigo === invComprasMotivoTO.cmCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = invComprasMotivoTO;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.cmCodigo === invComprasMotivoTO.cmCodigo);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //LISTADOS
  /** Metodo que lista todos los tipos contables segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos ? listaTipos : [];
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.motivoComprasService.generarColumnas();
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
    this.setObjetoSeleccionado(event.rowIndex);
  }

  setObjetoSeleccionado(index) {
    let fila = this.gridApi ? this.gridApi.getRowNode(index) : null;
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
  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth > LS.WINDOW_WIDTH_XS ? true : false;
  }
}
