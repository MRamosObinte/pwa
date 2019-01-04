import { Component, OnInit, Input, HostListener, EventEmitter, Output, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { InvPedidosOrdenCompra } from '../../../../entidades/inventario/InvPedidosOrdenCompra';
import { InvPedidosOrdenCompraMotivoTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraMotivoTO';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { InvProductoEtiquetas } from '../../../../entidades/inventario/InvProductoEtiquetas';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvPedidosConfiguracionTO } from '../../../../entidadesTO/inventario/InvPedidosConfiguracionTO';
import { InvPedidoTO } from '../../../../entidadesTO/inventario/InvPedidoTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvPedidosMotivoPK } from '../../../../entidades/inventario/InvPedidosMotivoPK';
import { ConfiguracionPedidoService } from '../../archivos/configuracion-pedido/configuracion-pedido.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InvPedidosOrdenCompraTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraTO';
import { InvPedidosOrdenCompraPK } from '../../../../entidades/inventario/InvPedidosOrdenCompraPK';
import { ProductoEtiquetasComponent } from '../../../inventario/componentes/producto-etiquetas/producto-etiquetas.component';
import { InvPedidosDetalle } from '../../../../entidades/inventario/InvPedidosDetalle';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { InvPedidosOrdenCompraDetalleTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraDetalleTO';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { CheckCellComponent } from '../../../componentes/check-cell/check-cell.component';
import { OrdenCompraService } from '../../transacciones/generar-orden-compra/orden-compra.service';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { KardexListadoComponent } from '../../../inventario/componentes/kardex-listado/kardex-listado.component';
import { OrdenPedidoService } from '../../transacciones/generar-orden-pedido/orden-pedido.service';
import { ConfiguracionOrdenCompraService } from '../../archivos/configuracion-orden-compra/configuracion-orden-compra.service';
import { InvProveedor } from '../../../../entidades/inventario/InvProveedor';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { GenerarOrdenCompraService } from './generar-orden-compra.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ProductoEtiquetasService } from '../../../inventario/componentes/producto-etiquetas/producto-etiquetas.service';
import { ProveedorService } from '../../../inventario/archivo/proveedor/proveedor.service';

@Component({
  selector: 'app-formulario-generar-orden-compra',
  templateUrl: './formulario-generar-orden-compra.component.html'
})
export class FormularioGenerarOrdenCompraComponent implements OnInit, OnChanges {

  @Input() data; //Incluye secCodigo
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Output() enviarLista: EventEmitter<any> = new EventEmitter();
  public accion = null;
  public constantes: any; //Referencia a las constantes
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public es: any = {}; //Locale Date (Obligatoria)
  public cargando: boolean = false;
  public apruebaTodos: boolean = true;
  public activar: boolean = false;
  public frmTitulo: String; //Titulo de formulario
  public vistaFormulario = false;
  public invPedidosOrdenCompra: InvPedidosOrdenCompra = new InvPedidosOrdenCompra();
  //[CAMPOS DE ORDEN DE COMPRA]
  public listadoMotivoOC: Array<InvPedidosOrdenCompraMotivoTO> = [];
  public motivoOCSeleccionado: InvPedidosOrdenCompraMotivoTO = null;
  public motivoOCCopia: InvPedidosOrdenCompraMotivoTO = null;//Almacena el valor del sector seleccionado antes de enviar a refrescar la listas
  public proveedorCopia: InvProveedorTO = new InvProveedorTO(); //El proveedor se elegira en el modal
  public fechaActual: Date = new Date();
  public fechaEmision: Date = null;
  public invProductoEtiquetas: InvProductoEtiquetas = new InvProductoEtiquetas();
  public listadoEtiquetas: Array<any> = [];
  public etiquetaSeleccionada = { field: null, value: null };
  public configuracion: InvPedidosConfiguracionTO;
  public funcionesUsuario: Array<string> = [];//Funciones del usuario actual
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public emailProveedor: String = null;
  public configAutonumeric: AppAutonumeric;
  public configAutonumeric6: AppAutonumeric;
  public configAutonumericRead6: AppAutonumeric;
  public configAutonumericRead: AppAutonumeric;
  public campoCostoRerefencia: string = "";
  public invPedidoTO: InvPedidoTO = null;
  public estilos: any = {};
  public isCollapsed: boolean = true;
  public isCollapseCliente: boolean = true;
  //Tabla
  public listaInvPedidosDetalle: Array<InvPedidosDetalle> = [];
  public listadoResultado: Array<InvPedidosOrdenCompraDetalleTO> = [];
  public ordenesDeCompra: Array<InvPedidosOrdenCompra> = [];
  public objetoSeleccionado: InvPedidosOrdenCompraDetalleTO;
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  public pinnedBottomRowData;
  public rowClassRules;
  public noData: string = LS.MSJ_NO_DATA;
  //formulario
  @ViewChild("frmOrdenCompra") frmOrdenCompra: NgForm; //debe llamarse como el formulario
  public valoresIniciales: any;
  public detalleInicial: any;
  //orden de compra
  public ordenDeCompra: string = "";

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private generarOCService: GenerarOrdenCompraService,
    private modalService: NgbModal,
    private auth: AuthService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private ordenCompraService: OrdenCompraService,
    private ordenPedidoService: OrdenPedidoService,
    private motivoOrdenCompraService: ConfiguracionOrdenCompraService,
    private archivoService: ArchivoService,
    private configuracionPedidoService: ConfiguracionPedidoService,
    private etiquetasService: ProductoEtiquetasService,
    private sistemaService: AppSistemaService,
    private proveedorService: ProveedorService
  ) {
    moment.locale('es');
    this.constantes = LS; //Hace referncia a los constantes
    this.es = this.utilService.setLocaleDate();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999.99',
      minimumValue: '0',
    }
    this.configAutonumericRead = Object.assign({}, this.configAutonumeric);
    this.configAutonumericRead.readOnly = true;
    this.configAutonumeric6 = Object.assign({}, this.configAutonumeric);
    this.configAutonumeric6.decimalPlaces = 6;
    this.configAutonumeric6.decimalPlacesRawValue = 6;
    this.configAutonumeric6.decimalPlacesShownOnFocus = 6;
    this.configAutonumericRead6 = Object.assign({}, this.configAutonumeric6);
    this.configAutonumericRead6.readOnly = true;
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 420px)',
      'min-height': '165px'
    }
    this.generarOCService.iniciarAtajos(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.reiniciarValores();
      this.iniciarFormulario();
    }
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.redimensionarColumnas();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.accion === LS.ACCION_EJECUTAR) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

  @HostListener('focusout', ['$event.target']) onFocusout(target) {
    if (target.id === 'ocValorRetencion_1') {
      this.seleccionarPrimerFila();
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmOrdenCompra ? this.frmOrdenCompra.value : null));
      this.detalleInicial = JSON.parse(JSON.stringify(this.listadoResultado ? this.listadoResultado : null));
    }, 50);
  }

  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = '';
    if (this.invPedidosOrdenCompra.invCliente && this.invPedidosOrdenCompra.invCliente.invClientePK.cliCodigo) {
      tamanio = this.collapseAmbos();
    } else {
      tamanio = this.isCollapsed ? '415px' : '280px';
    }
    this.cambiarTamanioTabla(tamanio);
  }

  collpaseCliente() {
    this.isCollapseCliente = !this.isCollapseCliente;
    let tamanio = this.collapseAmbos();
    this.cambiarTamanioTabla(tamanio);
  }

  collapseAmbos(): string {
    let tamanio = (this.isCollapsed && this.isCollapseCliente ? '610px' : (!this.isCollapsed && !this.isCollapseCliente ? '310px' : (this.isCollapsed && !this.isCollapseCliente ? '475px' : '480px')));
    return tamanio;
  }

  cambiarTamanioTabla(tamanio) {
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')',
      'min-height': '165px'
    }
  }

  reiniciarValores() {
    this.invPedidosOrdenCompra = new InvPedidosOrdenCompra();
    this.listaInvPedidosDetalle = [];
    this.configuracion = new InvPedidosConfiguracionTO();
    this.funcionesUsuario = [];
    this.activar = false;
    this.frmTitulo = "";
    this.invPedidoTO = null;
    this.vistaFormulario = false;
    this.listadoEtiquetas = [];
    this.listadoResultado = [];
    this.filasTiempo = new FilasTiempo();
  }

  iniciarFormulario() {
    if (this.empresaSeleccionada && this.data && this.data.accion) {
      this.accion = this.data.accion;
      this.iniciarAgGrid();
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      if (this.accion === LS.ACCION_EJECUTAR && this.data.invPedidosPK) {
        this.traerConfiguracionPedidos();
      } else if (this.data.invPedidosOrdenCompraPK) {
        this.realizarAccion();
      } else {
        this.realizarAccion();
      }
    }
  }

  /** Ejecuta cada vez que cambia un motivo */
  traerConfiguracionPedidos() {
    this.cargando = true;
    //Todos los roles se restauran
    this.funcionesUsuario = [];
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      invPedidosMotivoPK: new InvPedidosMotivoPK({
        pmEmpresa: this.data.invPedidosPK.pedEmpresa,
        pmCodigo: this.data.invPedidosPK.pedMotivo,
        pmSector: this.data.invPedidosPK.pedSector
      })
    };
    this.configuracionPedidoService.getListaInvPedidosConfiguracion(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Callback, despues de traer el listado de configuracion  */
  despuesDeListarConfiguracionPedido(respuesta) {
    this.configuracion = respuesta;
    this.funcionesUsuario = this.ordenPedidoService.establecerFuncionesUsuario(this.configuracion);
    this.cargando = false;
    this.realizarAccion();
  }

  realizarAccion() {
    switch (this.accion) {
      case LS.ACCION_EJECUTAR: {
        this.ejecutarInvPedidosCrearOrdenCompra();
        break;
      }
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_ANULAR:
      case LS.ACCION_APROBAR: {
        this.consultarOrdenCompra();
        break;
      }
      case LS.ACCION_CARRITO: {
        this.consultarParaCarrito();
        break;
      }
    }
  }

  consultarParaCarrito() {
    this.cargando = true;
    let parametro = { detSecuencial: this.data.detSecuencial };
    this.api.post("todocompuWS/pedidosWebController/listarInvPedidosOrdenCompra", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo && respuesta.extraInfo.listadoInvPedidosOrdenCompra && respuesta.extraInfo.listadoInvPedidosOrdenCompra.length > 0) {
          this.ordenesDeCompra = respuesta.extraInfo.listadoInvPedidosOrdenCompra;
          this.frmTitulo = LS.PEDIDOS_ORDEN_COMPRA_CONSULTAR;
          this.vistaFormulario = true;
          this.cambiarActivar();//Se maximixa el formulario 
        } else {
          this.toastr.warning(LS.MSJ_DETALLE_NO_ASOCIADO, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  ejecutarInvPedidosCrearOrdenCompra() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_EJECUTAR, this, true)) {
      this.cargando = true;
      this.frmTitulo = LS.PEDIDOS_ORDEN_COMPRA_GENERAR;
      this.obtenerDatosGenerarInvPedidosOrdenCompra();
    }
  }

  consultarOrdenCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.frmTitulo = this.accion + " " + LS.TAG_ORDEN_COMPRA.toLowerCase() + " " + "No. ";
      this.obtenerOrdenCompra();
    }
  }

  obtenerDatosGenerarInvPedidosOrdenCompra() {
    this.cargando = true;
    let parametro = { invPedidosPK: this.data.invPedidosPK };
    this.filasTiempo.iniciarContador();
    this.ordenCompraService.obtenerDatosGenerarInvPedidosOrdenCompra(parametro, this, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.filasTiempo.finalizarContador();
        if (respuesta && !respuesta.listaInvPedidosOrdenCompraMotivoTO || respuesta.listaInvPedidosOrdenCompraMotivoTO.length == 0) {
          this.ordenCompraService.mostrarSwalMasInformacion(LS.MSJ_NO_MOTIVOS_ORDEN_COMPRA, this);
        } else if (respuesta) {
          this.formatearDatosParaGenerarOrdenCompra(respuesta);
        } else {
          this.cerrarFormulario();//Se cierra el formulario
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  formatearDatosParaGenerarOrdenCompra(respuesta) {
    //Formateo de datos
    respuesta.fechaActual ? this.fechaActual = new Date(respuesta.fechaActual) : new Date();
    respuesta.listaInvPedidosOrdenCompraMotivoTO ? this.despuesDeListarInvPedidosOrdenCompraMotivoTO(respuesta.listaInvPedidosOrdenCompraMotivoTO) : null;
    respuesta.invProductoEtiquetas ? this.despuesDeObtenerEtiquetas(respuesta.invProductoEtiquetas) : null;
    this.invPedidosOrdenCompra = respuesta.invPedidosOrdenCompra ? new InvPedidosOrdenCompra(respuesta.invPedidosOrdenCompra) : new InvPedidosOrdenCompra();
    this.invPedidosOrdenCompra.ocFechaHoraEntrega = respuesta.invPedidosOrdenCompra.ocFechaHoraEntrega ? new Date(respuesta.invPedidosOrdenCompra.ocFechaHoraEntrega) : new Date(respuesta.fechaActual);
    //Datos para generar la orden de compra 
    this.listaInvPedidosDetalle = respuesta.listaInvPedidosDetalle;
    this.resetearFormulario();
    this.vistaFormulario = true;
    this.cambiarActivar();//Se maximixa el formulario
    this.cargando = false;
    this.invPedidosOrdenCompra.invCliente && this.invPedidosOrdenCompra.invCliente.invClientePK.cliCodigo ? this.cambiarTamanioTabla("610px") : null;
    this.ordenDeCompra = respuesta.ordenDeCompra
    this.extraerValoresIniciales();
    if (this.empresaSeleccionada.empRuc === '0992879254001') {
      this.proveedorPorCedula('0992846151001');
    }
  }

  resetearFormulario() {
    this.motivoOCSeleccionado = this.listadoMotivoOC.length > 0 ? this.listadoMotivoOC[0] : null;
    this.proveedorCopia = new InvProveedorTO();
    this.invPedidosOrdenCompra ? this.invPedidosOrdenCompra.invProveedor = new InvProveedor() : null;
    this.listadoResultado = this.ordenCompraService.obtenerFormatoGenerarOrdenCompraDetalleList(this.listaInvPedidosDetalle, this.apruebaTodos);
    this.invPedidosOrdenCompra.ocCodigoTransaccional = this.utilService.generarCodigoAleatorio(LS.KEY_EMPRESA_SELECT, new Date());
    this.invPedidosOrdenCompra.ocFechaEmision = this.fechaActual;
    this.generarOCService.focusProveedorCodigo();
    if (this.accion === LS.ACCION_EJECUTAR) {
      this.etiquetaSeleccionada ? this.establecerCostoReferencial(this.etiquetaSeleccionada.field, true) : this.toastr.warning(LS.MSJ_INVALID_COSTO_REF);
    }
  }

  guardarOrdenCompra(form: NgForm) {
    this.cargando = true;
    if (this.generarOCService.validarAntesDeEnviar(form, this, this.gridApi)) {
      this.actualizarEmailProveedor();
    }
  }

  actualizarEmailProveedor() {
    if (this.motivoOCSeleccionado.ocmAprobacionAutomatica && this.motivoOCSeleccionado.ocmNotificarProveedor && (this.proveedorCopia.provEmailOrdenCompra === null || this.proveedorCopia.provEmailOrdenCompra === "")) {
      let parametros = { message: LS.MSJ_NOTIFICAR_PROVEEDOR, confirmButtonText: LS.MSJ_ACEPTAR, input: 'email' };
      this.utilService.generarSwallInputText(parametros).then((result) => {
        if (result.value) {
          this.emailProveedor = result.value;
          this.accion === LS.ACCION_EJECUTAR ? this.insertarOrdenCompra() : this.realizarAprobacionOC();
        }
      });
    } else {
      this.accion === LS.ACCION_EJECUTAR ? this.insertarOrdenCompra() : this.realizarAprobacionOC();
    }
  }

  insertarOrdenCompra() {
    if (this.motivoOCSeleccionado.ocmAprobacionAutomatica) {
      this.invPedidosOrdenCompra.ocAprobada = true;
      this.invPedidosOrdenCompra.usrAprueba = this.auth.getCodigoUser();
    }
    let invPedidosOrdenCompraCopia: InvPedidosOrdenCompra = this.ordenCompraService.formatearOrdenCompra(this.invPedidosOrdenCompra, this);
    let parametro = { invPedidosOrdenCompra: invPedidosOrdenCompraCopia, invPedidosPK: this.data.invPedidosPK, listaInvPedidosDetalle: this.listaInvPedidosDetalle };
    this.api.post("todocompuWS/pedidosWebController/insertarInvPedidosOrdenCompra", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          //Establece nuevos valores
          if (respuesta.extraInfo.invPedidosOrdenCompraPK) {//Si existe el número es porque se inserto la orden de compra
            this.invPedidosOrdenCompra.invPedidosOrdenCompraPK = respuesta.extraInfo.invPedidosOrdenCompraPK;
            this.invPedidoTO = respuesta.extraInfo.invPedidosTO;
            this.listaInvPedidosDetalle = respuesta.extraInfo.listaInvPedidosDetalle;
            //SI EL MOTIVO TIENE APROBACION AUTOMATICA, SE NOTIFICA AL PROVEEDOR, SINO SE NOTIFICA A LOS APROBADORES
            if (this.invPedidosOrdenCompra.ocAprobada) {
              this.notificarProveedor(respuesta.operacionMensaje);
            } else {
              this.enviarNotificacionesAprobadores(this.invPedidosOrdenCompra);
              this.despuesDeInsertarOrdenDeCompra(respuesta.operacionMensaje);
            }
          } else {
            this.cargando = false;
            this.listaInvPedidosDetalle = respuesta.extraInfo.listaInvPedidosDetalle;
            if (this.listaInvPedidosDetalle.length > 0) {
              this.invPedidoTO = respuesta.extraInfo.invPedidosTO;
              this.listadoResultado = this.ordenCompraService.obtenerFormatoGenerarOrdenCompraDetalleList(this.listaInvPedidosDetalle, false);
            } else {
              this.toastr.warning(LS.MSJ_NO_GENERO_OC_FALTA_ITEMS, LS.TAG_AVISO);
              this.invPedidoTO = respuesta.extraInfo.invPedidosTO;
              this.enviarObjetoAListaCerrar();
            }
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  enviarNotificacionesAprobadores(invPedidoOC: InvPedidosOrdenCompra) {
    if (this.accion === LS.ACCION_EJECUTAR && this.configuracion.listAprobadores.length > 0 && this.motivoOCSeleccionado.ocmNotificarAprobador) {
      let url = location.protocol + "//" + location.host + location.pathname + LS.MSJ_NOTIFICACION_RUTA_ENLACE_APROBADOR;
      let emailAprobadores = this.ordenPedidoService.obtenerUsuariosEmail("Aprobador", this.configuracion);
      let msje = LS.MSJ_NOTIFICACION_APROBADOR_OC + invPedidoOC.invPedidosOrdenCompraPK.ocNumero + LS.MSJ_NOTIFICACION_ACCEDER_ENLACE_APROBADOR_OC + '<a href="' + url + '">' + url + "</a>";
      let parametro = { usuarioCorreo: emailAprobadores, notificacion: msje };
      this.sistemaService.enviarNotificacionUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  notificarProveedor(mensajeGuardarOC) {
    if (this.motivoOCSeleccionado && this.motivoOCSeleccionado.ocmNotificarProveedor) {
      this.cargando = true;
      let parametro = { invPedidosOrdenCompraPK: this.invPedidosOrdenCompra.invPedidosOrdenCompraPK, emailProveedor: this.emailProveedor };
      this.archivoService.completarInformacionReporte(parametro, this.empresaSeleccionada, LS.KEY_EMPRESA_SELECT);
      this.api.post("todocompuWS/pedidosWebController/enviarPDFOrdenCompra", parametro, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data && data.estadoOperacion !== LS.KEY_EXITO) {
            data.operacionMensaje = LS.PEDIDOS_ERROR_NOTIFICACION + data.operacionMensaje;
          }
          this.despuesDeInsertarOrdenDeCompra(mensajeGuardarOC, data.operacionMensaje);
          this.cargando = false;
        })
        .catch(err => {
          this.utilService.handleError(err, this);
          this.despuesDeInsertarOrdenDeCompra(mensajeGuardarOC);
        });
    } else {
      this.despuesDeInsertarOrdenDeCompra(mensajeGuardarOC);
      this.cargando = false;
    }
  }

  despuesDeInsertarOrdenDeCompra(mensajeGuardarOC, operacionMensaje?) {
    operacionMensaje = !operacionMensaje ? '' : operacionMensaje;
    this.listadoResultado = this.ordenCompraService.obtenerFormatoGenerarOrdenCompraDetalleList(this.listaInvPedidosDetalle, false);
    let element = document.getElementById("Cantidad");
    element && this.apruebaTodos ? element.click() : null;
    this.gridApi ? this.gridApi.setRowData(this.listadoResultado) : null;
    let numeroOrdenCompra = new InvPedidosOrdenCompraPK(this.invPedidosOrdenCompra.invPedidosOrdenCompraPK);
    let mensaje = " [Orden de compra No.: " + numeroOrdenCompra.toString() + "]";
    this.preguntarImprimirOrdenCompra(mensajeGuardarOC + mensaje + '<br>' + operacionMensaje);
  }

  preguntarImprimirOrdenCompra(texto: string) {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      let parametros = {
        title: LS.TOAST_CORRECTO,
        texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR,
        type: LS.SWAL_SUCCESS,
        confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona Imprimir
          this.imprimirOrdenCompra();
        } else {//Cierra el formulario
          this.noQuiereImprimir();
        }
      });
    } else {
      this.noQuiereImprimir();
    }
  }

  noQuiereImprimir() {
    if (this.accion === LS.ACCION_APROBAR) {
      this.enviarObjetoAListaOrdenCompraCerrar();
    } else if (this.invPedidoTO && this.invPedidoTO.pedejecutado) {
      this.enviarObjetoAListaCerrar();
    } else {
      this.resetearFormulario();
    }
    this.cargando = false;
  }

  imprimirOrdenCompra() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      if (this.invPedidosOrdenCompra.ocAprobada) {
        let parametro = { invPedidosOrdenCompraPK: this.invPedidosOrdenCompra.invPedidosOrdenCompraPK, nombreReporte: LS.NOMBRE_REPORTE_ORDEN_COMPRA_APROBADA };
        this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompra", parametro, this.empresaSeleccionada)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta._body.byteLength > 0) {
              this.utilService.descargarArchivoPDF('OrdenCompra_' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
              this.accionesDespuesDeImprimir();
            } else {
              this.accionesDespuesDeImprimir();
              this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        let parametro = { invPedidosOrdenCompraPK: this.invPedidosOrdenCompra.invPedidosOrdenCompraPK, nombreReporte: LS.NOMBRE_REPORTE_ORDEN_COMPRA };
        this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosOrdenCompra", parametro, this.empresaSeleccionada)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta._body.byteLength > 0) {
              this.utilService.descargarArchivoPDF('OrdenCompra_' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
              this.accionesDespuesDeImprimir();
            } else {
              this.accionesDespuesDeImprimir();
              this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
            }
          }).catch(err => this.utilService.handleError(err, this));
      }

    } else {
      this.cargando = false;
      this.accionesDespuesDeImprimir();
    }
  }

  accionesDespuesDeImprimir() {
    if (this.accion === LS.ACCION_APROBAR) {
      this.enviarObjetoAListaOrdenCompraCerrar();
    } else if (this.accion === LS.ACCION_EJECUTAR && this.invPedidoTO.pedejecutado) {
      this.enviarObjetoAListaCerrar();
    } else if (this.accion === LS.ACCION_EJECUTAR) {
      this.resetearFormulario();
    }
    this.cargando = false;
  }

  enviarObjetoAListaCerrar() {
    // this.invPedidoTO.index = Math.random();
    this.enviarLista.emit({ objeto: this.invPedidoTO, accion: LS.LST_ELIMINAR });//Envia el objeto y la accion a realizar
  }

  obtenerOrdenCompra() {
    this.cargando = true;
    let parametro = { invPedidosOrdenCompraPK: this.data.invPedidosOrdenCompraPK };
    this.filasTiempo.iniciarContador();
    this.ordenCompraService.obtenerDatosInvPedidosOrdenCompra(parametro, this, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta) {
          this.filasTiempo.finalizarContador();
          //Formateo de datos
          this.invPedidosOrdenCompra = respuesta.invPedidosOrdenCompra;
          this.fechaEmision = respuesta.invPedidosOrdenCompra.ocFechaEmision;
          this.invPedidosOrdenCompra.ocFechaEmision = this.utilService.fomatearFechaString(respuesta.invPedidosOrdenCompra.ocFechaEmision, "YYYY-MM-DD");
          this.invPedidosOrdenCompra.ocFechaHoraEntrega = new Date(this.invPedidosOrdenCompra.ocFechaHoraEntrega);
          this.proveedorCopia = new InvProveedorTO();
          this.proveedorCopia.provCodigo = this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo;
          this.proveedorCopia.provRazonSocial = this.invPedidosOrdenCompra.invProveedor.provRazonSocial;
          this.motivoOCCopia = new InvPedidosOrdenCompraMotivoTO({ ocmCodigo: this.invPedidosOrdenCompra.invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmCodigo });
          let field = this.ordenCompraService.obtenerCampoCostoDesdeEtiqueta(this.invPedidosOrdenCompra.ocFormaPago);
          this.etiquetaSeleccionada.field = field;
          respuesta.listaInvPedidosOrdenCompraMotivoTO ? this.despuesDeListarInvPedidosOrdenCompraMotivoTO(respuesta.listaInvPedidosOrdenCompraMotivoTO) : null;
          respuesta.invProductoEtiquetas ? this.despuesDeObtenerEtiquetas(respuesta.invProductoEtiquetas) : null;
          this.listadoResultado = this.ordenCompraService.obtenerFormatoConsultaOrdenCompraDetalleList(this.invPedidosOrdenCompra.invPedidosOrdenCompraDetalleList);
          this.vistaFormulario = true;
          this.cargando = false;
          this.ordenDeCompra = respuesta.ordenDeCompra
          this.cambiarActivar();//Se maximixa el formulario  
          //TOTALES
          this.pinnedBottomRowData[2].totalGeneral = this.invPedidosOrdenCompra.ocMontoTotal;//general ..
          this.pinnedBottomRowData[1].ocValorRetencion = this.invPedidosOrdenCompra.ocValorRetencion;//retencion .
          this.pinnedBottomRowData[0].ocValorRetencion = this.pinnedBottomRowData[2].totalGeneral > 0 ? this.pinnedBottomRowData[2].totalGeneral - this.pinnedBottomRowData[1].ocValorRetencion : 0;//subtotal
          this.extraerValoresIniciales();
          if (this.invPedidosOrdenCompra.invCliente && this.invPedidosOrdenCompra.invCliente.invClientePK.cliCodigo) {
            this.estilos = {
              'width': '100%',
              'height': 'calc(100vh - 610px)',
              'min-height': '165px'
            }
          }
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  anularOrdenCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_ANULAR_ORDEN_COMPRA, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ANULAR_ORDEN_COMPRA,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ANULAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { invPedidosOrdenCompraPK: this.invPedidosOrdenCompra.invPedidosOrdenCompraPK };
          this.api.post("todocompuWS/pedidosWebController/anularInvPedidosOrdenCompra", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.invPedidosOrdenCompra.ocAnulado = true;
                this.enviarObjetoAListaOrdenCompraCerrar();
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  aprobarOrdenCompra() {
    if (this.utilService.verificarPermiso(LS.ACCION_APROBAR_ORDEN_COMPRA, this, true)) {
      this.actualizarEmailProveedor();
    }
  }

  realizarAprobacionOC() {
    this.cargando = true;
    this.invPedidosOrdenCompra.usrAprueba = this.auth.getCodigoUser();
    let parametro = { invPedidosOrdenCompraPK: this.invPedidosOrdenCompra.invPedidosOrdenCompraPK };
    this.api.post("todocompuWS/pedidosWebController/aprobarInvPedidosOrdenCompra", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.invPedidosOrdenCompra.ocAprobada = true;
          this.notificarProveedor(respuesta.operacionMensaje);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
          this.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  enviarObjetoAListaOrdenCompraCerrar() {
    this.invPedidosOrdenCompra.ocFechaEmision = this.fechaEmision;
    if (this.accion === LS.ACCION_APROBAR || (this.accion === LS.ACCION_EJECUTAR && this.motivoOCSeleccionado.ocmAprobacionAutomatica)) {
      this.invPedidosOrdenCompra.usrAprueba = this.auth.getNombrecompleto();
    }
    let invPedidosOrdenCompraTO: InvPedidosOrdenCompraTO = this.ordenCompraService.crearInvOrdenCompraTO(this.invPedidosOrdenCompra);
    this.enviarLista.emit({ objeto: invPedidosOrdenCompraTO, accion: LS.LST_ACTUALIZAR });//Envia el objeto y la accion a realizar
  }

  //#region [R2] MODAL PROVEEDOR
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.generarOCService.esValidoProveedor(this.proveedorCopia, this.invPedidosOrdenCompra) && this.accion === LS.ACCION_EJECUTAR) {
      if (this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo && this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo.length > 0) {
        let busqueda = this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo.toUpperCase();
        let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, categoria: this.data.catCodigo ? this.data.catCodigo : null, inactivos: false, busqueda: busqueda };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
        modalRef.result.then((result: InvProveedorTO) => {
          if (result) {
            //Llena los datos
            this.proveedorCopia = new InvProveedorTO(result);
            this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo = this.proveedorCopia.provCodigo;
            this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provEmpresa = this.proveedorCopia.empCodigo;
            this.actualizarFilas();
            this.focusedCantidad(0);
          }
        }, () => {
          //Cuando se cierra sin traer datos
          this.actualizarFilas();
          this.generarOCService.focusProveedorCodigo();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTERTOMODAL, LS.TAG_AVISO);
      }
    }
  }

  validarProveedor() {
    if (this.proveedorCopia.provCodigo !== this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo) {
      this.proveedorCopia = new InvProveedorTO();
      this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo = null;
    }
  }

  proveedorPorCedula(cedula) {
    this.cargando = true;
    let parametro = {
      busqueda: cedula,
      categoria: null,
      empresa: LS.KEY_EMPRESA_SELECT,
      inactivos: false,
    }

    this.proveedorService.listarInvProveedorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProveedorTO(data) {
    this.cargando = false;
    //Llena los datos
    this.proveedorCopia = new InvProveedorTO(data[0]);
    this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo = this.proveedorCopia.provCodigo;
    this.invPedidosOrdenCompra.invProveedor.invProveedorPK.provEmpresa = this.proveedorCopia.empCodigo;
    this.actualizarFilas();
    this.focusedCantidad(0);
  }
  //#endregion

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit({ 'activar': this.activar, 'deshabilitarOpciones': true, 'vistaListado': false, 'vistaFormulario': false, accion: this.accion });
  }

  /** Oculta el formulario y muestra la búsqueda. */
  cancelarAccion() {
    if (this.accion === LS.ACCION_CONSULTAR || this.accion === LS.ACCION_CARRITO) {
      this.cerrarFormulario();
    } else {
      if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmOrdenCompra) && this.ordenPedidoService.puedoCancelarFormularioDetalle(this.detalleInicial, this.listadoResultado)) {
        this.enviarCancelar.emit();
      } else {
        let parametros = {
          title: LS.MSJ_TITULO_CANCELAR,
          texto: LS.MSJ_PREGUNTA_CANCELAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona SI
            this.cerrarFormulario();
          }
        });
      }

    }
  }

  cerrarFormulario() {
    this.cargando = false;
    this.enviarCancelar.emit({ accion: this.accion });
  }

  ejecutarAccion(data, accion) {
    if (accion === 'verKardex') {
      this.buscarKardex(data);
    }
  }

  buscarKardex(detalle: InvPedidosOrdenCompraDetalleTO) {
    if (detalle.proCodigoPrincipal && detalle.proCodigoPrincipal.length > 0) {
      let desde = new Date(this.utilService.obtenerFechaInicioMes());
      desde.setMonth(desde.getMonth() - 1);
      let parametroBusquedaProducto = {
        empresa: LS.KEY_EMPRESA_SELECT,
        bodega: null,
        producto: detalle.proCodigoPrincipal,
        desde: desde,
        hasta: this.utilService.formatearDateToStringDDMMYYYY(this.utilService.obtenerFechaFinMes()),
        promedio: LS.KEY_KARDEX_PROMEDIO,
        isModal: true
      };
      const modalRef = this.modalService.open(KardexListadoComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
      modalRef.componentInstance.datos = { vista: 'produccion', empresaSeleccionada: this.empresaSeleccionada };
      modalRef.componentInstance.isModal = true;
      modalRef.result.then(() => {
        this.actualizarFilas();
      }, () => {
        this.actualizarFilas();
      });
    } else {
      this.toastr.info(LS.MSJ_SELECCIONE_PRODUCTO, LS.TOAST_INFORMACION)
    }
  }

  exportarOrdenCompra() {
    if (this.ordenPedidoService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametro = { invPedidosOrdenCompraPK: this.invPedidosOrdenCompra.invPedidosOrdenCompraPK };
      this.generarOCService.exportarOrdenCompra(parametro, this, this.empresaSeleccionada);
    }
  }

  configurarEtiquetas() {
    const modalRef = this.modalService.open(ProductoEtiquetasComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.accion = LS.ACCION_CREAR;
    modalRef.componentInstance.pedidos = true;
    modalRef.result.then((result) => {
      this.despuesDeObtenerEtiquetas(result);//Se formatea para mostrar etiquetas
    }, () => { });
  }

  establecerPrecioReferencial() {
    if (this.etiquetaSeleccionada && this.etiquetaSeleccionada.field && this.etiquetaSeleccionada.field.trim().length > 0) {
      if (this.motivoOCSeleccionado && this.motivoOCSeleccionado.ocmCostoFijo) {
        this.establecerCostoReferencial(this.etiquetaSeleccionada.field, true);
      } else {
        let parametros = {
          title: LS.TOAST_ADVERTENCIA,
          texto: LS.MSJ_PREGUNTA_COSTOS,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          //Si presiona SI, Costo y costo referencial; else solo el precio referencial
          this.etiquetaSeleccionada ? this.establecerCostoReferencial(this.etiquetaSeleccionada.field, respuesta ? true : false) : null;
        });
      }
    } else {
      this.toastr.warning(LS.MSJ_NO_ITEM_VALIDO, LS.TAG_AVISO)
    }
  }

  establecerCostoReferencial(campoReferencia: string, reemplazar: boolean) {
    if (this.gridApi) {
      this.campoCostoRerefencia = this.ordenPedidoService.obtenerCampoDesdeReferencia(campoReferencia);
      var itemsToUpdate = [];
      var total = 0;
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
        var data = rowNode.data;
        let costoReferencial = this.utilService.redondearNDecimales(data[this.campoCostoRerefencia], 6);
        data.detPrecioReferencial = costoReferencial;
        reemplazar ? data.detPrecioReal = costoReferencial : null;
        itemsToUpdate.push(data);
        //Actualizar parcial
        let parcial = data.detCantidad * data.detPrecioReal;
        total = total + parcial;
      });
      this.pinnedBottomRowData[0].ocValorRetencion = total;////Subtotal:Suma de todos los parciales
      if (this.accion === LS.ACCION_EJECUTAR) {
        this.invPedidosOrdenCompra.ocValorRetencion = total;
        this.pinnedBottomRowData[1].ocValorRetencion = 0.01 * total;//Retencion
        this.pinnedBottomRowData[2].totalGeneral = this.pinnedBottomRowData[0].ocValorRetencion - this.pinnedBottomRowData[1].ocValorRetencion;//Total general
      }
      this.listadoResultado = itemsToUpdate;
      this.gridApi.updateRowData({ update: itemsToUpdate });
      this.refreshGrid();
    }
  }

  terminadoEditar(event) {
    if (event && event.colDef && event.colDef.field === "detPrecioReal" || event.colDef.field === "detCantidad") {
      if (event.colDef.field === "detCantidad") {
        let cantidadPorAdquirir = event.data.detCantidadAprobada - event.data.detCantidadAdquirida;
        if (event.data.detCantidad > cantidadPorAdquirir) {
          event.data.detCantidad = cantidadPorAdquirir;
        }
      }
      this.calcularTotal();
    }
    if (event.colDef.field === "ocValorRetencion") {
      this.calcularTotalCambiandoRetencion();
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    if (this.accion === LS.ACCION_CARRITO) {
      this.columnDefs = this.generarOCService.generarColumnasOrdenCompraDetalleConsulta();
    } else {
      this.columnDefs = this.generarOCService.generarColumnasOrdenCompraDetalle(this, this.accion);
    }
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent,
      numericEditor: NumericCellComponent,
      inputEditor: InputCellComponent,
      pinnedCell: PinnedCellComponent,
      checkEditor: CheckCellComponent
    };
    this.pinnedBottomRowData = this.generarOCService.generarPinnedBottonRowData();
    this.rowClassRules = {
      "ag-footer-pinned": function (params) {
        return params.node.rowPinned ? true : false;
      }
    };
    this.accion === LS.ACCION_EJECUTAR ? this.calcularTotal() : null;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
    this.gridApi.sizeColumnsToFit();
    if (this.accion === LS.ACCION_EJECUTAR) {
      this.calcularTotal();
      if (this.listadoEtiquetas.length > 0) {
        this.etiquetaSeleccionada ? this.establecerCostoReferencial(this.etiquetaSeleccionada.field, true) : this.toastr.warning(LS.MSJ_INVALID_COSTO_REF);
      } else {
        this.etiquetaSeleccionada = null;
      }
    }
    this.generarOCService.focusProveedorCodigo();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  focusedCantidad(index) {
    setTimeout(() => { this.cantidadFocusAndEditingCell(index) }, 50);
  }

  filaFocused(event) {
    if (!event.rowPinned) {
      let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
      let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
      let columna = filasFocusedCell ? filasFocusedCell.column : null;
      this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
      this.objetoSeleccionado = fila ? fila.data : null;
    }
  }

  cambiarEstadoCheckCabecera(value) {
    this.apruebaTodos = value;
    if (this.apruebaTodos) {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.data.detCantidad = rowNode.data.detCantidadAprobada - rowNode.data.detCantidadAdquirida;
      });
    } else {
      this.gridApi.forEachNode((rowNode) => {
        rowNode.data.detCantidad = 0;
      });
    }
    this.calcularTotal();
  }

  cantidadFocusAndEditingCell(index) {
    this.gridApi.setFocusedCell(index, 'detCantidad')
    this.gridApi.startEditingCell({ rowIndex: index, colKey: "detCantidad" });
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  calcularTotal() {
    let total = 0;
    if (this.gridApi) {
      this.gridApi.forEachNode((rowNode) => {
        let parcial = rowNode.data.detCantidad * rowNode.data.detPrecioReal;
        total = total + parcial;
      });
      this.pinnedBottomRowData[0].ocValorRetencion = total;//Subtotal:Suma de todos los parciales
      this.invPedidosOrdenCompra.ocValorRetencion = total * 0.01;//retencion de invCompras
      this.pinnedBottomRowData[1].ocValorRetencion = this.invPedidosOrdenCompra.ocValorRetencion;
      this.pinnedBottomRowData[2].totalGeneral = this.pinnedBottomRowData[0].ocValorRetencion - this.pinnedBottomRowData[1].ocValorRetencion;//Total general
      this.refreshGrid();
    }
  }

  calcularTotalCambiandoRetencion() {
    let total = 0;
    if (this.gridApi) {
      this.gridApi.forEachNode((rowNode) => {
        let parcial = rowNode.data.detCantidad * rowNode.data.detPrecioReal;
        total = total + parcial;
      });
      this.pinnedBottomRowData[0].ocValorRetencion = total;//Subtotal:Suma de todos los parciales
      this.invPedidosOrdenCompra.ocValorRetencion = this.pinnedBottomRowData[1].ocValorRetencion;//retencion de invCompras
      this.pinnedBottomRowData[2].totalGeneral = this.pinnedBottomRowData[0].ocValorRetencion - this.pinnedBottomRowData[1].ocValorRetencion;//Total general
      this.refreshGrid();
    }
  }

  //#region [R1] Combos Reload data
  listarMotivosOC() {
    this.cargando = true;
    this.listadoMotivoOC = [];
    this.motivoOCCopia = this.motivoOCSeleccionado;//Guarda el seleccionado
    this.motivoOCSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, sector: this.data.secCodigo };
    this.motivoOrdenCompraService.listarInvPedidosOrdenCompraMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvPedidosOrdenCompraMotivoTO(data) {
    this.listadoMotivoOC = data;
    this.motivoOCSeleccionado = this.utilService.getObjetoSeleccionadoComboObligatorio(this.listadoMotivoOC, this.motivoOCCopia, 'ocmCodigo');
    this.cargando = false;
  }

  obtenerEtiquetas() {
    this.listadoEtiquetas = [];
    this.etiquetaSeleccionada = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.etiquetasService.obtenerEtiquetas(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerEtiquetas(data) {
    this.invProductoEtiquetas = new InvProductoEtiquetas(data);
    for (let prop in this.invProductoEtiquetas) {
      //Si las propiedades son de costo y los valores no son vacios
      if (prop.toString().indexOf('ecosto') >= 0 && this.invProductoEtiquetas[prop] != "") {
        this.listadoEtiquetas.push({ field: prop, value: this.invProductoEtiquetas[prop] });
      }
    }
    if (this.listadoEtiquetas.length > 0) {//Seleccionar el primer elemento o el anteriormente seleccionado
      this.etiquetaSeleccionada = this.etiquetaSeleccionada && this.etiquetaSeleccionada.field ? this.listadoEtiquetas.find(value => value.field === this.etiquetaSeleccionada.field) : this.listadoEtiquetas[0];
      this.establecerCostoReferencial(this.etiquetaSeleccionada.field, true)
    } else {
      this.etiquetaSeleccionada = null;
    }
  }

  inicializarCostoReferencial(c1, c2) {
    if (c1 && c2) {
      return c1.field === c2.field;
    }
  }
  //#endregion

}
