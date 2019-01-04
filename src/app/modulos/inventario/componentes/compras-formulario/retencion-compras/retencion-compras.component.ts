import { AnxTipoComprobanteComboTO } from './../../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { AnxCompraReembolsoTO } from './../../../../../entidadesTO/anexos/AnxCompraReembolsoTO';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { AnxCompraTO } from '../../../../../entidadesTO/anexos/AnxCompraTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { NgForm } from '@angular/forms';
import { LS } from '../../../../../constantes/app-constants';
import * as moment from 'moment';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { RetencionComprasService } from './retencion-compras.service';
import { InvComprasTO } from '../../../../../entidadesTO/inventario/InvComprasTO';
import { SustentoService } from '../../../../anexos/archivo/sustento/sustento.service';
import { AnxSustentoComboTO } from '../../../../../entidadesTO/anexos/AnxSustentoComboTO';
import { AnxFormaPagoTO } from '../../../../../entidadesTO/anexos/AnxFormaPagoTO';
import { AuthService } from '../../../../../serviciosgenerales/auth.service';
import { InvComprasDetalleTO } from '../../../../../entidadesTO/inventario/InvComprasDetalleTO';
import { FilasTiempo } from '../../../../../enums/FilasTiempo';
import { TooltipReaderComponent } from '../../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../../componentes/numeric-cell/numeric-cell.component';
import { PinnedCellComponent } from '../../../../componentes/pinned-cell/pinned-cell.component';
import { FilasResolve } from '../../../../../serviciosgenerales/filas.resolve';
import { ContextMenu } from 'primeng/contextmenu';
import { ConceptosRetencionComponent } from '../../../../tributacion/archivo/conceptos-retencion/conceptos-retencion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnxConceptoTO } from '../../../../../entidadesTO/anexos/AnxConceptoTO';
import { AnxCompraDetalleRetencionTO } from '../../../../../entidadesTO/anexos/AnxCompraDetalleRetencionTO';
import { ToastrService } from 'ngx-toastr';
import { AnxCompraDetalleTO } from '../../../../../entidadesTO/anexos/AnxCompraDetalleTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ListadoProveedoresComponent } from '../../listado-proveedores/listado-proveedores.component';
import { InvProveedorTO } from '../../../../../entidadesTO/inventario/InvProveedorTO';
import { AppSistemaService } from '../../../../../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-retencion-compras',
  templateUrl: './retencion-compras.component.html',
  styleUrls: ['./retencion-compras.component.css']
})
export class RetencionComprasComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @ViewChild("menuOpcionesReembolso") menuOpcionesReembolso: ContextMenu;

  @Input() empresaSeleccionada;
  @Input() parametrosRetencion;
  @Input() activar;
  @Input() fechaCompra;
  @Input() fechaAutorizacion;
  @Input() fechaCaduca;

  @Output() enviarAccion = new EventEmitter();
  @Output() mostrarRetencionCompras = new EventEmitter();
  @Input() comprobarRetencionAutorizadaProcesamiento: boolean = false;

  public fechaActual: any = null;
  public invCompraTO: InvComprasTO = new InvComprasTO();
  public listInvComprasDetalleTO: Array<InvComprasDetalleTO> = [];
  //Reembolso
  public listaDocumentosReembolso: Array<AnxTipoComprobanteComboTO> = [];
  public listAnxCompraReembolsoTO: Array<AnxCompraReembolsoTO> = [];
  public listAnxCompraReembolsoTOCopia: Array<AnxCompraReembolsoTO> = [];
  public listAnxCompraReembolsoTOEliminar: Array<AnxCompraReembolsoTO> = [];
  public anxCompraReembolsoTOSeleccionado: AnxCompraReembolsoTO = new AnxCompraReembolsoTO();
  //Detalle retencion
  public listAnxCompraDetalleRetencionTO: Array<AnxCompraDetalleRetencionTO> = [];//Para mostrar en tabla
  public listAnxCompraDetalleTO: Array<AnxCompraDetalleTO> = [];//Para enviar a server
  public listAnxCompraDetalleTOEliminar: Array<AnxCompraDetalleTO> = [];//Para enviar a server

  public detalleSeleccionado: AnxCompraDetalleRetencionTO;
  //Forma de pago
  public listaFormaPago: Array<AnxFormaPagoTO> = [];
  public formaPagoSeleccionadaInicial: AnxFormaPagoTO = null;
  public formaPagoSeleccionada: AnxFormaPagoTO = null;
  public formaPagoSeleccionadaEliminar: AnxFormaPagoTO = null;

  public listadoSustentos: Array<AnxSustentoComboTO> = new Array();
  public listadoBienes = LS.LISTA_PORCENTAJE_IVA_BIENES;
  public listadoServicios = LS.LISTA_PORCENTAJE_IVA_SERVICIOS;
  public listadoServicios100 = LS.LISTA_PORCENTAJE_IVA_SERVICIOS_100;

  public anxCompraTO: AnxCompraTO = new AnxCompraTO();

  public totalIva: number = 0;
  public constantes: object = null;
  public accion: string = null;
  public cargando: boolean = false;
  //Numero retencion
  public isRequeridoNumeroAuto: boolean = true;
  //Fecha retencion
  public fechaRetencion: any = new Date();
  public isFechaDentroDeDiasHabiles: boolean = true;
  public isFechaMismoMes: boolean = true;
  //Retenciom
  public numeroDocValido000: boolean = true;
  //Complemento
  public listaDocumentos: Array<AnxTipoComprobanteComboTO> = [];
  public numeroDocValidoComplemento000: boolean = true;
  public numeroAutorizacionValidaLongitud: boolean = true;
  public numeroRepetido: boolean = false;
  //AG-GRID
  public screamXS: boolean = true;
  public opciones: MenuItem[];
  public opcionesReembolso: MenuItem[];
  public gridApi: GridApi;
  public gridApiReembolso: GridApi;
  public gridColumnApi: any;
  public gridColumnApiReembolso: any;
  public columnDefs: Array<object> = [];
  public columnDefsReembolso: Array<object> = [];

  public columnDefsSelected: Array<object> = [];
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public pinnedBottomRowData;
  public rowClassRules;
  public configuracionAutoNumeric: AppAutonumeric;
  public rowSelection: string = "single";
  public isCollapsed: boolean = false;
  public estilos: any = {};
  @ViewChild("frmRetencion") frmRetencion: NgForm;
  public valoresIniciales: any;
  public listaInicial: any;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public es: object = {};
  public configAutonumeric: AppAutonumeric;

  constructor(
    private filasService: FilasResolve,
    private modalService: NgbModal,
    private authService: AuthService,
    private utilService: UtilService,
    private sustentoService: SustentoService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private appSistemaService: AppSistemaService,
    private retencionComprasService: RetencionComprasService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.configAutonumeric = this.retencionComprasService.obtenerAutonumeric();
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.configuracionAutoNumeric = this.retencionComprasService.obtenerAutonumeric();
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    if (this.parametrosRetencion) {
      this.obtenerFechaActual();
      this.operacionesRetencion();
      this.inicializarAtajos();
    }
  }

  obtenerFechaActual() {
    this.cargando = true;
    this.appSistemaService.obtenerFechaActual(this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerFechaActual(data) {
    this.cargando = false;
    this.fechaActual = this.utilService.formatoStringSinZonaHorariaDDMMYYYY(data);
  }

  operacionesRetencion() {
    this.accion = this.parametrosRetencion.accion;
    switch (this.accion) {
      case LS.ACCION_CREADO: {
        this.invCompraTO = this.parametrosRetencion.invCompraTO ? this.parametrosRetencion.invCompraTO : new InvComprasTO();
        this.anxCompraTO = this.parametrosRetencion.anxCompraTO ? this.parametrosRetencion.anxCompraTO : new AnxCompraTO();
        this.anxCompraTO.compMontoiva = this.invCompraTO.compMontoIva;
        this.fechaRetencion = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.anxCompraTO.compRetencionFechaEmision);
        this.totalIva = this.invCompraTO.compMontoIva;
        this.formaPagoSeleccionada = this.parametrosRetencion.anxFormaPagoTO ? this.parametrosRetencion.anxFormaPagoTO : null;
        this.listAnxCompraDetalleRetencionTO = this.parametrosRetencion.listAnxCompraDetalleRetencionTO ? this.parametrosRetencion.listAnxCompraDetalleRetencionTO : [];
        this.listAnxCompraReembolsoTO = this.parametrosRetencion.listAnxCompraReembolsoTO ? this.parametrosRetencion.listAnxCompraReembolsoTO : [];
        this.obtenerDatosBasicosRetencionCreada();
        break;
      }
      case LS.ACCION_CREAR: {
        this.fechaRetencion = this.fechaCompra;
        this.invCompraTO = this.parametrosRetencion.invCompraTO ? this.parametrosRetencion.invCompraTO : new InvComprasTO();
        this.anxCompraTO = this.parametrosRetencion.anxCompraTO ? this.parametrosRetencion.anxCompraTO : new AnxCompraTO();
        this.anxCompraTO.compMontoiva = this.invCompraTO.compMontoIva;
        this.listInvComprasDetalleTO = this.parametrosRetencion.listInvComprasDetalleTO ? this.parametrosRetencion.listInvComprasDetalleTO : [];
        this.totalIva = this.invCompraTO.compMontoIva;
        this.obtenerDatosBasicosRetencionNueva();
        break;
      }
      case LS.ACCION_MAYORIZAR:
        this.consultarRetencion();
        break;
      case LS.ACCION_CONSULTAR: {
        this.consultarRetencion();
        break;
      }
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarRetencion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarRetencion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  nuevoItem() {
    let detalle = new AnxCompraDetalleRetencionTO();
    return detalle;
  }

  nuevoItemReembolso() {
    let detalle = new AnxCompraReembolsoTO();
    return detalle;
  }

  listarSustentos() {
    this.cargando = true;
    let parametros = {};
    this.listadoSustentos = [];
    this.sustentoService.listarAnxSustentoTO(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnxSustentoTO(data) {
    this.listadoSustentos = data;
    this.cargando = false;
  }

  listarFormaPago() {
    this.cargando = true;
    let parametros = {};
    this.listaFormaPago = [];
    this.retencionComprasService.listarAnexoFormaPagoTO(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnexoFormaPagoTO(data) {
    this.listaFormaPago = data;
    this.cargando = false;
  }

  /**Retencion ya aceptada */
  obtenerDatosBasicosRetencionCreada() {
    let invCompra: InvComprasTO = JSON.parse(JSON.stringify(this.invCompraTO));
    invCompra.compFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaCompra);
    this.cargando = true;
    let parametros = {
      invComprasTO: invCompra,
      empresa: this.empresaSeleccionada.empCodigo
    };
    this.retencionComprasService.obtenerDatosBasicosRetencionCreada(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosBasicosRetencionCreada(respuesta) {
    this.listaDocumentos = respuesta.listaDocumentos;
    this.listaFormaPago = respuesta.listAnxFormaPagoTO;
    this.listadoSustentos = respuesta.listAnxSustentoComboTO;
    this.listaDocumentosReembolso = respuesta.listaDocumentosReembolso;
    this.cargando = false;
    this.iniciarAgGrid();
    if (this.invCompraTO.compDocumentoTipo && this.invCompraTO.compDocumentoTipo === LS.CODIGO_REEMBOLSO) {
      this.iniciarAgGridReembolso();
    }
    this.mostrarRetencionCompras.emit(true);
  }

  /**Nueva retencion */
  obtenerDatosBasicosRetencionNueva() {
    this.cargando = true;
    let parametros = {
      compDocumentoNumero: this.invCompraTO.compDocumentoNumero,
      compDocumentoTipo: this.invCompraTO.compDocumentoTipo,
      compFecha: this.invCompraTO.compFecha,
      fechaRetencion: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion))),
      provCodigo: this.invCompraTO.provCodigo,
      empresa: this.empresaSeleccionada.empCodigo,
      usuarioCodigo: this.authService.getCodigoUser(),
      listaInvComprasDetalleTO: this.listInvComprasDetalleTO
    };
    this.retencionComprasService.obtenerDatosBasicosRetencionNueva(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosBasicosRetencionNueva(respuesta) {
    if (respuesta.anxNumeracionLineaTO) {
      let ultimaSecuencia = respuesta.secuenciaNumeroFactura;
      ultimaSecuencia += 1;
      ultimaSecuencia = this.utilService.completarCeros9(ultimaSecuencia);
      let numeroRetencion = respuesta.parteEstatica + ultimaSecuencia;
      this.anxCompraTO.compRetencionAutorizacion = respuesta.anxNumeracionLineaTO ? respuesta.anxNumeracionLineaTO.numeroAutorizacion : null;
      this.anxCompraTO.compRetencionNumero = numeroRetencion;
    } else {
      this.anxCompraTO.compRetencionAutorizacion = null;
      this.anxCompraTO.compRetencionNumero = null;
    }
    this.listaDocumentos = respuesta.listaDocumentos;
    this.listaFormaPago = respuesta.listAnxFormaPagoTO;
    this.listadoSustentos = respuesta.listAnxSustentoComboTO;
    this.cargando = false;
    this.listAnxCompraDetalleRetencionTO = respuesta.listAnxCompraDetalleRetencionTO;

    if (this.listAnxCompraDetalleRetencionTO.length === 0) {
      this.listAnxCompraDetalleRetencionTO = this.parametrosRetencion.listAnxCompraDetalleRetencionTO ? this.parametrosRetencion.listAnxCompraDetalleRetencionTO : [];
      this.listAnxCompraDetalleRetencionTO.length === 0 ? this.listAnxCompraDetalleRetencionTO.push(this.nuevoItem()) : null;
    }
    this.iniciarAgGrid();
    /**Reembolso */
    if (this.invCompraTO.compDocumentoTipo && this.invCompraTO.compDocumentoTipo === LS.CODIGO_REEMBOLSO) {
      this.listaDocumentosReembolso = respuesta.listaDocumentosReembolso;
      this.listAnxCompraReembolsoTO = this.parametrosRetencion.listAnxCompraReembolsoTO ? this.parametrosRetencion.listAnxCompraReembolsoTO : [];
      if (this.listAnxCompraReembolsoTO.length === 0) {
        this.listAnxCompraReembolsoTO.push(this.nuevoItemReembolso());
      }
      this.iniciarAgGridReembolso();
    }
    this.mostrarRetencionCompras.emit(true);
  }

  /**Consultar retencion */
  consultarRetencion() {
    this.cargando = true;
    let parametros = this.parametrosRetencion.parametrosBusqueda;
    this.retencionComprasService.consultarRetencionCompra(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeConsultarRetencionCompra(respuesta) {
    if (respuesta.anxCompraTO) {
      this.formaPagoSeleccionada = respuesta.formaPagoRetencion.length > 0 ? new AnxFormaPagoTO({ fpCodigo: respuesta.formaPagoRetencion[0].fpCodigo }) : null;
      this.formaPagoSeleccionadaInicial = JSON.parse(JSON.stringify(this.formaPagoSeleccionada));
      this.anxCompraTO = respuesta.anxCompraTO;
      this.totalIva = this.anxCompraTO.compMontoiva;
      this.invCompraTO = respuesta.invComprasTO;
      this.fechaRetencion = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.anxCompraTO.compRetencionFechaEmision);
      this.listaFormaPago = respuesta.listAnxFormaPagoTO;
      this.listadoSustentos = respuesta.listAnxSustentoComboTO;
      this.listAnxCompraDetalleRetencionTO = respuesta.listAnxCompraDetalleRetencionTO;
      this.listaDocumentos = respuesta.listaDocumentos;
      this.cargando = false;
      this.iniciarAgGrid();
      /**Reembolso */
      if (this.invCompraTO.compDocumentoTipo && this.invCompraTO.compDocumentoTipo === LS.CODIGO_REEMBOLSO) {
        this.listaDocumentosReembolso = respuesta.listaDocumentosReembolso;
        this.listAnxCompraReembolsoTO = respuesta.listAnxCompraReembolsoTO;
        this.iniciarAgGridReembolso();
      }
      this.mostrarRetencionCompras.emit(true);
    } else {
      this.cargando = false;
      this.toastr.warning("No tiene retención", 'Aviso');
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  inicializarFormaPago(fp: AnxFormaPagoTO, fp2: AnxFormaPagoTO) {
    if (fp && fp2) {
      return fp.fpCodigo === fp2.fpCodigo;
    }
  }

  cancelar() {
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR })
  }

  cambiarEstadoActivar() {
    this.activar = !this.activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.retencionComprasService.generarColumnasDetalle(this); //crea las colunmas - Siempre en un servicio
    this.columnDefsSelected = this.columnDefs.slice(); // define columnas seleccionadas para el combo de seleccion
    this.context = { componentParent: this }; //compartir el contexto padre a la grilla
    this.frameworkComponents = { //componentes adicionales a incrustar en la tabla
      toolTip: TooltipReaderComponent,
      numericCell: NumericCellComponent,
      pinnedCell: PinnedCellComponent,
    };
    this.components = {}; //componentes adicionales
  }

  iniciarAgGridReembolso() {
    this.columnDefsReembolso = this.retencionComprasService.generarColumnasReembolsoDetalle(this); //crea las colunmas - Siempre en un servicio
    this.context = { componentParent: this }; //compartir el contexto padre a la grilla
  }

  onGridReadyReembolso(params) {
    this.gridApiReembolso = params.api; //inicializa la grilla
    this.gridColumnApiReembolso = params.columnApi; //columnas de la grilla
    this.actualizarFilas(); //se debe actualizar las filas para el footer, incluye el tiempo
    this.redimensionarColumnas();
    this.seleccionarPrimerFilaReembolso()
    this.inicializarListadoReembolso();
  }

  onGridReady(params) {
    this.gridApi = params.api; //inicializa la grilla
    this.gridColumnApi = params.columnApi; //columnas de la grilla
    this.actualizarFilas(); //se debe actualizar las filas para el footer, incluye el tiempo
    this.redimensionarColumnas();
    this.seleccionarPrimerFila()
    this.calcularTotal();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  seleccionarPrimerFilaReembolso() {
    if (this.gridApiReembolso) {
      var firstCol = this.gridColumnApiReembolso.getAllDisplayedColumns()[0];
      this.gridApiReembolso.setFocusedCell(0, firstCol);
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
    this.gridApiReembolso ? this.gridApiReembolso.sizeColumnsToFit() : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  refreshGridReembolso() {
    this.gridApiReembolso ? this.gridApiReembolso.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    if (this.gridApi && columna && columna.getId()) {
      this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() });
    }
    this.detalleSeleccionado = fila ? fila.data : null;
  }

  filaFocusedReembolso(event) {
    let fila = this.gridApiReembolso ? this.gridApiReembolso.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApiReembolso ? this.gridApiReembolso.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    if (this.gridApiReembolso && columna && columna.getId()) {
      this.gridApiReembolso.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() });
    }
    this.anxCompraReembolsoTOSeleccionado = fila ? fila.data : null;
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event']) onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  //MENU
  mostrarContextMenu(data, rowIndex, event) {
    this.detalleSeleccionado = data;
    this.generarOpcionesDetalle(rowIndex);
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  mostrarContextMenuReembolso(data, rowIndex, event) {
    this.anxCompraReembolsoTOSeleccionado = data;
    this.generarOpcionesDetalleReembolso(rowIndex);
    this.menuOpcionesReembolso.show(event);
    event.stopPropagation();
  }

  mostrarOpciones(event, dataSelected, tipo?) {
    if (tipo === 'reembolso') {
      let filasFocusedCell = this.gridApi ? this.gridApiReembolso.getFocusedCell() : null;
      if (filasFocusedCell) {
        this.mostrarContextMenuReembolso(dataSelected, filasFocusedCell.rowIndex, event);
      }
    } else {
      let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
      if (filasFocusedCell) {
        this.mostrarContextMenu(dataSelected, filasFocusedCell.rowIndex, event);
      }
    }
  }

  generarOpcionesDetalleReembolso(rowIndex) {
    let permiso = (this.accion === LS.ACCION_MAYORIZAR || this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO);
    let permisoEliminar = (this.accion === LS.ACCION_MAYORIZAR || this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO);

    this.opcionesReembolso = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFilaReembolso('up', rowIndex) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFilaReembolso('down', rowIndex) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permisoEliminar, command: () => permisoEliminar ? this.eliminarFilaReembolso(rowIndex) : null },
    ];
  }

  generarOpcionesDetalle(rowIndex) {
    let permiso = (this.accion === LS.ACCION_MAYORIZAR || this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO);
    let permisoEliminar = (this.accion === LS.ACCION_MAYORIZAR || this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO);

    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', rowIndex) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', rowIndex) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permisoEliminar, command: () => permisoEliminar ? this.eliminarFila(rowIndex) : null },
    ];
  }

  agregarFilaReembolso(ubicacion: string, rowIndex, noFocused?) {
    let index = rowIndex;
    if (index >= 0) {
      this.agregarFilaByIndexReembolso(index, ubicacion, noFocused);
    }
  }

  agregarFila(ubicacion: string, rowIndex, noFocused?) {
    let index = rowIndex;
    if (index >= 0) {
      this.agregarFilaByIndex(index, ubicacion, noFocused);
    }
  }

  agregarFilaByIndex(index, ubicacion, noFocused?) {
    this.detalleSeleccionado = this.listAnxCompraDetalleRetencionTO[index];
    let indexNuevo = ubicacion === 'up' ? index : index + 1;
    var nuevoItem = this.nuevoItem();
    this.listAnxCompraDetalleRetencionTO.splice(indexNuevo, 0, nuevoItem);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexNuevo }) : null;
    if (!noFocused) {
      this.retencionComprasService.focusedConcepto(indexNuevo, this.gridApi);
    } else {
      this.retencionComprasService.base0FocusAndEditingCell(index, this.gridApi);
    }
    this.refreshGridReembolso();
  }

  agregarFilaByIndexReembolso(index, ubicacion, noFocused?) {
    this.anxCompraReembolsoTOSeleccionado = this.listAnxCompraReembolsoTO[index];
    let indexNuevo = ubicacion === 'up' ? index : index + 1;
    var nuevoItem = this.nuevoItemReembolso();
    this.listAnxCompraReembolsoTO.splice(indexNuevo, 0, nuevoItem);
    this.gridApiReembolso ? this.gridApiReembolso.updateRowData({ add: [nuevoItem], addIndex: indexNuevo }) : null;
    if (!noFocused) {
      this.retencionComprasService.focusedProveedor(indexNuevo, this.gridApiReembolso);
    } else {
      this.retencionComprasService.base0ReembolsoFocusAndEditingCell(index, this.gridApiReembolso);
    }
    this.refreshGridReembolso();
  }

  eliminarFila(index) {
    if (this.listAnxCompraDetalleRetencionTO.length > 1) {
      if (this.detalleSeleccionado.detSecuencial && this.detalleSeleccionado.detSecuencial != 0) {
        let detalleEliminar: AnxCompraDetalleRetencionTO = JSON.parse(JSON.stringify(this.detalleSeleccionado));
        let detalleNuevo = new AnxCompraDetalleTO();
        detalleNuevo.divSecuencial = detalleEliminar.detSecuencial;
        detalleNuevo.detConcepto = detalleEliminar.detConcepto;
        detalleNuevo.compEmpresa = this.empresaSeleccionada.empCodigo;
        this.listAnxCompraDetalleTOEliminar.push(detalleNuevo);
      }
      this.listAnxCompraDetalleRetencionTO.splice(index, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [this.detalleSeleccionado], addIndex: index }) : null;
      this.calcularTotal();
      this.refreshGrid();
    }
  }

  eliminarFilaReembolso(index) {
    if (this.listAnxCompraReembolsoTO.length > 1) {
      if (this.anxCompraReembolsoTOSeleccionado.reembSecuencial && this.anxCompraReembolsoTOSeleccionado.reembSecuencial != 0) {
        let detalleEliminar: AnxCompraReembolsoTO = JSON.parse(JSON.stringify(this.anxCompraReembolsoTOSeleccionado));
        delete detalleEliminar.provCodigoCopia;
        this.listAnxCompraReembolsoTOEliminar.push(detalleEliminar);
      }
      this.listAnxCompraReembolsoTO.splice(index, 1);
      this.gridApiReembolso ? this.gridApiReembolso.updateRowData({ remove: [this.anxCompraReembolsoTOSeleccionado], addIndex: index }) : null;
      this.refreshGridReembolso();
    }
  }

  //Concepto
  buscarConcepto(params) {
    let keyCode = params.event.keyCode;
    let conCodigoInput = params.event.target.value;
    let conCodigo = params.data.conCodigo;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.conCodigo = conCodigoInput;
      let fueBuscado = (conCodigoInput === conCodigo && conCodigoInput && conCodigo);
      if (!fueBuscado) {
        conCodigoInput = conCodigoInput ? conCodigoInput.toUpperCase() : null;
        if (conCodigoInput) {
          let parametroBusquedaConcepto = {
            empresa: this.empresaSeleccionada.empCodigo, busqueda: conCodigoInput, categoria: null,
            fechaRetencion: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion)))
          };
          this.abrirModalConcepto(parametroBusquedaConcepto, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.retencionComprasService.base0FocusAndEditingCell(params.node.rowIndex, this.gridApi);
          } else {
            this.retencionComprasService.base0FocusAndEditingCell(params.node.rowIndex, this.gridApi);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.retencionComprasService.base0FocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.retencionComprasService.base0FocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }
    }
  }

  abrirModalConcepto(parametroBusquedaConcepto, params) {
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO || this.accion === LS.ACCION_MAYORIZAR) {
      const modalRef = this.modalService.open(ConceptosRetencionComponent, { size: 'lg', backdrop: 'static', windowClass: 'miSize' });
      modalRef.componentInstance.parametrosBusqueda = parametroBusquedaConcepto;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          let resultado = new AnxConceptoTO(result);
          params.event.target.value = resultado.conCodigo;
          params.data.detConcepto = resultado.conCodigo;
          params.data.conCodigoCopia = resultado.conCodigo;
          params.data.nombreConcepto = resultado.conConcepto;
          params.data.detPorcentaje = resultado.conPorcentaje;
          this.refreshGrid();
          this.calcularValorRetenido(params.data);
          this.retencionComprasService.base0FocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.retencionComprasService.focusedConcepto(params.node.rowIndex, this.gridApi);
        }
      }, () => {
        params.data.conCodigo = "";
        this.validarConcepto(params.data);
        this.retencionComprasService.base0FocusAndEditingCell(params.node.rowIndex, this.gridApi);
      });
    }
  }

  validarConcepto(detalle: AnxCompraDetalleRetencionTO): boolean {
    if (detalle.detConcepto !== detalle.conCodigoCopia) {
      this.resetearConcepto(detalle);
      return false;
    }
    return true;
  }

  resetearConcepto(detalle: AnxCompraDetalleRetencionTO) {
    detalle.conCodigoCopia = null;//Se borra la copia
    detalle.detConcepto = null;
    detalle.nombreConcepto = null;
    this.refreshGrid();
  }

  alCambiarValorDeCelda(event) {
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO || this.accion === LS.ACCION_MAYORIZAR) {
      if (event.colDef.field === "detConcepto") {
        this.validarConcepto(event.data);
      }
      if (event.colDef.field === "detBase0" || event.colDef.field === "detBaseImponible" || event.colDef.field === "detBaseNoObjetoIva") {
        this.calcularValorRetenido(event.data);
      }
    }
  }

  //Validaciones
  validarFechasDeRetencionYComprasMismoMes() {
    if (this.fechaRetencion) {
      this.isFechaMismoMes = false;
      this.cargando = true;
      let parametro = {
        fechaCompra: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaCompra))),
        fechaRetencion: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion)))
      };
      this.retencionComprasService.validarFechasDeRetencionYComprasMismoMes(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeValidarFechasDeRetencionYComprasMismoMes(respuesta) {
    this.cargando = false;
    this.isFechaMismoMes = respuesta;
  }

  validarFechaDiasHabiles() {
    if (this.fechaRetencion) {
      this.isFechaDentroDeDiasHabiles = false;
      this.cargando = true;
      let parametro = {
        fechaCompra: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaCompra))),
        fechaRetencion: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion)))
      };
      this.retencionComprasService.validarFechaDiasHabiles(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeValidarFechaDiasHabiles(respuesta) {
    this.cargando = false;
    this.isFechaDentroDeDiasHabiles = respuesta;
  }

  validarNumeroDocumento() {
    if (this.anxCompraTO.compRetencionNumero && this.utilService.buscar_EnString(this.anxCompraTO.compRetencionNumero)) {
      this.anxCompraTO.compRetencionNumero = null;
    }
    this.anxCompraTO.compRetencionNumero = this.anxCompraTO.compRetencionNumero === "" ? null : this.anxCompraTO.compRetencionNumero;
    if (this.anxCompraTO.compRetencionNumero) {
      this.numeroDocValido000 = false;
      let part1 = this.anxCompraTO.compRetencionNumero.substring(3, 0);
      let part2 = this.anxCompraTO.compRetencionNumero.substring(7, 4);
      let part3 = this.anxCompraTO.compRetencionNumero.substring(17, 8);
      if (part1 !== '000' && part2 !== '000' && part3 !== '000000000') {
        this.numeroDocValido000 = true;
        this.cargando = true;
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          numeroRetencion: this.anxCompraTO.compRetencionNumero,
          numeroComprobante: LS.CODIGO_COMPROBANTE_RETENCION,
          fechaVencimiento: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion)))
        };
        this.retencionComprasService.obtenerAutorizacionRetencion(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    } else {
      this.anxCompraTO.compRetencionAutorizacion = null;
    }
  }

  despuesDeObtenerAutorizacionRetencion(respuesta) {
    this.anxCompraTO.compRetencionAutorizacion = respuesta.numeroAutorizacion;
    this.cargando = false;
  }

  calcularValorRetenido(item: AnxCompraDetalleRetencionTO) {
    var suma = this.utilService.convertirDecimaleFloat(item.detBase0) + this.utilService.convertirDecimaleFloat(item.detBaseImponible) + this.utilService.convertirDecimaleFloat(item.detBaseNoObjetoIva);
    item.detValorRetenido = suma * (this.utilService.convertirDecimaleFloat(item.detPorcentaje) / 100);
    this.refreshGrid();
    this.calcularTotal();
  }

  calcularTotal() {
    let suma = 0;
    let sumBase0 = 0;
    let sumBaseImp = 0;
    let sumBaseNG = 0;
    this.gridApi.forEachNode((rowNode) => {
      let value: AnxCompraDetalleRetencionTO = rowNode.data;
      suma += this.utilService.convertirDecimaleFloat(value.detValorRetenido);
      sumBase0 += this.utilService.convertirDecimaleFloat(value.detBase0);
      sumBaseImp += this.utilService.convertirDecimaleFloat(value.detBaseImponible);
      sumBaseNG += this.utilService.convertirDecimaleFloat(value.detBaseNoObjetoIva);
    })
    this.isRequeridoNumeroAuto = (suma !== 0);
    this.anxCompraTO.valorRetencion = suma;
    this.anxCompraTO.compBase0 = sumBase0;
    this.anxCompraTO.compBaseimponible = sumBaseImp;
    this.anxCompraTO.compBasenoobjetoiva = sumBaseNG;
  }

  calcularPorcRetBienes() {
    this.anxCompraTO.compValorbienes = this.utilService.convertirDecimaleFloat(this.anxCompraTO.compBaseivabienes) * (this.utilService.convertirDecimaleFloat(this.anxCompraTO.compPorcentajebienes) / 100);
  }

  calcularPorcRetServicios() {
    this.anxCompraTO.compValorservicios = this.utilService.convertirDecimaleFloat(this.anxCompraTO.compBaseivaservicios) * (this.utilService.convertirDecimaleFloat(this.anxCompraTO.compPorcentajeservicios) / 100);
  }

  calcularPorcRetServiciosProfesional() {
    this.anxCompraTO.compValorserviciosprofesionales = this.utilService.convertirDecimaleFloat(this.anxCompraTO.compBaseivaserviciosprofesionales) * (this.utilService.convertirDecimaleFloat(this.anxCompraTO.compPorcentajeserviciosprofesionales) / 100);
  }

  //Operaciones
  guardarRetencion(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      if (this.sePuedeGuardar()) {
        this.validarRetencionCompra();
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  validarRetencionCompra() {
    this.invCompraTO.empCodigo = this.empresaSeleccionada.empCodigo;
    this.invCompraTO.compValorRetenido = this.anxCompraTO.valorRetencion;
    this.anxCompraTO.empCodigo = this.empresaSeleccionada.empCodigo;
    this.anxCompraTO.compRetencionFechaEmision = this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion)));
    this.anxCompraTO.compRetencionNumero = this.anxCompraTO.compRetencionNumero === "" ? null : this.anxCompraTO.compRetencionNumero;
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      usuario: this.authService.getCodigoUser(),
      invComprasTO: this.invCompraTO,
      anxCompraTO: this.anxCompraTO
    };
    this.retencionComprasService.validarRetencionCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeValidarRetencionCompra() {
    this.cargando = false;
    this.validarFechasRetencionCompras();
  }

  validarFechasRetencionCompras() {
    this.cargando = true;
    let parametro = {
      fechaCompra: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaCompra),
      fechaRetencion: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaRetencion),
      fechaEmision: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaAutorizacion),
      fechaCaduca: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaCaduca),
      compAutorizacion: this.anxCompraTO.compAutorizacion,
      isCompRetencionAsumida: this.invCompraTO.compRetencionAsumida
    };
    this.retencionComprasService.validarFechaRetencion(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeValidarFechaRetencion() {
    this.cargando = false;
    this.validarRetencionDesdeCompra();
  }

  validarRetencionDesdeCompra() {
    this.anxCompraTO.compRetencionFechaEmision = this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaRetencion)));
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      invComprasTO: this.invCompraTO,
      anxCompraTO: this.anxCompraTO
    };
    this.retencionComprasService.validarRetencionDesdeCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeValidarRetencionDesdeCompra() {
    this.cargando = false;
    //Creado: parametros{listAnxCompraDetalleRetencionTO,listAnxCompraDetalleTO,listAnxCompraDetalleTOEliminar,listAnxCompraReembolsoTO,listAnxCompraReembolsoTOEliminar,anxCompraTO,anxCompraFormaPagoTO,anxCompraFormaPagoEliminarTO}

    if (this.formaPagoSeleccionadaInicial && this.formaPagoSeleccionadaInicial.fpCodigo !== this.formaPagoSeleccionada.fpCodigo) {
      this.formaPagoSeleccionadaEliminar = this.formaPagoSeleccionadaInicial;
    }

    let parametrosEnviar = {
      listAnxCompraDetalleRetencionTO: this.listAnxCompraDetalleRetencionTO,//Visualizar despues de guardar
      listAnxCompraDetalleTO: this.listAnxCompraDetalleTO,
      listAnxCompraDetalleTOEliminar: this.listAnxCompraDetalleTOEliminar,
      listAnxCompraReembolsoTO: this.listAnxCompraReembolsoTOCopia,
      listAnxCompraReembolsoTOEliminar: this.listAnxCompraReembolsoTOEliminar,
      anxCompraTO: this.anxCompraTO,
      anxFormaPagoTO: this.formaPagoSeleccionada,
      anxFormaPagoTOEliminar: this.formaPagoSeleccionadaEliminar,
      compRetencionAsumida: this.invCompraTO.compRetencionAsumida
    }
    this.enviarAccion.emit({ accion: LS.ACCION_CREADO, parametros: parametrosEnviar })
  }

  sePuedeGuardar(): boolean {
    let sinErrores = true;
    if (!this.isFechaDentroDeDiasHabiles
      || !this.isFechaMismoMes
      || !this.numeroDocValido000
      || !this.numeroDocValidoComplemento000
      || this.numeroRepetido
      || !this.numeroAutorizacionValidaLongitud
      || !this.validarYFormatearDetalleAntesEnviar()) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
      sinErrores = false;
    }
    return sinErrores;
  }

  validarYFormatearDetalleAntesEnviar() {
    this.listAnxCompraDetalleTO = [];
    let listAnxCompraReembolsoTOCopia = [];

    let listAnxCompraDetalleRetencionTOCopia = JSON.parse(JSON.stringify(this.listAnxCompraDetalleRetencionTO));
    listAnxCompraReembolsoTOCopia = JSON.parse(JSON.stringify(this.listAnxCompraReembolsoTO));

    for (let i = 0; i < listAnxCompraDetalleRetencionTOCopia.length; i++) {
      let element = listAnxCompraDetalleRetencionTOCopia[i];
      let anxCompraDetalleTO = new AnxCompraDetalleTO(element);
      if (!element.detConcepto) {
        return false;
      }
      anxCompraDetalleTO.compEmpresa = this.empresaSeleccionada.empCodigo;
      anxCompraDetalleTO.detOrden = i;
      this.listAnxCompraDetalleTO.push(anxCompraDetalleTO);
    }
    /**Reembolso */
    for (let i = 0; i < listAnxCompraReembolsoTOCopia.length; i++) {
      let item = listAnxCompraReembolsoTOCopia[i];
      let anxCompraReembolsoTO = new AnxCompraReembolsoTO(item);
      if (!anxCompraReembolsoTO.provCodigo || !anxCompraReembolsoTO.reembDocumentoTipo || !anxCompraReembolsoTO.reembDocumentoNumero || !anxCompraReembolsoTO.reembFechaemision || !anxCompraReembolsoTO.reembAutorizacion) {
        console.log(i)
        return false;
      }

      if (anxCompraReembolsoTO.reembDocumentoNumero) {
        let part1 = anxCompraReembolsoTO.reembDocumentoNumero.substring(3, 0);
        let part2 = anxCompraReembolsoTO.reembDocumentoNumero.substring(7, 4);
        let part3 = anxCompraReembolsoTO.reembDocumentoNumero.substring(17, 8);
        if (part1 === '000' || part2 == '000' && part3 === '000000000') {
          return false;
        }
      }

      if (anxCompraReembolsoTO.reembAutorizacion) {
        if (anxCompraReembolsoTO.reembAutorizacion.length !== 10 && anxCompraReembolsoTO.reembAutorizacion.length !== 37 && anxCompraReembolsoTO.reembAutorizacion.length !== 49) {
          return false;
        }
      }
      anxCompraReembolsoTO.auxDocTipo_Abreviatura = anxCompraReembolsoTO.reembDocumentoTipo;
      anxCompraReembolsoTO.provEmpresa = this.empresaSeleccionada.empCodigo;
      anxCompraReembolsoTO.compEmpresa = this.empresaSeleccionada.empCodigo;
      delete anxCompraReembolsoTO.provCodigoCopia;//Eliminar temporal
      this.listAnxCompraReembolsoTOCopia.push(anxCompraReembolsoTO);
    }

    return true;
  }

  //***************************************Complemento********************************************
  validarDocumentoComplemento() {
    if (this.anxCompraTO.compModificadoDocumentoNumero && this.utilService.buscar_EnString(this.anxCompraTO.compModificadoDocumentoNumero)) {
      this.anxCompraTO.compModificadoDocumentoNumero = null;
    }
    if (this.anxCompraTO.compModificadoDocumentoNumero) {
      this.numeroDocValidoComplemento000 = false;
      let part1 = this.anxCompraTO.compModificadoDocumentoNumero.substring(3, 0);
      let part2 = this.anxCompraTO.compModificadoDocumentoNumero.substring(7, 4);
      let part3 = this.anxCompraTO.compModificadoDocumentoNumero.substring(17, 8);
      if (part1 !== '000' && part2 !== '000' && part3 !== '000000000') {
        this.numeroDocValidoComplemento000 = true;
        this.cargando = true;
        let parametro = {
          empCodigo: this.empresaSeleccionada.empCodigo,
          provCodigo: this.invCompraTO.provCodigo,
          codTipoComprobante: this.anxCompraTO.compModificadoDocumentoTipo,
          numComplemento: this.anxCompraTO.compModificadoDocumentoNumero
        };
        this.retencionComprasService.obtenerAutorizacionNCND(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  despuesDeObtenerAutorizacionNCND(respuesta) {
    this.numeroRepetido = respuesta;
    this.cargando = false;
  }

  validarNumeroAutorizacionComplemento() {
    if (this.anxCompraTO.compModificadoAutorizacion) {
      this.numeroAutorizacionValidaLongitud = false;
      if (this.anxCompraTO.compModificadoAutorizacion.length === 10 || this.anxCompraTO.compModificadoAutorizacion.length === 37 || this.anxCompraTO.compModificadoAutorizacion.length === 49) {
        this.numeroAutorizacionValidaLongitud = true;
      }
    }
  };

  //******************************************Reembolso********************************************
  inicializarListadoReembolso() {
    this.gridApiReembolso.forEachNode((rowNode) => {
      let value: AnxCompraReembolsoTO = rowNode.data;
      value.provCodigoCopia = value.provCodigo;
    })
  }

  //Proveedor
  buscarProveedor(params) {
    let keyCode = params.event.keyCode;
    let provCodigoInput = params.event.target.value;
    let provCodigo = params.data.provCodigo;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.provCodigo = provCodigoInput;
      let fueBuscado = (provCodigoInput === provCodigo && provCodigoInput && provCodigo);
      if (!fueBuscado) {
        provCodigoInput = provCodigoInput ? provCodigoInput.toUpperCase() : null;
        if (provCodigoInput) {
          let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: provCodigoInput };
          this.abrirModalProveedor(parametroBusqueda, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.retencionComprasService.base0ReembolsoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          } else {
            this.retencionComprasService.base0ReembolsoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.retencionComprasService.base0ReembolsoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.retencionComprasService.base0ReembolsoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }
    }
  }

  abrirModalProveedor(parametroBusqueda, params) {
    const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
    modalRef.result.then((result: InvProveedorTO) => {
      if (result) {
        let resultado = new InvProveedorTO(result);
        params.event.target.value = resultado.provCodigo;
        params.data.provCodigo = resultado.provCodigo;
        params.data.provCodigoCopia = resultado.provCodigo;
        params.data.auxProvRazonSocial = resultado.provRazonSocial;
        this.refreshGridReembolso();
        this.retencionComprasService.base0ReembolsoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
      } else {
        this.retencionComprasService.focusedProveedor(params.node.rowIndex, this.gridApi);
      }
    }, () => {
      params.data.provCodigo = "";
      this.validarProveedor(params.data);
      this.retencionComprasService.base0ReembolsoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
    });
  }

  validarProveedor(detalle: AnxCompraReembolsoTO): boolean {
    if (detalle.provCodigo !== detalle.provCodigoCopia) {
      this.resetearProveedor(detalle);
      return false;
    }
    return true;
  }

  resetearProveedor(detalle: AnxCompraReembolsoTO) {
    detalle.provCodigo = null;//Se borra la copia
    detalle.provCodigoCopia = null;
    detalle.auxProvRazonSocial = null;
    this.refreshGridReembolso();
  }

  alCambiarValorDeCeldaReembolso(event) {
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_CREADO || this.accion === LS.ACCION_MAYORIZAR) {
      if (event.colDef.field === "provCodigo") {
        this.validarProveedor(event.data);
      }
    }
  }


}
