import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MotivoTransferenciasService } from '../../archivo/motivo-transferencias/motivo-transferencias.service';
import { InvTransferenciaMotivoComboTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoComboTO';
import { TransferenciasService } from '../../transacciones/transferencias/transferencias.service';
import * as moment from 'moment';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { InvComboBodegaTO } from '../../../../entidadesTO/inventario/InvComboBodegaTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { NgForm } from '@angular/forms';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvListaDetalleTransferenciaTO } from '../../../../entidadesTO/inventario/InvListaDetalleTransferenciaTO';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoProductosComponent } from '../listado-productos/listado-productos.component';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { ContextMenu } from 'primeng/contextmenu';
import { InvTransferenciasTO } from '../../../../entidadesTO/inventario/InvTransferenciasTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import swal from 'sweetalert2';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { InvTransferenciaMotivoTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoTO';

@Component({
  selector: 'app-transferencias-formulario',
  templateUrl: './transferencias-formulario.component.html',
  styleUrls: ['./transferencias-formulario.component.css']
})
export class TransferenciasFormularioComponent implements OnInit {

  //Variables para llamar desde el padre
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() data;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() activarEstado = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  //Variables para llenar el formulario
  public constantes: any = LS;
  public cargando: boolean = false;
  public tituloForm: string = "";
  //Motivo
  public listadoMotivos: Array<InvTransferenciaMotivoTO> = new Array();
  public motivoSeleccionado: InvTransferenciaMotivoTO = new InvTransferenciaMotivoTO();
  //Cabecera Formulario Fecha - Motivo - Observaciones - Pendiente...
  public transferencia: InvTransferenciasTO = new InvTransferenciasTO();
  public listaResultado: Array<InvTransferenciasTO> = [];
  //Bodega
  public listadoBodegas: Array<InvComboBodegaTO> = new Array();
  public bodegaSeleccionadaOrigen: InvComboBodegaTO = new InvComboBodegaTO();
  public bodegaSeleccionadaDestino: InvComboBodegaTO = new InvComboBodegaTO();
  //Variables Fechas -Periodo
  public es: object = {};
  public fechaValido: boolean = true;
  public fechaMax: Date = null;
  //Periodo seleccionado
  public periodoSeleccionado: SisPeriodo;
  //Lista detalle consta de bodegaDestino, bodegaOrigen, producto, cantidad, medida
  public objetoSeleccionado: InvListaDetalleTransferenciaTO = new InvListaDetalleTransferenciaTO();
  public listaInvDetalleTran: Array<InvListaDetalleTransferenciaTO> = new Array();
  public listaInvDetalleEliminado: Array<InvListaDetalleTransferenciaTO> = new Array();
  //Cantidad en productos
  public configAutonumeric: AppAutonumeric;

  //AG-GRID
  public screamXS: boolean = true;
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public pinnedBottomRowData;
  public rowClassRules;
  public rowSelection: string = "single";
  public isCollapsed: boolean = false;
  public estilos: any = {};

  @ViewChild("frmTransferencia") frmTransferencia: NgForm;
  public valoresIniciales: any;
  public listaInvDetalleTranInicial: any;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public activar: boolean = true;
  //Menu
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opcionesDetalle: MenuItem[];

  constructor(
    public toastr: ToastrService,
    private atajoService: HotkeysService,
    private motivoTransferenciaService: MotivoTransferenciasService,
    private transferenciaService: TransferenciasService,
    private bodegaService: BodegaService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private modalService: NgbModal,
    public api: ApiRequestService,
    private auth: AuthService,
    private periodoService: PeriodoService
  ) {
    this.configAutonumeric = this.transferenciaService.obtenerAutonumeric();
  }

  ngOnInit() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.definirAtajosDeTeclado();
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.inicializarValores();
    if (this.data) {
      this.listadoMotivos = this.data.listaMotivosTransferencias;
      this.operaciones();
      this.generarOpcionesDetalle();
    }
    setTimeout(() => { this.transferenciaService.enfocarInput('observaciones') }, 50);
    this.iniciarAgGrid();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmTransferencia ? this.frmTransferencia.value : null));
      this.listaInvDetalleTranInicial = JSON.parse(JSON.stringify(this.transferencia ? this.transferencia : null));
    }, 1000);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnMayorizarTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  inicializarValores() {
    this.periodoSeleccionado = this.data.periodoSeleccionado;
    this.activar = this.data.activar;
    this.transferencia.transFecha = this.utilService.obtenerFechaActual();
    this.fechaMax = this.utilService.obtenerFechaActual();
    this.extraerValoresIniciales();
  }

  cambiaFecha() {
    if (this.data.accion === LS.ACCION_NUEVO) {
      this.transferencia.transFecha ? this.verificarFechaValida() : this.fechaValido = false;
    } else if (this.data.accion === LS.ACCION_MAYORIZAR) {
      if (this.data.periodoSeleccionado && this.transferencia.transFecha) {
        let transferenciaFecha: Date = this.transferencia.transFecha.getTime();
        if (transferenciaFecha >= this.periodoSeleccionado.perDesde && transferenciaFecha <= this.periodoSeleccionado.perHasta) {
          this.fechaValido = true;
        } else {
          this.fechaValido = false;
        }
      } else {
        this.fechaValido = false;
      }
    } else {
      this.fechaValido = true;
    }
  }

  /**
   *Verificamos la fecha que se encuentre dentro de un periodo
   *
   * @memberof TransferenciasFormularioComponent
   */
  verificarFechaValida() {
    this.fechaValido = false;
    let parametro = {
      fecha: moment(this.transferencia.transFecha).format('YYYY-MM-DD'),
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    if (data && !data.perCerrado) {
      this.fechaValido = true;
    } else {
      this.fechaValido = false;
    }
    if (this.data.accion != LS.ACCION_NUEVO && this.data.accion != LS.ACCION_MAYORIZAR) {
      this.fechaValido = true;
    }
  }

  verificarBodegaValida() {
    if (this.bodegaSeleccionadaDestino === this.bodegaSeleccionadaOrigen) {
      this.toastr.error(LS.MSJ_BODEGAS_IGUALES, LS.TOAST_ADVERTENCIA);
    }
  }

  //*****************SECCIÓN FORMULARIO***************** */

  /**
 *Listamos el combo motivo
 *
 * @memberof TransferenciasFormularioComponent
 */
  listarInvTransferenciaMotivoComboTO() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      inactivos: false
    }
    this.cargando = true;
    this.motivoTransferenciaService.listarInvTransferenciaMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvTransferenciaMotivoTO(listadoMotivos) {
    this.listadoMotivos = listadoMotivos ? listadoMotivos : [];
    this.motivoSeleccionado = this.listadoMotivos[0];
    this.cargando = false;
  }

  /**
   *Listamos en un combo las bodegas por empresa
   *
   * @memberof TransferenciasFormularioComponent
   */
  listarInvBodegaComboTO() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
    }
    this.cargando = true;
    this.bodegaService.listarInvComboBodegaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvComboBodegaTO(listadoBodegas) {
    this.listadoBodegas = listadoBodegas ? listadoBodegas : [];
    this.bodegaSeleccionadaOrigen = this.listadoBodegas[0];
    this.bodegaSeleccionadaDestino = this.listadoBodegas[1];
  }

  /**
   *Metodo que muestra un modal de todas los productos que coincidan con lo que se ingreso en el input de productos
   *
   * @param {*} params
   * @memberof TransferenciasFormularioComponent
   */
  buscarProducto(params) {
    let keyCode = params.event.keyCode;
    let codigoProductoInput = params.event.target.value;
    let codigoProducto = params.data.proCodigoPrincipal;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.proCodigoPrincipal = codigoProductoInput;
      let fueBuscado = (codigoProductoInput === codigoProducto && codigoProductoInput && codigoProducto);
      if (!fueBuscado) {
        codigoProductoInput = codigoProductoInput === '' ? null : codigoProductoInput;
        codigoProductoInput = codigoProductoInput ? codigoProductoInput.toUpperCase() : null;
        if (codigoProductoInput) {
          let parametroBusquedaProducto = {
            empresa: this.empresaSeleccionada.empCodigo,
            busqueda: codigoProductoInput,
            categoria: null,
            bodega: this.bodegaSeleccionadaOrigen.bodCodigo,
            incluirInactivos: false,
            limite: false
          };
          this.abrirModalProducto(parametroBusquedaProducto, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.cantidadFocusAndEditingCell(params.node.rowIndex);
          } else {
            this.productoFocusAndEditingCell(params.node.rowIndex);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.cantidadFocusAndEditingCell(params.node.rowIndex);
        } else {
          this.productoFocusAndEditingCell(params.node.rowIndex);
        }
      }
    }
  }

  /**
   *Modal del producto
   *
   * @param {*} parametroBusqueda
   * @param {*} params
   * @memberof TransferenciasFormularioComponent
   */
  abrirModalProducto(parametroBusqueda, params) {
    let index = params.node.rowIndex;
    const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', backdrop: 'static', windowClass: 'miSize' });
    modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.isConsumos = true;
    modalRef.result.then((result) => {
      if (result) {
        let resultado = new InvListaProductosGeneralTO(result);
        params.event.target.value = resultado.proCodigoPrincipal;
        params.data.proCodigoPrincipal = resultado.proCodigoPrincipal;
        params.data.proEmpresa = this.empresaSeleccionada.empCodigo;
        params.data.proNombre = resultado.proNombre;
        params.data.medDetalle = resultado.detalleMedida;
        params.data.tipTipo = resultado.tipTipo;
        this.refreshGrid();
        if (index >= 0 && index === (this.listaInvDetalleTran.length - 1)) {
          this.agregarFila('down', false);
        }
        this.cantidadFocusAndEditingCell(index);
      } else {
        this.productoFocusAndEditingCell(index);
      }
    }, () => {
      params.data.proCodigoPrincipal = '';
      this.validarProducto(params.data);
      this.gridApi.setFocusedCell(index, 'proNombre');
      this.productoFocusAndEditingCell(index);
    });
  }

  productoFocusAndEditingCell(index) {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(index, 'proCodigoPrincipal');
      this.gridApi.startEditingCell({ rowIndex: index, colKey: "proCodigoPrincipal" });
    }
  }

  cantidadFocusAndEditingCell(index) {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(index, "detCantidad");
      this.gridApi.startEditingCell({ rowIndex: index, colKey: "detCantidad" });
    }
  }

  validarProducto(detalle: InvListaDetalleTransferenciaTO) {
    if (detalle.proCodigoPrincipal !== detalle.proCodigoPrincipalCopia) {
      this.resetearProducto(detalle);
    }
  }

  resetearProducto(detalle) {
    detalle.proCodigoPrincipalCopia = null;//Se borra la copia
    detalle.proCodigoPrincipal = null;
    detalle.proNombre = null;
    detalle.estadoProducto = false;
    detalle.medDetalle = null;
    this.refreshGrid();
  }

  //***************** SECCIÓN NUEVA TRANSFERENCIA ***************** */
  nuevaTransferencia() {
    this.listarInvBodegaComboTO();
    this.listadoMotivos = this.data.listadoMotivos;
    this.motivoSeleccionado = this.data.motivoSeleccionado;
    this.transferencia = new InvTransferenciasTO;
    let invTransfDetalle = new InvListaDetalleTransferenciaTO({ detCantidad: 1.00 });
    this.listaInvDetalleTran.push(invTransfDetalle);
    this.inicializarValores();
    this.verificarFechaValida();
    this.extraerValoresIniciales();
  }

  //***************** SECCIÓN CONSULTA TRANSFERENCIA ***************** */
  obtenerObjetoItemListaTransferenciaTO() {
    let splitTransferenciaPK = this.data.transferencia.split("|");
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigoPeriodo: splitTransferenciaPK[0].trim(),
      motivo: splitTransferenciaPK[1].trim(),
      numeroTransferencia: splitTransferenciaPK[2].trim()
    }
    this.cargando = true;
    this.transferenciaService.obtenerObjetoItemListaTransferenciaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeConsultarTransferencia(data) {
    this.listaInvDetalleTran = data.detalle;
    this.listadoBodegas = data.listadoBodega;
    this.listadoMotivos = data.listadoMotivosTransferencia;
    if (this.listaInvDetalleTran && this.listaInvDetalleTran.length > 0) {
      for (let i = 0; i < this.listaInvDetalleTran.length; i++) {
        this.listaInvDetalleTran[i].proCodigoPrincipalCopia = this.listaInvDetalleTran[i].proCodigoPrincipal;
        this.listaInvDetalleTran[i].proNombre = this.listaInvDetalleTran[i].proNombre;
        this.listaInvDetalleTran[i].detCantidad = this.listaInvDetalleTran[i].detCantidad;
        this.listaInvDetalleTran[i].medDetalle = this.listaInvDetalleTran[i].medDetalle;
      }
    }
    this.transferencia.transFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.cabecera.transFecha);
    this.bodegaSeleccionadaDestino = this.listadoBodegas.find(item => item.bodCodigo == this.listaInvDetalleTran[0].bodDestinoCodigo);
    this.bodegaSeleccionadaOrigen = this.listadoBodegas.find(item => item.bodCodigo == this.listaInvDetalleTran[0].bodOrigenCodigo);
    this.motivoSeleccionado = this.listadoMotivos.find(item => item.tmCodigo == data.cabecera.transMotivo);
    this.transferencia.transObservaciones = data.cabecera.transObservaciones;
    this.transferencia.transPendiente = data.cabecera.transPendiente;
    this.cargando = false;
  }

  obtenerTransferenciaPorOperacion() {
    let splitTransferenciaPK = this.data.transferencia.split("|");
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      codigoPeriodo: splitTransferenciaPK[0].trim(),
      motivo: splitTransferenciaPK[1].trim(),
      numeroTransferencia: splitTransferenciaPK[2].trim()
    }
    this.cargando = true;
    this.transferenciaService.obtenerObjetoItemListaTransferenciaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  //***************** SECCIÓN DESMAYORIZAR ***************** */
  desmayorizarTransferencia() {
    let splitTransferenciaPK = this.data.transferencia.split("|");
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: splitTransferenciaPK[0].trim(),
      motivo: splitTransferenciaPK[1].trim(),
      numero: splitTransferenciaPK[2].trim()
    }
    this.cargando = true;
    this.transferenciaService.desmayorizarTransferencias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeDesmayorizarTransferencia(respuesta) {
    this.cargando = false;
    this.toastr.success(LS.MSJ_SE_DESMAYORIZO_TRANSFERENCIA + respuesta.extraInfo.transNumero, LS.TAG_AVISO);
    this.confirmacionMayorizar(respuesta.extraInfo);
  }

  //***************** SECCIÓN ANULAR ***************** */
  anularTransferencia() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ANULAR_TRANSFERENCIA,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ANULAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        this.cargando = true;
        let splitTransferenciaPK = this.data.transferencia.split("|");
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          periodo: splitTransferenciaPK[0].trim(),
          motivo: splitTransferenciaPK[1].trim(),
          numero: splitTransferenciaPK[2].trim()
        }
        this.cargando = true;
        this.transferenciaService.anularTransferencias(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        let parametro = { accion: LS.ACCION_CANCELAR };
        this.cargando = false;
        this.enviarAccion.emit(parametro);
      }
    });
  }

  despuesDeAnularTransferencia(respuesta) {
    this.cargando = false;
    this.transferencia = this.setearValoresAnular(respuesta);
    let parametro = {
      accion: LS.ACCION_MODIFICADO,
      consResultante: this.transferenciaService.construirObjetoParaPonerloEnLaListaAnularRestaurar(this.transferencia),
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
    this.toastr.success(LS.MSJ_SE_ANULO_TRANSFERENCIA + respuesta.extraInfo.transNumero, LS.TAG_AVISO);
  }

  //***************** SECCIÓN RESTAURAR ***************** */
  restaurarTransferencia() {
    this.cargando = true;
    let splitTransferenciaPK = this.data.transferencia.split("|");
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: splitTransferenciaPK[0].trim(),
      motivo: splitTransferenciaPK[1].trim(),
      numero: splitTransferenciaPK[2].trim()
    }
    this.cargando = true;
    this.transferenciaService.restaurarTransferencias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeRestaurarTransferencia(respuesta) {
    this.cargando = false;
    this.transferencia = this.setearValoresAnular(respuesta);
    let parametro = {
      accion: LS.ACCION_MODIFICADO,
      consResultante: this.transferenciaService.construirObjetoParaPonerloEnLaListaAnularRestaurar(this.transferencia),
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
    this.toastr.success(LS.MSJ_SE_RESTAURO_TRANSFERENCIA + respuesta.extraInfo.transNumero, LS.TAG_AVISO);
  }

  //***************** SECCIÓN INSERTAR TRANSFERENCIA***************** */
  guardarTransferencia(form, estado) {
    var detalleValidado = this.validarDetalle();
    let formTocado = this.utilService.establecerFormularioTocado(form);
    if (this.data.accion === LS.ACCION_NUEVO && this.fechaValido === true && this.bodegaSeleccionadaDestino != this.bodegaSeleccionadaOrigen && detalleValidado) {
      if (formTocado && !form.invalid) {
        let itemListaTransferenciaTO = this.setearDatosTransferencia(estado);
        let itemListaDetalleTransfTO = this.formatearDatosTransferenciaDetalle(this.listaInvDetalleTran);
        let parametro = {
          invTransferenciasTO: itemListaTransferenciaTO,
          listaInvTransferenciasDetalleTO: itemListaDetalleTransfTO
        }
        this.transferenciaService.insertarInvTransferenciaTO(parametro, this, LS.KEY_EMPRESA_SELECT, estado);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
    }
  }

  despuesDeInsertarTransferencia(respuesta, estado) {
    this.transferencia = respuesta.extraInfo.map.invTransferencias ? respuesta.extraInfo.map.invTransferencias : this.transferencia;
    this.transferencia.transFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.transferencia.transFecha);
    this.transferencia.transPendiente = estado;
    try {
      this.cargando = false;
      this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
      this.preguntarImprimirTransferencia(respuesta.operacionMensaje);
    } catch (err) {
      this.cargando = false;
      this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    }
  }

  //***************** SECCIÓN MODIFICAR - MAYORIZAR ***************** */
  modificarTransferencia(form, estado) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmTransferencia)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
    var detalleValidado = this.validarDetalle();
    let formTocado = this.utilService.establecerFormularioTocado(form);
    if (this.data.accion === LS.ACCION_MAYORIZAR && this.fechaValido === true && (this.bodegaSeleccionadaDestino != this.bodegaSeleccionadaOrigen && detalleValidado)) {
      if (formTocado && !form.invalid) {
        let itemListaTransferenciaTO = this.setearDatosTransferencia(estado);
        let itemListaDetalleTransfTO = this.formatearDatosTransferenciaDetalle(this.listaInvDetalleTran);
        let listaInvTransferenciasEliminarDetalleTO = this.formatearDatosTransferenciaDetalle(this.listaInvDetalleEliminado);
        let parametro = {
          invTransferenciasTO: itemListaTransferenciaTO,
          listaInvTransferenciasDetalleTO: itemListaDetalleTransfTO,
          listaInvTransferenciasEliminarDetalleTO: listaInvTransferenciasEliminarDetalleTO,
          desmayorizar: false
        }
        this.transferenciaService.modificarInvTransferenciasTO(parametro, this, LS.KEY_EMPRESA_SELECT, estado);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
      }
    }
  }

  despuesDeModificarTransferencia(respuesta, estado) {
    this.transferencia = respuesta.extraInfo.map.invTransferencias ? respuesta.extraInfo.map.invTransferencias : this.transferencia;
    this.transferencia.transFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.transferencia.transFecha);
    this.transferencia.transPendiente = estado;
    try {
      this.cargando = false;
      this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
      let parametro = {
        accion: LS.ACCION_MODIFICADO,
        consResultante: this.transferenciaService.construirObjetoParaPonerloEnLaLista(this.transferencia),
        empresa: this.empresaSeleccionada
      };
      this.enviarAccion.emit(parametro);
    } catch (err) {
      this.cargando = false;
      this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    }
  }

  validarDetalle(): boolean {
    let esValido = true;
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        let cantidadSolicitadaValido = this.transferenciaService.validarCantidad(node.data) && this.transferenciaService.validarProducto(node.data);
        !cantidadSolicitadaValido ? esValido = false : null;
      });
    }
    return esValido;
  }

  imprimirTransferenciaFormulario() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        numero: [this.data.transferencia]
      }
      this.transferenciaService.imprimirTransferencia(parametro, this, this.empresaSeleccionada);
    }
  }

  imprimirTransferencia() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let consultaTransferencia = this.utilService.getAGSelectedData(this.gridApi);
      if (consultaTransferencia && consultaTransferencia.length === 0 && !this.frmTransferencia) {
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
          numero: [this.objetoSeleccionado.transNumero]
        }
        this.transferenciaService.imprimirTransferencia(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  //***************** SECCIÓN SETEAR VALORES ***************** */
  setearDatosTransferencia(estado): InvTransferenciasTO {
    let itemListaTransferenciaTO = new InvTransferenciasTO();
    itemListaTransferenciaTO.transMotivo = this.motivoSeleccionado.tmCodigo;
    itemListaTransferenciaTO.transFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.transferencia.transFecha);;
    itemListaTransferenciaTO.transObservaciones = this.transferencia.transObservaciones;
    itemListaTransferenciaTO.transEmpresa = LS.KEY_EMPRESA_SELECT;
    itemListaTransferenciaTO.transPendiente = estado;
    itemListaTransferenciaTO.usrCodigo = this.auth.getCodigoUser();
    delete itemListaTransferenciaTO.invTransferenciasPK;
    if (this.data.accion === LS.ACCION_MAYORIZAR) {
      let splitTransferenciaPK = this.data.transferencia.split("|");
      itemListaTransferenciaTO.transNumero = splitTransferenciaPK[2].trim();
      itemListaTransferenciaTO.transPeriodo = splitTransferenciaPK[0].trim();
    }
    return itemListaTransferenciaTO;
  }

  formatearDatosTransferenciaDetalle(listado) {
    for (let i = 0; i < listado.length; i++) {
      listado[i].detCantidad = listado[i].detCantidad ? listado[i].detCantidad : null;
      listado[i].proCodigoPrincipal = listado[i].proCodigoPrincipal ? listado[i].proCodigoPrincipal : null;
      listado[i].bodOrigenCodigo = this.bodegaSeleccionadaOrigen.bodCodigo;
      listado[i].bodDestinoCodigo = this.bodegaSeleccionadaDestino.bodCodigo;
      listado[i].secDestinoCodigo = this.bodegaSeleccionadaDestino.secCodigo;
      listado[i].secDestinoEmpresa = this.empresaSeleccionada.empCodigo;
      listado[i].secOrigenCodigo = this.bodegaSeleccionadaDestino.secCodigo;
      listado[i].secOrigenEmpresa = this.empresaSeleccionada.empCodigo;
      listado[i].detOrden = i + 1;
      listado[i].transEmpresa = LS.KEY_EMPRESA_SELECT;
    };
    return listado;
  }

  setearValoresDesmayorizar(respuesta): InvTransferenciasTO {
    let consumoEnLista: InvTransferenciasTO = respuesta;
    this.transferencia.transPeriodo = consumoEnLista.transPeriodo;
    this.transferencia.transMotivo = consumoEnLista.transMotivo;
    this.transferencia.transNumero = consumoEnLista.transNumero;
    this.transferencia.transFecha = consumoEnLista.transFecha;
    this.transferencia.transPendiente = consumoEnLista.transPendiente;
    return this.transferencia;
  }

  setearValoresAnular(respuesta): InvTransferenciasTO {
    let consumoEnLista: InvTransferenciasTO = respuesta.extraInfo;
    this.transferencia.transPeriodo = consumoEnLista.transPeriodo;
    this.transferencia.transMotivo = consumoEnLista.transMotivo;
    this.transferencia.transNumero = consumoEnLista.transNumero;
    this.transferencia.transFecha = consumoEnLista.transFecha;
    this.transferencia.transPendiente = consumoEnLista.transPendiente;
    this.transferencia.transAnulado = consumoEnLista.transAnulado;
    return this.transferencia;
  }

  //*****************SECCIÓN OPERACIONES***************** */
  operaciones() {
    // this.listarInvBodegaComboTO();
    this.filasTiempo.iniciarContador();
    switch (this.data.accion) {
      case LS.ACCION_NUEVO: {
        this.tituloForm = LS.TITULO_FORM_NUEVO_COMPROBANTE_TRANSFERENCIA;
        this.nuevaTransferencia();
        this.filasTiempo.finalizarContador();
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.tituloForm = LS.TITULO_FORM_CONSULTA_TRANSFERENCIA;
        this.obtenerObjetoItemListaTransferenciaTO();
        this.filasTiempo.finalizarContador();
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        this.tituloForm = LS.TITULO_FORM_MAYORIZAR_TRANSFERENCIA;
        this.obtenerTransferenciaPorOperacion();
        this.filasTiempo.finalizarContador();
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        this.desmayorizarTransferencia();
        this.filasTiempo.finalizarContador();
        break;
      }
      case LS.ACCION_ANULAR: {
        this.obtenerObjetoItemListaTransferenciaTO();
        this.filasTiempo.finalizarContador();
        break;
      }
      case LS.ACCION_RESTAURAR: {
        this.restaurarTransferencia();
        break;
      }
    }
  }

  //***************** SECCIÓN TABLA (AgGrid)***************** */
  iniciarAgGrid() {
    this.columnDefs = this.transferenciaService.generarColumnasFormulario(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.context = { componentParent: this };
    this.frameworkComponents = {
      numericCell: NumericCellComponent,
      toolTip: TooltipReaderComponent,
      pinnedCell: PinnedCellComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    let colDef = columna ? columna.getColDef() : null;
    if (colDef && colDef.editable) {
      this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    }
    this.objetoSeleccionado = fila ? fila.data : null;
  }
  focusedProducto(index) {
    setTimeout(() => { this.productoFocusAndEditingCell(index) }, 50);
  }

  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = !this.isCollapsed ? '405px' : '260px';
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')'
    }
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event']) onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  cambiarEstadoActivar(activar) {
    this.activar = !activar;
    this.activarEstado.emit(activar);
  }

  //***************** SECCIÓN MENÚ ***************** */

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpcionesDetalle();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpcionesDetalle() {
    let permiso = (this.data.accion === LS.ACCION_MAYORIZAR || this.data.accion === LS.ACCION_NUEVO);
    let permisoEliminar = (this.data.accion === LS.ACCION_MAYORIZAR || this.data.accion === LS.ACCION_NUEVO);
    this.opcionesDetalle = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', true) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', true) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permisoEliminar, command: () => permisoEliminar ? this.eliminarFila() : null },
    ];
  }

  agregarFila(ubicacion: string, focused) {
    let selected = this.gridApi.getFocusedCell();
    let index = selected.rowIndex;
    if (index >= 0) {
      index = ubicacion === 'up' ? index : index + 1;
      let nuevoItem = this.obtenerNuevoDetalle(this.objetoSeleccionado);
      let listaTemporal = this.listaInvDetalleTran.slice();
      listaTemporal.splice(index, 0, nuevoItem);
      this.listaInvDetalleTran = listaTemporal;
      focused ? this.focusedProducto(index) : null;
    }
    this.refreshGrid();
  }

  eliminarFila() {
    if (this.listaInvDetalleTran.length > 1) {
      var selected = this.gridApi.getFocusedCell();
      let listaTemporal = this.listaInvDetalleTran.slice();
      listaTemporal.splice(selected.rowIndex, 1);
      this.listaInvDetalleTran = listaTemporal;
      if (this.objetoSeleccionado.detSecuencial > 0) {
        this.listaInvDetalleEliminado.push(this.objetoSeleccionado);
      }
      this.refreshGrid();
    }
  }
  /**
   * Metodo para obtener un nuevo detalle, en este caso se crea un ID provisional para diferenciar en la tabla dependiendo del Id 
   * y asi no se seleccione varios objetos que tengan las misma informacion, al enviar al servidor este se borra
   * @param {*} elementoActual
   * @returns {InvListaDetalleTransferenciaTO}
   * @memberof TransferenciasFormularioComponent
   */
  obtenerNuevoDetalle(elementoActual): InvListaDetalleTransferenciaTO {
    let detalle = new InvListaDetalleTransferenciaTO();
    detalle.detCantidad = elementoActual.detCantidad;
    return detalle;
  }

  //***************** SECCIÓN CERRAR FORMULARIOS ***************** */
  confirmacionCerrar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmTransferencia)) {
      this.enviarCancelar.emit();
    } else {
      switch (this.data.accion) {
        case LS.ACCION_MAYORIZAR:
        case LS.ACCION_NUEVO:
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI,
            cancelButtonText: LS.MSJ_NO
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarCancelar.emit();
            }
          });
          break;
        default:
          this.enviarCancelar.emit();
      }
    }
  }

  preguntarImprimirTransferencia(texto: string) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>",
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.imprimirTransferencia();
      } else {//Cierra el formulario
        let parametro = {
          accion: LS.ACCION_CREADO,
          consResultante: this.transferenciaService.construirObjetoParaPonerloEnLaLista(this.transferencia),
          empresa: this.empresaSeleccionada
        };
        this.enviarAccion.emit(parametro);
      }
    });
  }


  /**Metodo que se ejecuta cuando se demayoriza un contable y tiene permiso de mayorizar, saldra una confirmacion de mayorizar */
  confirmacionMayorizar(respuesta: string) {
    swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
      .then((result) => {
        if (result.value) {
          this.data.accion = LS.ACCION_MAYORIZAR;
          this.obtenerObjetoItemListaTransferenciaTO();
        }
        if (result.dismiss) {
          this.transferencia = this.setearValoresDesmayorizar(respuesta);
          let parametro = {
            accion: LS.ACCION_DESMAYORIZAR,
            consResultante: this.transferenciaService.construirObjetoParaPonerloEnLaListaAnularRestaurar(this.transferencia),
            empresa: this.empresaSeleccionada
          };
          this.enviarAccion.emit(parametro);
        }
      });
  }
}
