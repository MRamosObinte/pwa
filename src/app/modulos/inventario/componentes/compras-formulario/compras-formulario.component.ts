import { InputNumericConBotonComponent } from './../../../componentes/input-numeric-con-boton/input-numeric-con-boton.component';
import { LabelNumericConBotonComponent } from './../../../componentes/label-numeric-con-boton/label-numeric-con-boton.component';
import { InputLabelCellComponent } from './../../../componentes/input-label-cell/input-label-cell.component';
import { InvListaBodegasTO } from './../../../../entidadesTO/inventario/InvListaBodegasTO';
import { InvListaProductosGeneralTO } from './../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ComprasFormularioService } from './compras-formulario.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { InvComprasDetalleTO } from '../../../../entidadesTO/inventario/InvComprasDetalleTO';
import { InvComprasTO } from '../../../../entidadesTO/inventario/InvComprasTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ComprasService } from '../../transacciones/compras/compras.service';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { ListadoProveedoresComponent } from '../listado-proveedores/listado-proveedores.component';
import { InvComprasMotivoTO } from '../../../../entidadesTO/inventario/InvComprasMotivoTO';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { AnxCompraTO } from '../../../../entidadesTO/anexos/AnxCompraTO';
import { InvComprasPK } from '../../../../entidades/inventario/InvComprasPK';
import { ListadoProductosComponent } from '../listado-productos/listado-productos.component';
import { ModalCompraDetalleComponent } from './modal-compra-detalle/modal-compra-detalle.component';
import { AnxTipoComprobanteComboTO } from '../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { BodegaComponent } from '../../archivo/bodega/bodega.component';
import { PiscinaService } from '../../../produccion/archivos/piscina/piscina.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { InvComboFormaPagoTO } from '../../../../entidadesTO/inventario/InvComboFormaPagoTO';
import { SistemaService } from '../../../sistema/sistema/sistema.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { AnxCompraDetalleRetencionTO } from '../../../../entidadesTO/anexos/AnxCompraDetalleRetencionTO';
import { AnxCompraDetalleTO } from '../../../../entidadesTO/anexos/AnxCompraDetalleTO';
import { AnxCompraReembolsoTO } from '../../../../entidadesTO/anexos/AnxCompraReembolsoTO';
import { AnxFormaPagoTO } from '../../../../entidadesTO/anexos/AnxFormaPagoTO';
import { RetencionComprasService } from './retencion-compras/retencion-compras.service';
import { CarFunPagosTO } from '../../../../entidadesTO/cartera/CarFunPagosTO';
import { MotivoComprasService } from '../../archivo/motivo-compras/motivo-compras.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-compras-formulario',
  templateUrl: './compras-formulario.component.html',
  styleUrls: ['./compras-formulario.component.css']
})
export class ComprasFormularioComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() data;
  @Input() empresaSeleccionada;
  @Output() enviarAccion = new EventEmitter();

  public listInvComprasDetalleTO: Array<InvComprasDetalleTO> = [];
  public listInvComprasDetalleTOEliminar: Array<InvComprasDetalleTO> = [];
  public listInvComprasDetalleTOCopia: Array<InvComprasDetalleTO> = [];

  public invCompraTO: InvComprasTO = new InvComprasTO();
  public invCompraCopia: InvComprasTO;

  public listadoPeriodos: Array<SisPeriodo> = [];
  public detalleSeleccionado: InvComprasDetalleTO;
  public constantes: object = null;
  public es: object = {};
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public tituloForm: string = "";
  public accion: string = null;
  public activar: boolean = false;
  public cargando: boolean = false;
  public tipoEmpresa: string = "";//si es comercial o no
  public configAutonumeric: AppAutonumeric;
  public mostrarFormularioCompras: boolean = false;
  //XML
  public importarXmlEstado: boolean = false;// true->compElectronica
  public minimoCompra: number = 0;
  public maximoCompra: number = 99999999999999;
  public comprobarRetencionAutorizadaProcesamiento: boolean = false;
  //Fechas
  public fechaEmision: any = new Date();
  public fechaAutorizacion: any = new Date();
  public fechaCaduca: any = new Date();
  public fechaVencimiento: any = new Date();
  public fechaAutorizacionValida: boolean = true;
  public fechaCaducaValida: boolean = true;
  public periodoAbierto: boolean = true;
  public fechaInicioMesGuardado: any = null;
  public fechaFinMesGuardado: any = null;
  //motivo
  public listadoMotivos: Array<InvComprasMotivoTO> = [];
  public motivoSeleccionado: InvComprasMotivoTO;
  //Forma pago
  public formaPagoSeleccionada: InvComboFormaPagoTO = null;
  public listaFormaPago: Array<InvComboFormaPagoTO> = [];
  public chequeRepetido: boolean = false;
  //proveedor
  public proveedor: InvProveedorTO = new InvProveedorTO(); //El proveedor se elegira en el modal
  public parametrosFormulario: any = null;
  public mostrarAccionesProveedor: boolean = false;
  public listaDocumentos: Array<AnxTipoComprobanteComboTO> = [];
  //Contable
  public mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  public parametrosContabilidad: any = {};
  public mostrarBtnContabilizar: boolean = true;
  //Prorrateo compras 
  public mostrarProrrateoCompras: boolean = false;
  //*********/Retencion**********//
  public anxCompraTO: AnxCompraTO;//Retencion
  public anxCompraTOCopia: AnxCompraTO;//Retencion
  public mostrarRetencionCompras: boolean = false;
  public parametrosRetencion = null;
  public listAnxCompraDetalleRetencionTO: Array<AnxCompraDetalleRetencionTO> = [];//Para visualizar en tabla
  public listAnxCompraDetalleTO: Array<AnxCompraDetalleTO> = [];//Para enviar server
  public listAnxCompraDetalleTOCopia: Array<AnxCompraDetalleTO> = [];//Para enviar server
  public listAnxCompraDetalleTOEliminar: Array<AnxCompraDetalleTO> = [];//Para enviar server
  public listAnxCompraReembolsoTO: Array<AnxCompraReembolsoTO> = []; //Para enviar server
  public listAnxCompraReembolsoTOEliminar: Array<AnxCompraReembolsoTO> = []; //Para enviar server
  public formaPagoRetencion: AnxFormaPagoTO = null;
  public formaPagoRetencionEliminar: AnxFormaPagoTO = null;
  //Validacion de retencion
  public numeroCreado: string = null;
  public numeroRepetido: boolean = false;
  public numeroDocValido000: boolean = true;
  public numeroAutorizacionValidaLongitud: boolean = true;
  public retencionFueAceptada: boolean = false;
  //imagenes
  public estamosEnVistaImagenes: boolean = false;
  //Pagos
  public listaInvListadoPagosTO = [];
  public mostrarFormularioPagos: boolean = false;
  public parametrosFormularioPagos = null;
  //orden compra
  public ordenCompra: any = {};

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
  @ViewChild("frmCompras") frmCompras: NgForm;
  public valoresIniciales: any;
  public listaInicial: any;

  constructor(
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private comprasService: ComprasService,
    private piscinaService: PiscinaService,
    private appSistemaService: AppSistemaService,
    private sistemaService: SistemaService,
    private contableService: ContableListadoService,
    private formaPagoService: FormaPagoService,
    private comprasFormularioService: ComprasFormularioService,
    private motivoComprasService: MotivoComprasService,
    private retencionComprasService: RetencionComprasService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.es = this.utilService.setLocaleDate();
    this.configAutonumeric = this.comprasService.obtenerAutonumeric();
  }

  ngOnInit() {
    if (this.data) {
      this.inicializarAtajos();
      this.tipoEmpresa = this.empresaSeleccionada.parametros[0] ? this.empresaSeleccionada.parametros[0].parActividad : "";
      this.operaciones();
    }
  }

  inicializarTipos(o1: InvComboFormaPagoTO, o2: InvComboFormaPagoTO) {
    if (o1 && o2) {
      return o1.ctaCodigo === o2.ctaCodigo;
    }
  }

  inicializarMotivos(o1: InvComprasMotivoTO, o2: InvComprasMotivoTO) {
    if (o1 && o2) {
      return o1.cmCodigo === o2.cmCodigo;
    }
  }

  inicializarFormaPago() {
    this.formaPagoSeleccionada = this.invCompraTO.compFormaPago ? this.listaFormaPago.find(
      (element) => element.fpDetalle && (element.fpDetalle.split('|')[1] ? element.fpDetalle.split('|')[1].trim() : element.fpDetalle) === this.invCompraTO.compFormaPago) : null;
  }

  inicializarMotivoSeleccionado() {
    this.motivoSeleccionado = this.listadoMotivos.find((element) => element.cmCodigo === this.motivoSeleccionado.cmCodigo);
  }

  obtenerFechaActual() {
    this.cargando = true;
    this.appSistemaService.obtenerFechaActual(this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerFechaActual(data) {
    this.cargando = false;
    this.fechaFinMesGuardado = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaEmision = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaVencimiento = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaCaduca = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaAutorizacion = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    //Fechas accion = crear 
    if (this.accion === LS.ACCION_CREAR) {
      if (this.data.fechaEmision && this.data.fechaAutorizacion && this.data.fechaCaduca) {
        this.fechaEmision = this.data.fechaEmision;
        this.fechaAutorizacion = this.data.fechaAutorizacion;
        this.fechaCaduca = this.data.fechaCaduca;
        this.periodoAbierto = true;
      } else {
        this.validarPeriodoAbierto();
      }
    } else {
      this.setearFechasDespuesConsultar();
    }
    this.getIVA();
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      if (this.data) {
        let element: HTMLElement = document.getElementById('btnImprimirCompra') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.data) {
        let element: HTMLElement = document.getElementById('btnActivarCompra') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.data) {
        let element: HTMLElement = document.getElementById('btnCancelarCompra') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      if (this.data) {
        let element: HTMLElement = document.getElementById('btnGuardarCompra') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
  }

  cerrarFormulario(invCompraCopia) {
    this.enviarAccion.emit({ accion: LS.ACCION_CREADO, invCompraTO: invCompraCopia, proveedor: this.proveedor });
  }

  cancelar() {
    let parametro = { accion: LS.ACCION_CANCELAR }
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        let parametros = {
          title: LS.MSJ_TITULO_CANCELAR,
          texto: LS.MSJ_PREGUNTA_CANCELAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        };
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.enviarAccion.emit(parametro);
          }
        });
        break;
      default:
        this.enviarAccion.emit(parametro);
    }
  }

  cambiarEstadoActivar() {
    this.activar = !this.activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
  }

  //OPERACIONES
  operaciones() {
    this.filasTiempo.iniciarContador();
    this.accion = this.data.accion;
    this.ordenCompra = this.data.ordenCompra;
    switch (this.data.accion) {
      case LS.ACCION_CREAR: {
        if (this.comprasService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.cargando = true;
          this.tituloForm = LS.TITULO_FORM_NUEVA_COMPRA;
          this.nuevaCompra();
        } else {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_COMPRA;
        this.consultarCompra();
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        if (this.comprasService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_MAYORIZAR_COMPRA;
          this.consultarCompra();
        } else {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
        break;
      }
      case LS.ACCION_ANULAR: {
        if (this.comprasService.verificarPermiso(LS.ACCION_ANULAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_ANULAR_COMPRA;
          this.consultarCompra();
        } else {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
        break;
      }
      case LS.ACCION_RESTAURAR: {
        if (this.comprasService.verificarPermiso(LS.ACCION_RESTAURAR, this, true)) {
          this.consultarCompra();
        } else {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        }
        break;
      }
    }
  }

  /**Nueva compra */
  nuevaCompra() {
    this.cargando = true;
    this.invCompraTO = this.data.invCompraTO ? this.data.invCompraTO : new InvComprasTO();
    this.anxCompraTO = this.data.anxCompraTO ? this.data.anxCompraTO : new AnxCompraTO();
    this.proveedor = this.data.proveedor ? this.data.proveedor : new InvProveedorTO();
    this.invCompraTO.provCodigo = this.proveedor.provCodigo;
    this.importarXmlEstado = this.invCompraTO.compElectronica;
    this.minimoCompra = this.data.minimoCompra ? this.data.minimoCompra : 0;
    this.maximoCompra = this.data.maximoCompra ? this.data.maximoCompra : 0;
    this.obtenerFechaActual();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, fecha: this.utilService.convertirFechaStringYYYYMMDD(this.fechaEmision), provTipoId: this.proveedor.provTipoId }
    this.comprasService.obtenerDatosBasicosCompraNueva(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosBasicosCompraNueva(respuesta) {
    if (respuesta) {
      this.listaFormaPago = respuesta.listaFormaPago;
      this.listadoMotivos = respuesta.listaInvComprasMotivoTO;
      this.listaDocumentos = respuesta.listaDocumentos;
      this.motivoSeleccionado = this.data && this.data.motivoSeleccionado ? this.data.motivoSeleccionado : null;
      //Detalle
      if (this.data.listInvComprasDetalleTO && this.data.listInvComprasDetalleTO.length > 0) {
        this.listInvComprasDetalleTO = this.data.listInvComprasDetalleTO;
      } else {
        let nuevoItem = new InvComprasDetalleTO()
        this.listInvComprasDetalleTO.push(nuevoItem);
      }
      this.iniciarAgGrid();
      this.enviarAccion.emit({ accion: LS.ACCION_MOSTRAR_FORMULARIO, vistaFormulario: true });
      this.mostrarFormularioCompras = true;
    } else {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
    this.cargando = false;
  }

  /**Consultar compra */
  consultarCompra() {
    if (this.data && this.data.parametroBusqueda) {
      this.cargando = true;
      this.comprasService.consultarCompra(this.data.parametroBusqueda, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeConsultarCompra(data) {
    this.cargando = false;
    if (data) {
      this.invCompraTO = new InvComprasTO(data.invComprasTO);
      this.invCompraCopia = this.invCompraTO;
      this.anxCompraTO = new AnxCompraTO(data.anxCompraTO);
      this.proveedor = new InvProveedorTO(data.proveedor);
      this.importarXmlEstado = this.invCompraTO.compElectronica;
      this.numeroCreado = this.invCompraTO.compDocumentoNumero;
      this.motivoSeleccionado = new InvComprasMotivoTO({ cmCodigo: this.invCompraTO.compMotivo, tipCodigo: this.invCompraTO.contTipo });
      this.setearListasDespuesConsultar(data);
      this.obtenerFechaActual();
      this.inicializarMotivoSeleccionado();
      this.inicializarFormaPago();
      this.setearOrdenCompra();
      this.setearMinimoMaximo(data);
      this.seterNumero99999();
      this.setearValorcomprobarRetencionAutorizadaProcesamiento(data);
      this.iniciarAgGrid();
      this.enviarAccion.emit({ accion: LS.ACCION_MOSTRAR_FORMULARIO, vistaFormulario: true });
      this.mostrarFormularioCompras = true;
    } else {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  setearValorcomprobarRetencionAutorizadaProcesamiento(data) {
    if (this.accion === LS.ACCION_MAYORIZAR && data.comprobarRetencionAutorizadaProcesamiento) {
      this.comprobarRetencionAutorizadaProcesamiento = data.comprobarRetencionAutorizadaProcesamiento;
    }
  }

  seterNumero99999() {
    if (this.invCompraTO.compDocumentoTipo === LS.CODIGO_COMPROBANTE_PAGOS || (this.invCompraTO.compDocumentoTipo === LS.CODIGO_NOTA_CREDITO && !this.invCompraTO.compDocumentoNumero)) {
      this.invCompraTO.compDocumentoNumero = "999-999-999999999";
    }
  }

  setearMinimoMaximo(data) {
    if (this.importarXmlEstado && data.itemResultadoBusquedaElectronico) {
      let totalComprobante = this.utilService.convertirDecimaleFloat(data.itemResultadoBusquedaElectronico.totalComprobante);
      this.minimoCompra = totalComprobante - totalComprobante * 0.10;
      this.maximoCompra = totalComprobante + totalComprobante * 0.10;
    }
  }

  setearFechasDespuesConsultar() {
    this.fechaEmision = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.invCompraTO.compFecha);
    this.fechaVencimiento = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.invCompraTO.compFechaVencimiento);
    this.anxCompraTO.compCaduca && this.anxCompraTO.compEmision ? this.fechaAutorizacion = this.utilService.formatoDateSinZonaHorariaDDMMYYYY(this.anxCompraTO.compEmision) : null;
    this.anxCompraTO.compCaduca && this.anxCompraTO.compEmision ? this.fechaCaduca = this.utilService.formatoDateSinZonaHorariaDDMMYYYY(this.anxCompraTO.compCaduca) : null;
    if (this.accion === LS.ACCION_MAYORIZAR) {
      this.fechaInicioMesGuardado = (moment(this.invCompraTO.compFecha)).startOf('month').toDate();
      this.fechaFinMesGuardado = (moment(this.invCompraTO.compFecha)).endOf('month').toDate();
      if (this.anxCompraTO && this.anxCompraTO.compNumero) {//Tiene retencion
        this.obtenerRetencion();
      }
    }
  }

  setearListasDespuesConsultar(data) {
    this.listaFormaPago = data.listaFormaPago;
    this.listaDocumentos = data.listaDocumentos;
    this.listaInvListadoPagosTO = data.listaInvListadoPagosTO;
    this.listadoMotivos = data.listaInvComprasMotivoTO;
    this.listInvComprasDetalleTO = this.comprasFormularioService.convertirInvListaDetalleComprasTOAInvComprasDetalleTO(data.listaInvCompraDetalleTO);
  }

  setearOrdenCompra() {
    //ordenCompra
    this.ordenCompra = {};
    this.ordenCompra.empresa = this.invCompraCopia.ocEmpresa;
    this.ordenCompra.sector = this.invCompraCopia.ocSector;
    this.ordenCompra.motivo = this.invCompraCopia.ocMotivo;
    this.ordenCompra.numero = this.invCompraCopia.ocNumero;
  }

  obtenerRetencion() {
    this.cargando = true;
    let parametros = {
      empresa: this.empresaSeleccionada.empCodigo,
      motivo: this.invCompraTO.compMotivo,
      numero: this.anxCompraTO.compNumero,
      periodo: this.invCompraTO.compPeriodo,
      usuarioCodigo: this.authService.getCodigoUser()
    };
    this.retencionComprasService.consultarRetencionCompra(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeConsultarRetencionCompra(respuesta) {
    this.cargando = false;
    if (respuesta.anxCompraTO) {
      this.formaPagoRetencion = respuesta.formaPagoRetencion.length > 0 ? new AnxFormaPagoTO({ fpCodigo: respuesta.formaPagoRetencion[0].fpCodigo }) : null;
      this.anxCompraTO = respuesta.anxCompraTO;
      this.listAnxCompraDetalleTO = respuesta.listaAnxCompra;
      this.listAnxCompraDetalleRetencionTO = respuesta.listAnxCompraDetalleRetencionTO;
    }
  }

  /**Anular compra */
  anularCompra() {
    if (this.invCompraTO.compNumero && this.invCompraTO.compPeriodo && this.invCompraTO.compMotivo) {
      let pk = new InvComprasPK({
        compEmpresa: this.empresaSeleccionada.empCodigo,
        compPeriodo: this.invCompraTO.compPeriodo,
        compMotivo: this.invCompraTO.compMotivo,
        compNumero: this.invCompraTO.compNumero
      });
      this.cargando = true;
      this.comprasService.anularCompra({ invComprasPK: pk }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeAnularCompra(respuesta) {
    this.cargando = false;
    this.invCompraTO.compAnulado = true;
    this.invCompraTO.compPendiente = false;
    this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    if (this.invCompraTO.compDocumentoNumero === "999-999-999999999") {
      this.invCompraTO.compDocumentoNumero = null;
    }
    this.cerrarFormulario(this.invCompraTO);
  }

  /**Restaurar compra */
  restaurarCompra() {
    if (this.invCompraTO.compNumero && this.invCompraTO.compPeriodo && this.invCompraTO.compMotivo) {
      let pk = new InvComprasPK({
        compEmpresa: this.empresaSeleccionada.empCodigo,
        compPeriodo: this.invCompraTO.compPeriodo,
        compMotivo: this.invCompraTO.compMotivo,
        compNumero: this.invCompraTO.compNumero
      });
      this.cargando = true;
      this.comprasService.restaurarCompra({ invComprasPK: pk }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeRestaurarCompra(respuesta) {
    this.cargando = false;
    this.invCompraTO.compAnulado = false;
    this.invCompraTO.compPendiente = false;
    this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    if (this.invCompraTO.compDocumentoNumero === "999-999-999999999") {
      this.invCompraTO.compDocumentoNumero = null;
    }
    this.cerrarFormulario(this.invCompraTO);
  }

  /**Modificar compra */
  modificarCompra(form: NgForm, pendiente) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      let continuar = false;
      if (this.importarXmlEstado) {
        //Debe estar en el rango 
        if (this.invCompraTO.compTotal >= this.minimoCompra && this.invCompraTO.compTotal <= this.maximoCompra) {
          continuar = true;
        } else {
          this.cargando = false;
          this.toastr.warning("El total de la compra debe encontrarse en el siguiente rango: " + this.minimoCompra + " y " + this.maximoCompra, LS.MSJ_TITULO_INVALIDOS);
        }
      } else {
        continuar = true;
      }
      if (continuar) {
        if (this.validarSiPuedeGuardar(pendiente)) {
          if (this.invCompraCopia.compDocumentoTipo === LS.CODIGO_NOTA_ENTREGA) {
            this.actualizarCompra();
          } else {
            this.validarFechasRetencionCompras();
          }
        }
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeModificarCompra(respuesta) {
    this.cargando = false;
    this.invCompraCopia = respuesta.extraInfo;
    if (this.invCompraCopia.compPendiente) {
      this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
      this.cerrarFormulario(this.invCompraCopia);
    } else {
      if (this.invCompraCopia.contNumero !== null) {
        this.recontabilizarCompra();
      } else {
        this.preguntarImprimir(respuesta);
      }
    }
  }

  actualizarCompra() {
    if (this.invCompraCopia.compDocumentoNumero === "999-999-999999999") {
      this.invCompraCopia.compDocumentoNumero = null;
    }
    let parametro = {
      desmayorizar: false,
      empresa: this.empresaSeleccionada.empCodigo,
      invComprasTO: this.invCompraCopia,
      formaPagoCompra: this.formaPagoSeleccionada,
      anxFormaPagoTO: this.formaPagoRetencion,
      anxFormaPagoTOEliminar: this.formaPagoRetencionEliminar,
      listInvComprasDetalleTO: this.listInvComprasDetalleTOCopia,
      listInvComprasDetalleTOEliminar: this.listInvComprasDetalleTOEliminar,
      anxCompraTO: this.anxCompraTOCopia,
      listAnxCompraDetalleTO: this.listAnxCompraDetalleTOCopia,
      listAnxCompraDetalleTOEliminar: this.listAnxCompraDetalleTOEliminar,
      listAnxCompraReembolsoTO: this.listAnxCompraReembolsoTO,
      listAnxCompraReembolsoTOEliminar: this.listAnxCompraReembolsoTOEliminar,
      listImagen: []
    };
    this.cargando = true;
    this.comprasService.modificarCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /**Insertar o mayorizar compra */
  insertarCompra(form: NgForm, pendiente) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      let continuar = false;
      if (this.importarXmlEstado) {
        //Debe estar en el rango 
        if (this.invCompraTO.compTotal >= this.minimoCompra && this.invCompraTO.compTotal <= this.maximoCompra) {
          continuar = true;
        } else {
          this.cargando = false;
          this.toastr.warning("El total de la compra debe encontrarse en el siguiente rango: " + this.minimoCompra + " y " + this.maximoCompra, LS.MSJ_TITULO_INVALIDOS);
        }
      } else {
        continuar = true;
      }
      if (continuar) {
        if (this.validarSiPuedeGuardar(pendiente)) {
          if (this.invCompraCopia.compDocumentoTipo === LS.CODIGO_NOTA_ENTREGA) {
            this.guardarCompra();
          } else {
            if (this.invCompraCopia.compDocumentoTipo === LS.CODIGO_NOTA_CREDITO && this.invCompraCopia.compDocumentoNumero === "999-999-999999999") {
              this.guardarCompra();
            } else {
              this.validarFechasRetencionCompras();
            }
          }
        }
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  guardarCompra() {
    if (this.invCompraCopia.compDocumentoNumero === "999-999-999999999") {
      this.invCompraCopia.compDocumentoNumero = null;
    }
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      usuario: this.authService.getCodigoUser(),
      invComprasTO: this.invCompraCopia,
      listInvComprasDetalleTO: this.listInvComprasDetalleTOCopia,
      proveedor: this.proveedor,
      formaPagoCompra: this.formaPagoSeleccionada,
      anxCompraTO: this.anxCompraTOCopia,
      anxFormaPagoTO: this.formaPagoRetencion,
      listAnxCompraDetalleTO: this.listAnxCompraDetalleTOCopia,
      listAnxCompraReembolsoTO: this.listAnxCompraReembolsoTO,
      listImagen: []
    };
    this.cargando = true;
    this.comprasService.guardarCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGuardarCompra(respuesta) {
    this.cargando = false;
    this.invCompraCopia = respuesta.extraInfo;
    if (this.invCompraCopia.compPendiente) {
      this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
      this.cerrarFormulario(this.invCompraCopia);
    } else {
      this.preguntarImprimir(respuesta);
    }
  }

  validarSiPuedeGuardar(pendiente): boolean {
    let sinErrores = true;
    if (this.chequeRepetido || !this.numeroAutorizacionValidaLongitud || !this.numeroDocValido000 || !this.periodoAbierto || !this.fechaCaducaValida || !this.fechaAutorizacionValida || !this.validarYFormatearAntesEnviar(pendiente)) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
      sinErrores = false;
    }
    return sinErrores;
  }

  validarYFormatearAntesEnviar(pendiente): boolean {
    this.invCompraCopia = JSON.parse(JSON.stringify(this.invCompraTO));
    this.anxCompraTOCopia = JSON.parse(JSON.stringify(this.anxCompraTO));
    this.listAnxCompraDetalleTOCopia = JSON.parse(JSON.stringify(this.listAnxCompraDetalleTO));
    //orden de compra
    this.formatearInvCompraTOCopia(pendiente);
    if (this.ordenCompra) {
      this.invCompraCopia.ocEmpresa = this.ordenCompra.empresa;
      this.invCompraCopia.ocMotivo = this.ordenCompra.motivo;
      this.invCompraCopia.ocSector = this.ordenCompra.sector;
      this.invCompraCopia.ocNumero = this.ordenCompra.numero;
    }
    if (this.invCompraCopia.compDocumentoTipo === LS.CODIGO_NOTA_ENTREGA) {
      this.resetearNotaEntrega();
    } else {
      if (this.invCompraCopia.compDocumentoTipo !== LS.CODIGO_REEMBOLSO) {
        this.resetearReembolso();
      }
      if (this.invCompraCopia.compDocumentoTipo !== LS.CODIGO_NOTA_CREDITO && this.invCompraCopia.compDocumentoTipo !== LS.CODIGO_NOTA_DEBITO) {
        this.resetearNotaCD();
      }
      if (this.invCompraCopia.compDocumentoTipo === LS.CODIGO_NOTA_CREDITO && this.invCompraCopia.compDocumentoNumero === "999-999-999999999") {
        this.invCompraCopia.compRetencionAsumida = false;
        this.anxCompraTOCopia = null;
        this.listAnxCompraDetalleTOCopia = [];
      }

      if (this.anxCompraTOCopia) {
        this.anxCompraTOCopia.compEmision = this.utilService.formatoStringSinZonaHorariaDDMMYYYY(this.fechaAutorizacion);
        this.anxCompraTOCopia.compCaduca = this.utilService.formatoStringSinZonaHorariaDDMMYYYY(this.fechaCaduca);
        let sumBase0 = 0;
        let sumBaseImp = 0;
        if (this.listAnxCompraDetalleTOCopia.length === 0) {
          this.toastr.warning("No ha hecho ninguna retención, por favor ingrésela..", LS.TAG_AVISO);
          return false;
        } else {
          this.listAnxCompraDetalleTOCopia.forEach(element => {
            sumBase0 += element.detBase0;
            sumBaseImp += element.detBaseImponible;
          });
          if (this.utilService.matRound2(sumBase0) !== this.utilService.matRound2(this.invCompraCopia.compBase0)
            || this.utilService.matRound2(sumBaseImp) !== this.utilService.matRound2(this.invCompraCopia.compBaseImponible)) {
            this.retencionFueAceptada = false;
            this.toastr.warning("Debe volver a realizar la retención", LS.TAG_AVISO);
            return false;
          }
        }
      }
    }

    //Detalle
    this.listInvComprasDetalleTOCopia = JSON.parse(JSON.stringify(this.listInvComprasDetalleTO));
    for (let i = 0; i < this.listInvComprasDetalleTOCopia.length; i++) {
      let element = this.listInvComprasDetalleTOCopia[i];
      element.detOrden = i;
      if (!element.bodCodigo || !element.proCodigoPrincipal || element.parcialProducto <= 0) {
        return false;
      }
      element.detPendiente = true;
      element.pisEmpresa = this.empresaSeleccionada.empCodigo;
      element.secEmpresa = this.empresaSeleccionada.empCodigo;
      element.bodEmpresa = this.empresaSeleccionada.empCodigo;
      element.comEmpresa = this.empresaSeleccionada.empCodigo;
      element.pisSector = element.secCodigo;

      delete element.listadoPiscinaTO;
      delete element.medidaDetalle;
      delete element.parcialProducto;
      delete element.nombreProducto;
      delete element.proCodigoPrincipalCopia;
      delete element.bodCodigoCopia;
    }

    for (let i = 0; i < this.listAnxCompraReembolsoTO.length; i++) {
      delete this.listAnxCompraReembolsoTO[i].provCodigoCopia;
    }

    return true;
  }

  formatearInvCompraTOCopia(pendiente) {
    this.invCompraCopia.compObservaciones = !this.invCompraCopia.compObservaciones ? "" : this.invCompraCopia.compObservaciones;
    this.invCompraCopia.compPendiente = pendiente;
    this.invCompraCopia.compMotivo = this.motivoSeleccionado.cmCodigo;
    this.invCompraCopia.empCodigo = this.empresaSeleccionada.empCodigo;
    this.invCompraCopia.provEmpresa = this.empresaSeleccionada.empCodigo;
    this.invCompraCopia.secEmpresa = this.empresaSeleccionada.empCodigo;
    this.invCompraCopia.secCodigo = this.listInvComprasDetalleTO[0].secCodigo;//averiguar
    this.invCompraCopia.usrInsertaCompra = this.authService.getCodigoUser();
    let fpDetalle = this.formaPagoSeleccionada && this.formaPagoSeleccionada.fpDetalle !== "POR PAGAR" ? this.formaPagoSeleccionada.fpDetalle.split('|')[1].trim() : this.formaPagoSeleccionada.fpDetalle;
    this.invCompraCopia.compFormaPago = fpDetalle;
    this.invCompraCopia.compDocumentoFormaPago = this.invCompraCopia.compDocumentoFormaPago ? this.invCompraCopia.compDocumentoFormaPago : '';
    this.invCompraCopia.compFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaEmision);
    this.invCompraCopia.compFechaVencimiento = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaVencimiento);
  }

  resetearNotaEntrega() {
    this.invCompraTO.compDocumentoNumero = null;
    this.formaPagoRetencion = null;
    this.anxCompraTOCopia = null;
    this.listAnxCompraDetalleTOCopia = [];
  }

  resetearReembolso() {
    this.listAnxCompraReembolsoTO = [];
    this.listAnxCompraReembolsoTOEliminar = [];
  }

  resetearNotaCD() {
    this.anxCompraTO.compModificadoDocumentoTipo = null;
    this.anxCompraTO.compModificadoDocumentoNumero = null;
    this.anxCompraTO.compModificadoAutorizacion = null;
  }

  //Bodega
  buscarBodega(params) {
    let keyCode = params.event.keyCode;
    let bodCodigoInput = params.event.target.value;
    let bodCodigo = params.data.bodCodigo;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.bodCodigo = bodCodigoInput;
      let fueBuscado = (bodCodigoInput === bodCodigo && bodCodigoInput && bodCodigo);
      if (!fueBuscado) {
        bodCodigoInput = bodCodigoInput ? bodCodigoInput.toUpperCase() : null;
        if (bodCodigoInput) {
          let parametroBusquedaProducto = { empresa: this.empresaSeleccionada.empCodigo, busqueda: bodCodigoInput, inactivo: false };
          this.abrirModalBodega(parametroBusquedaProducto, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          } else {
            this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }
    }
  }

  abrirModalBodega(parametroBusqueda, params) {
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_MAYORIZAR) {
      const modalRef = this.modalService.open(BodegaComponent, { size: 'lg', backdrop: 'static', windowClass: 'miSize' });
      modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          let resultado = new InvListaBodegasTO(result);
          params.event.target.value = resultado.bodCodigo;
          params.data.bodCodigo = resultado.bodCodigo;
          params.data.bodCodigoCopia = resultado.bodCodigo;
          params.data.secCodigo = resultado.codigoCP;//sector
          this.refreshGrid();
          this.listarPiscinas();
          this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.comprasFormularioService.bodegaFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }, () => {
        params.data.proCodigoPrincipal = "";
        this.validarBodega(params.data);
        this.comprasFormularioService.bodegaFocusAndEditingCell(params.node.rowIndex, this.gridApi);
      });
    }
  }

  validarBodega(detalle: InvComprasDetalleTO): boolean {
    if (detalle.bodCodigo !== detalle.bodCodigoCopia) {
      this.resetearBodega(detalle);
      return false;
    }
    return true;
  }

  resetearBodega(detalle: InvComprasDetalleTO) {
    detalle.bodCodigo = null;//Se borra la copia
    detalle.bodCodigoCopia = null;
    detalle.listadoPiscinaTO = [];
    this.refreshGrid();
  }

  //Producto
  buscarProducto(params) {
    let keyCode = params.event.keyCode;
    let proCodigoPrincipalInput = params.event.target.value;
    let proCodigoPrincipal = params.data.proCodigoPrincipal;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.proCodigoPrincipal = proCodigoPrincipalInput;
      let fueBuscado = (proCodigoPrincipalInput === proCodigoPrincipal && proCodigoPrincipalInput && proCodigoPrincipal);
      if (!fueBuscado) {
        proCodigoPrincipalInput = proCodigoPrincipalInput ? proCodigoPrincipalInput.toUpperCase() : null;
        if (proCodigoPrincipalInput) {
          let parametroBusquedaProducto = { empresa: this.empresaSeleccionada.empCodigo, busqueda: proCodigoPrincipalInput, categoria: null, bodega: params.data.bodCodigo, incluirInactivos: false, limite: false };
          this.abrirModalProducto(parametroBusquedaProducto, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          } else {
            this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
          }
        }
      } else {
        if (keyCode === LS.KEYCODE_TAB) {
          this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }
    }
  }

  abrirModalProducto(parametroBusquedaProducto, params) {
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_EDITAR || this.accion === LS.ACCION_MAYORIZAR) {
      const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', backdrop: 'static', windowClass: 'miSize' });
      modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          let resultado = new InvListaProductosGeneralTO(result);
          params.event.target.value = resultado.proCodigoPrincipal;
          params.data.proCodigoPrincipal = resultado.proCodigoPrincipal;
          params.data.proCodigoPrincipalCopia = resultado.proCodigoPrincipal;
          params.data.proEmpresa = this.empresaSeleccionada.empCodigo
          params.data.nombreProducto = resultado.proNombre;
          params.data.medidaDetalle = resultado.detalleMedida;
          params.data.proEstadoIva = resultado.proGravaIva;
          this.refreshGrid();
          this.calcularSubTotal();
          this.comprasFormularioService.cantidadFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        } else {
          this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
        }
      }, () => {
        params.data.proCodigoPrincipal = "";
        this.validarProducto(params.data);
        this.comprasFormularioService.productoFocusAndEditingCell(params.node.rowIndex, this.gridApi);
      });
    }
  }

  validarProducto(detalle: InvComprasDetalleTO): boolean {
    if (detalle.proCodigoPrincipal !== detalle.proCodigoPrincipalCopia) {
      this.resetearProducto(detalle);
      return false;
    }
    return true;
  }

  resetearProducto(detalle: InvComprasDetalleTO) {
    detalle.proCodigoPrincipalCopia = null;//Se borra la copia
    detalle.proCodigoPrincipal = null;
    detalle.nombreProducto = null;
    detalle.medidaDetalle = null;
    this.refreshGrid();
  }

  //Iva
  getIVA() {
    if (this.fechaEmision) {
      this.cargando = true;
      let parametro = { fechaFactura: this.fechaEmision }
      this.comprasService.obtenerIva(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeObtenerIva(data) {
    this.cargando = false;
    this.invCompraTO.compIvaVigente = data;
    this.calcularIvaTotal();
  }

  //Fecha vencimiento
  validarFechaVencimiento() {
    if (this.fechaEmision) {
      this.validacionFechas();
      this.getIVA();
      this.validarPeriodoAbierto();
    }
  }

  validarPeriodoAbierto() {
    this.cargando = true;
    this.periodoAbierto = false;
    if (this.fechaEmision) {
      let parametro = { empresa: this.empresaSeleccionada.empCodigo, fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(JSON.parse(JSON.stringify(this.fechaEmision))) };
      this.sistemaService.getIsPeriodoAbierto(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeObtenerIsPeriodoAbierto(data) {
    this.cargando = false;
    this.periodoAbierto = data;
  }

  validacionFechas() {
    this.fechaAutorizacionValida = false;
    this.fechaCaducaValida = false;
    if (this.invCompraTO.compDocumentoTipo !== LS.CODIGO_NOTA_ENTREGA) {
      if (this.anxCompraTO.compAutorizacion) {
        if (this.fechaEmision && this.fechaAutorizacion && this.fechaCaduca) {
          
          let fechaEmisionTime = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaEmision)).getTime();
          let fechaAutorizacionTime = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaAutorizacion)).getTime();
          let fechaCaducaTime = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaCaduca)).getTime();
          if (this.anxCompraTO.compAutorizacion.length === 37 || this.anxCompraTO.compAutorizacion.length === 49) {
            this.fechaAutorizacionValida = fechaEmisionTime <= fechaAutorizacionTime;
            this.fechaCaducaValida = fechaCaducaTime === fechaAutorizacionTime;
          } else {
            if (this.anxCompraTO.compAutorizacion.length === 10) {
              let diferenciaDias = Math.abs(moment(this.fechaAutorizacion).diff(moment(this.fechaCaduca), 'days'));
              let diasValidos = 0 <= diferenciaDias && diferenciaDias <= 366;
              this.fechaAutorizacionValida = fechaAutorizacionTime <= fechaEmisionTime;
              this.fechaCaducaValida = fechaEmisionTime <= fechaCaducaTime && diasValidos;
            }
          }
        }
      }
    } else {
      this.fechaAutorizacionValida = true;
      this.fechaCaducaValida = true;
    }
  }

  //Calculos
  calcularPrecio(item: InvComprasDetalleTO) {
    if (item.detCantidad > 0) {
      item.detPrecio = (item.parcialProducto / item.detCantidad);
    } else {
      item.detPrecio = 0;
      item.parcialProducto = 0;
    }
    this.refreshGrid();
  }

  calcularIceOtrosImp() {
    this.invCompraTO.compIce = 0;
    this.invCompraTO.compOtrosImpuestos = 0;
    this.gridApi.forEachNode((rowNode) => {
      let data: InvComprasDetalleTO = rowNode.data;
      this.invCompraTO.compIce += this.utilService.convertirDecimaleFloat(data.detIce);
      this.invCompraTO.compOtrosImpuestos += this.utilService.convertirDecimaleFloat(data.detOtrosImpuestos);
    });
    this.calcularTotal();
  }

  calcularTotal() {
    this.invCompraTO.compTotal = this.utilService.convertirDecimaleFloat(this.invCompraTO.compBase0) +
      this.utilService.convertirDecimaleFloat(this.invCompraTO.compBaseImponible) +
      this.utilService.convertirDecimaleFloat(this.invCompraTO.compIce) +
      this.utilService.convertirDecimaleFloat(this.invCompraTO.compMontoIva) +
      this.utilService.convertirDecimaleFloat(this.invCompraTO.compOtrosImpuestos);
  }

  calcularIvaTotal() {
    let sumatoria = 0;
    sumatoria = this.utilService.convertirDecimaleFloat(this.invCompraTO.compBaseImponible) + this.utilService.convertirDecimaleFloat(this.invCompraTO.compIce);
    this.invCompraTO.compMontoIva = sumatoria * (this.utilService.convertirDecimaleFloat(this.invCompraTO.compIvaVigente) / 100);
    this.calcularTotal();
  }

  calcularSubTotal() {
    let sumatoria0 = 0;
    let sumatoria12 = 0;
    this.invCompraTO.compBase0 = 0;
    this.invCompraTO.compBaseImponible = 0;
    this.gridApi.forEachNode((rowNode) => {
      let data: InvComprasDetalleTO = rowNode.data;
      if (data.parcialProducto > 0) {
        if (data.proEstadoIva === "GRAVA") {
          sumatoria12 += this.utilService.convertirDecimaleFloat(data.parcialProducto);
        } else {
          sumatoria0 += this.utilService.convertirDecimaleFloat(data.parcialProducto);
        }
      }
      this.invCompraTO.compBase0 = sumatoria0;
      this.invCompraTO.compBaseImponible = sumatoria12;
      this.calcularTotal();
      this.calcularIvaTotal();
    });
  }

  //DOCUMENTO
  validarNumeroDoc() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      tipoDocumento: this.invCompraTO.compDocumentoTipo,
      numeroDocumento: this.invCompraTO.compDocumentoNumero
    }
    this.comprasService.validarNumero(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  //PROVEEDOR
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esValidoProveedor()) {
      if (this.proveedor && this.invCompraTO.provCodigo.length > 0) {
        let busqueda = this.invCompraTO.provCodigo.toUpperCase();
        let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, categoria: null, inactivos: false, busqueda: busqueda };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
        modalRef.result.then((result: InvProveedorTO) => {
          if (result) {
            this.proveedor = new InvProveedorTO(result);
            this.invCompraTO.provCodigo = this.proveedor.provCodigo;
            this.obtenerDocumentos();
          } else {
            this.deseaAgregarProveedor();
          }
        }, (reason) => {
          if (!reason) {
            this.deseaAgregarProveedor();
          }
        });
      } else {
        this.toastr.info(LS.MSJ_ENTERTOMODAL, LS.TAG_AVISO);
      }
    }
  }

  deseaAgregarProveedor() {
    let parametros = {
      title: LS.INVENTARIO_COMPRAS,
      texto: LS.MSJ_PREGUNTA_INSERTAR_PROVEEDOR,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.mostrarFormularioProveedor();
      } else {
        this.comprasFormularioService.focus('provCodigo');
      }
    });
  }

  mostrarFormularioProveedor() {
    this.parametrosFormulario = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_CREAR,
      invProveedorTO: new InvProveedorTO(),
      tituloFormulario: LS.TITULO_FORM_NUEVO_PROVEEDOR,
      activar: this.activar,
    }
    this.mostrarAccionesProveedor = true;
  }

  cerrarFormularioProveedor(event) {
    if (event.invProveedorTO) {
      let proveedor = event.invProveedorTO;
      this.proveedor = new InvProveedorTO(proveedor);
      this.invCompraTO.provCodigo = this.proveedor.provCodigo;
      this.obtenerDocumentos();
    }
    this.mostrarAccionesProveedor = false;
    this.parametrosFormulario = null;
  }

  esValidoProveedor(): boolean {
    return this.invCompraTO.provCodigo != "" && this.proveedor.provCodigo === this.invCompraTO.provCodigo;
  }

  validarProveedor() {
    if (this.proveedor.provCodigo !== this.invCompraTO.provCodigo && (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR)) {
      this.proveedor = new InvProveedorTO();
      this.invCompraTO.provCodigo = null;
    }
  }

  //Documento por proveedor
  obtenerDocumentos() {
    if (this.proveedor.provTipoId) {
      this.invCompraTO.compDocumentoTipo = null;
      this.listaDocumentos = [];
      this.cargando = true;
      let parametro = { tipoIdentificacion: this.proveedor.provTipoId, tipoTransaccion: 'COMPRA' };
      this.comprasService.obtenerDocumentos(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.invCompraTO.compDocumentoTipo = null;
      this.listaDocumentos = [];
    }
  }

  despuesDeObtenerDocumentos(respuesta) {
    this.cargando = false;
    this.listaDocumentos = respuesta;
    this.comprasFormularioService.focus('documento');
  }

  validarSiEsNotaEntrega() {
    if (this.invCompraTO.compDocumentoTipo && this.invCompraTO.compDocumentoTipo !== LS.CODIGO_NOTA_ENTREGA) {
      this.invCompraTO.compDocumentoNumero = null;
      this.anxCompraTO = new AnxCompraTO();
      this.anxCompraTO.compAutorizacion = null;
      this.retencionFueAceptada = false;
      this.numeroRepetido = false;
      this.numeroDocValido000 = false;
      this.formaPagoRetencion = null;
      this.numeroAutorizacionValidaLongitud = false;
      this.invCompraTO.compRetencionAsumida = false;
      this.listAnxCompraDetalleTO = [];
      this.listAnxCompraDetalleRetencionTO = [];
      if (this.invCompraTO.compDocumentoTipo === LS.CODIGO_COMPROBANTE_PAGOS) {
        this.invCompraTO.compDocumentoNumero = "999-999-999999999";
        this.anxCompraTO = new AnxCompraTO();
        this.numeroDocValido000 = true;
      }
    } else {
      this.numeroRepetido = false;
      this.numeroDocValido000 = true;
      this.numeroAutorizacionValidaLongitud = true;
    }
  }

  /**Validar si tiene 000 el numero de documento */
  validarNumeroDocumento() {
    let buscar = false;
    if (this.accion === LS.ACCION_MAYORIZAR) {
      if (this.invCompraTO.compDocumentoNumero !== this.numeroCreado) {
        buscar = true;
      } else {
        this.numeroRepetido = false;
        this.numeroDocValido000 = true;
      }
    } else {
      buscar = true;
    }

    if (this.invCompraTO.compDocumentoTipo === LS.CODIGO_NOTA_CREDITO && this.invCompraTO.compDocumentoNumero === "999-999-999999999") {
      buscar = false;
      this.numeroRepetido = false;
      this.numeroDocValido000 = true;
      this.numeroAutorizacionValidaLongitud = true;
    }

    if (buscar) {
      if (this.invCompraTO.compDocumentoNumero && this.utilService.buscar_EnString(this.invCompraTO.compDocumentoNumero)) {
        this.invCompraTO.compDocumentoNumero = null;
      }
      if (this.invCompraTO.compDocumentoNumero) {
        this.numeroDocValido000 = false;
        let part1 = this.invCompraTO.compDocumentoNumero.substring(3, 0);
        let part2 = this.invCompraTO.compDocumentoNumero.substring(7, 4);
        let part3 = this.invCompraTO.compDocumentoNumero.substring(17, 8);
        if (part1 !== '000' && part2 !== '000' && part3 !== '000000000') {
          this.numeroDocValido000 = true;
          this.cargando = true;
          let parametro = { empresa: this.empresaSeleccionada.empCodigo, provCodigo: this.proveedor.provCodigo, compDocumentoTipo: this.invCompraTO.compDocumentoTipo, compDocumentoNumero: this.invCompraTO.compDocumentoNumero };
          this.numeroRepetido = true;
          this.comprasFormularioService.validarDocumentoRepetido(parametro, this, LS.KEY_EMPRESA_SELECT);
        }
      }
    }
  }

  despuesDeValidarDocumentoRepetido(esRepetido) {
    this.cargando = false;
    this.numeroRepetido = esRepetido;
  }

  /**Validar que nro de autorizacion cumpla con las longitudes correctas  */
  validarNumeroAutorizacionRetencion = function () {
    if (this.anxCompraTO.compAutorizacion) {
      this.numeroAutorizacionValidaLongitud = false;
      if (this.anxCompraTO.compAutorizacion.length === 10 || this.anxCompraTO.compAutorizacion.length === 37 || this.anxCompraTO.compAutorizacion.length === 49) {
        this.numeroAutorizacionValidaLongitud = true;
      }
    }
  };

  /**Validar si cheque es repetido */
  validarChequeRepetido() {
    if (this.formaPagoSeleccionada.validar && this.invCompraTO.compDocumentoFormaPago) {
      this.cargando = true;
      this.chequeRepetido = true;
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: this.invCompraTO.compDocumentoFormaPago,//documento ingresado en el input
        cuenta: this.formaPagoSeleccionada.ctaCodigo,//cuanta contable de la forma de pago
      }
      this.contableService.verificarDocumentoBanco(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.chequeRepetido = false;
    }
  }

  despuesDeVerificarDocumento(data) {
    this.cargando = false;
    this.chequeRepetido = !data ? true : false;
  }

  //DISTRIBUIR COSTO
  distrubuirCosto() {
    this.mostrarProrrateoCompras = true;
  }

  accionProrrateo(event) {
    let accion = event.accion;
    switch (accion) {
      case LS.ACCION_CREADO:
        this.cargando = true;
        this.agregarDistrubucion(event.lista);
        this.mostrarProrrateoCompras = false;
        break;
      case LS.ACCION_CANCELAR:
        this.mostrarProrrateoCompras = false;
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.activar;
        this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
        break;
      default:
        this.mostrarProrrateoCompras = false;
        break;
    }
  }

  agregarDistrubucion(lista: Array<InvComprasDetalleTO>) {
    let indexNuevo = this.listInvComprasDetalleTO.length - 1;//Ultima posicion 
    lista.forEach(nuevoItem => {
      indexNuevo = indexNuevo + 1;
      this.listInvComprasDetalleTO.splice(indexNuevo, 0, nuevoItem);
      this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexNuevo }) : null;
    });
    this.calcularSubTotal();
    this.cargando = false;
    this.inicializarAtajos();
  }

  //DISTRIBUIR DESCUENTO
  distribuirDescuento() {

  }

  //RETENCION
  consultarRetencion() {
    this.parametrosRetencion = {
      parametrosBusqueda: {
        empresa: this.empresaSeleccionada.empCodigo,
        periodo: this.invCompraTO.compPeriodo,
        motivo: this.invCompraTO.compMotivo,
        numero: this.invCompraTO.compNumero,
        usuarioCodigo: this.authService.getCodigoUser()
      },
      accion: LS.ACCION_CONSULTAR
    }
  }

  sePuedeHacerRetencion(): boolean {
    this.cargando = true;
    if (!this.periodoAbierto || this.chequeRepetido || !this.numeroAutorizacionValidaLongitud || !this.numeroDocValido000 || this.numeroRepetido || !this.fechaCaducaValida || !this.fechaAutorizacionValida ||
      !this.comprasFormularioService.validarDetalle(JSON.parse(JSON.stringify(this.listInvComprasDetalleTO)))) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
      return false;
    }

    return true;
  }

  retencionCompras(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      if (this.sePuedeHacerRetencion()) {
        if (this.retencionFueAceptada) {
          this.cargando = false;
          let invCompraCopia = JSON.parse(JSON.stringify(this.invCompraTO));
          this.parametrosRetencion = {
            accion: LS.ACCION_CREADO,
            invCompraTO: invCompraCopia,
            anxCompraTO: this.anxCompraTO,
            anxFormaPagoTO: this.formaPagoRetencion,
            listAnxCompraDetalleRetencionTO: this.listAnxCompraDetalleRetencionTO,
            listAnxCompraReembolsoTO: this.listAnxCompraReembolsoTO,
          }
        } else {
          if (this.accion === LS.ACCION_MAYORIZAR) {
            if (this.anxCompraTO && this.anxCompraTO.compNumero) {
              this.cargando = false;
              this.parametrosRetencion = {
                parametrosBusqueda: {
                  empresa: this.empresaSeleccionada.empCodigo,
                  periodo: this.invCompraTO.compPeriodo,
                  motivo: this.invCompraTO.compMotivo,
                  numero: this.invCompraTO.compNumero,
                  usuarioCodigo: this.authService.getCodigoUser()
                },
                accion: LS.ACCION_MAYORIZAR
              }
            } else {
              this.nuevaRetencion();
            }
          } else {
            this.nuevaRetencion();
          }
        }
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  nuevaRetencion() {
    this.cargando = false;
    let invCompraCopia = JSON.parse(JSON.stringify(this.invCompraTO));
    let listInvComprasDetalleTOCopia = JSON.parse(JSON.stringify(this.listInvComprasDetalleTO));
    invCompraCopia.compFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaEmision);
    this.parametrosRetencion = {
      accion: LS.ACCION_CREAR,
      invCompraTO: invCompraCopia,
      anxCompraTO: this.anxCompraTO,
      listInvComprasDetalleTO: this.comprasFormularioService.formatearListaQuitarTemporales(listInvComprasDetalleTOCopia)
    }
  }

  accionRetencion(event) {
    let accion = event.accion;
    switch (accion) {
      //Creado: parametros{listAnxCompraDetalleRetencionTO,listAnxCompraDetalleTO,listAnxCompraDetalleTOEliminar,listAnxCompraReembolsoTO,listAnxCompraReembolsoTOEliminar,anxCompraTO,anxCompraFormaPagoTO,anxCompraFormaPagoEliminarTO}
      case LS.ACCION_CREADO:
        this.anxCompraTO = event.parametros.anxCompraTO;
        this.listAnxCompraDetalleRetencionTO = event.parametros.listAnxCompraDetalleRetencionTO;//Para ver en tabla
        this.listAnxCompraDetalleTO = event.parametros.listAnxCompraDetalleTO;//Para enviar a server
        this.listAnxCompraDetalleTOEliminar = event.parametros.listAnxCompraDetalleTOEliminar;//Para enviar a server
        this.listAnxCompraReembolsoTO = event.parametros.listAnxCompraReembolsoTO;//Para enviar a server
        this.listAnxCompraReembolsoTOEliminar = event.parametros.listAnxCompraReembolsoTOEliminar;//Para enviar a server
        this.formaPagoRetencion = event.parametros.anxFormaPagoTO;//Para enviar a server
        this.formaPagoRetencionEliminar = event.parametros.anxFormaPagoTOEliminar;//Para enviar a server
        this.cargando = false;
        this.retencionFueAceptada = true;
        this.mostrarRetencionCompras = false;
        this.parametrosRetencion = null;
        this.invCompraTO.compRetencionAsumida = event.parametros.compRetencionAsumida;
        this.inicializarAtajos();
        break;
      case LS.ACCION_CANCELAR:
        this.mostrarRetencionCompras = false;
        this.parametrosRetencion = null;
        this.inicializarAtajos();
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.activar;
        this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
        break;
      default:
        this.mostrarRetencionCompras = false;
        break;
    }
  }

  validarFechasRetencionCompras() {
    this.cargando = true;
    let parametro = {
      fechaCompra: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaEmision),
      fechaRetencion: this.anxCompraTO.compRetencionFechaEmision,
      fechaEmision: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaAutorizacion),
      fechaCaduca: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaCaduca),
      compAutorizacion: this.anxCompraTO.compAutorizacion,
      isCompRetencionAsumida: this.invCompraTO.compRetencionAsumida
    };
    this.retencionComprasService.validarFechaRetencion(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeValidarFechaRetencion() {
    this.cargando = false;
    if (this.accion === LS.ACCION_CREAR) {
      this.guardarCompra();
    } else {
      if (this.accion === LS.ACCION_MAYORIZAR) {
        this.actualizarCompra();
      }
    }
  }

  //MENU
  mostrarContextMenu(data, rowIndex, event) {
    this.detalleSeleccionado = data;
    this.generarOpcionesDetalle(rowIndex);
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  mostrarOpciones(event, dataSelected) {
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    if (filasFocusedCell) {
      this.mostrarContextMenu(dataSelected, filasFocusedCell.rowIndex, event);
    }
  }

  generarOpcionesDetalle(rowIndex) {
    let permiso = (this.data.accion === LS.ACCION_MAYORIZAR || this.data.accion === LS.ACCION_CREAR);
    let permisoEliminar = (this.data.accion === LS.ACCION_MAYORIZAR || this.data.accion === LS.ACCION_CREAR);
    let permisoVerInfo = this.detalleSeleccionado && this.detalleSeleccionado.proCodigoPrincipal;

    this.opciones = [
      { label: LS.MSJ_VER_DATOS, icon: LS.ICON_INFO_CIRCULO, disabled: !permisoVerInfo, command: () => permisoVerInfo ? this.accionAdicional(this.detalleSeleccionado) : null },
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', rowIndex) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', rowIndex) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permisoEliminar, command: () => permisoEliminar ? this.eliminarFila(rowIndex) : null },
    ];
  }

  agregarFilaAlFinal(params) {
    let keyCode = params.event.keyCode;
    let index = params.node.rowIndex;
    this.detalleSeleccionado = this.listInvComprasDetalleTO[index];
    if (this.detalleSeleccionado.proCodigoPrincipal && this.utilService.validarKeyBuscar(keyCode) && (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) && index >= 0 && index === (this.listInvComprasDetalleTO.length - 1)) {
      if (keyCode === LS.KEYCODE_TAB) {
        params.event.srcElement.blur();
        params.event.preventDefault();
      }
      this.agregarFilaByIndex(index, 'down', false);
    }
  }

  agregarFila(ubicacion: string, rowIndex, noFocused?) {
    let index = rowIndex;
    if (index >= 0) {
      this.agregarFilaByIndex(index, ubicacion, noFocused);
    }
  }

  agregarFilaByIndex(index, ubicacion, noFocused?) {
    this.detalleSeleccionado = this.listInvComprasDetalleTO[index];
    let indexNuevo = ubicacion === 'up' ? index : index + 1;
    var nuevoItem = this.obtenerNuevoDetalle(this.detalleSeleccionado);
    this.listInvComprasDetalleTO.splice(indexNuevo, 0, nuevoItem);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexNuevo }) : null;
    if (!noFocused) {
      nuevoItem.bodCodigo ? this.comprasFormularioService.focusedProducto(indexNuevo, this.gridApi) : this.comprasFormularioService.focusedBodega(indexNuevo, this.gridApi);
    } else {
      this.comprasFormularioService.cantidadFocusAndEditingCell(index, this.gridApi)
    }
    this.refreshGrid();
  }

  eliminarFila(index) {
    if (this.listInvComprasDetalleTO.length > 1) {
      if (this.detalleSeleccionado.detSecuencia && this.detalleSeleccionado.detSecuencia != 0) {
        let detalleEliminar = JSON.parse(JSON.stringify(this.detalleSeleccionado));
        delete detalleEliminar.parcialProducto;
        delete detalleEliminar.medidaDetalle;
        delete detalleEliminar.nombreProducto;
        delete detalleEliminar.proCodigoPrincipalCopia;
        delete detalleEliminar.bodCodigoCopia;
        delete detalleEliminar.listadoPiscinaTO;
        detalleEliminar.comEmpresa = this.empresaSeleccionada.empCodigo;
        this.listInvComprasDetalleTOEliminar.push(detalleEliminar);
      }
      this.listInvComprasDetalleTO.splice(index, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [this.detalleSeleccionado], addIndex: index }) : null;
      this.calcularSubTotal();
      this.refreshGrid();
    }
  }

  obtenerNuevoDetalle(elementoActual: InvComprasDetalleTO): InvComprasDetalleTO {
    let detalle = new InvComprasDetalleTO();
    detalle.bodCodigo = elementoActual.bodCodigo;
    detalle.bodCodigoCopia = elementoActual.bodCodigoCopia;
    detalle.secCodigo = elementoActual.secCodigo;
    detalle.listadoPiscinaTO = elementoActual.listadoPiscinaTO;
    return detalle;
  }

  //Validacion
  alCambiarValorDeCelda(event) {
    //Si finalizo de editar el codigo de producto, validar el codigo principal
    if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) {
      if (event.colDef.field === "bodCodigo") {
        this.validarBodega(event.data);
      }
      if (event.colDef.field === "proCodigoPrincipal") {
        this.validarProducto(event.data);
      }
      if (event.colDef.field === "detCantidad" || event.colDef.field === "parcialProducto") {
        this.calcularPrecio(event.data);
        this.calcularSubTotal();
      }
    }
  }

  //Accion adicional
  accionAdicional(detalle, tipo?) {
    tipo = !tipo ? 'detalle' : tipo;
    let permiso = false;
    switch (tipo) {
      case 'detCantidad':
        permiso = detalle && detalle.proCodigoPrincipal;
        break;
      default:
        permiso = true;
    }
    if (permiso) {
      const modalRef = this.modalService.open(ModalCompraDetalleComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.item = detalle;
      modalRef.componentInstance.invCompraTO = this.invCompraTO;
      modalRef.componentInstance.tipo = tipo;
      modalRef.componentInstance.accion = this.accion;
      modalRef.componentInstance.configAutonumeric = this.configAutonumeric;
      modalRef.componentInstance.listadoPiscinaTO = detalle.listadoPiscinaTO ? detalle.listadoPiscinaTO : [];
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.result.then((result) => {
        if (result) {
          if (tipo === 'detCantidad') {
            this.detalleSeleccionado.detCantidad = result.detCantidad;
            this.refreshGrid();
          } else {
            this.detalleSeleccionado.pisNumero = result.pisNumero;
            this.detalleSeleccionado.detIce = result.detIce;
            this.detalleSeleccionado.detOtrosImpuestos = result.detOtrosImpuestos;
            this.calcularIceOtrosImp();
          }
        }
      }, () => {
      });
    }
  };

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.comprasService.generarColumnasDetalle(this); //crea las colunmas - Siempre en un servicio
    this.columnDefsSelected = this.columnDefs.slice(); // define columnas seleccionadas para el combo de seleccion
    this.context = { componentParent: this }; //compartir el contexto padre a la grilla
    this.frameworkComponents = { //componentes adicionales a incrustar en la tabla
      toolTip: TooltipReaderComponent,
      numericCell: NumericCellComponent,
      pinnedCell: PinnedCellComponent,
      inputNumeric: InputNumericConBotonComponent,
      labelNumeric: LabelNumericConBotonComponent,
      inputLabelCell: InputLabelCellComponent,

    };
    this.components = {}; //componentes adicionales
  }

  onGridReady(params) {
    this.gridApi = params.api; //inicializa la grilla
    this.gridColumnApi = params.columnApi; //columnas de la grilla
    this.actualizarFilas(); //se debe actualizar las filas para el footer, incluye el tiempo
    this.redimensionarColumnas();
    if (this.accion === LS.ACCION_CREAR) {
      this.comprasFormularioService.focus('provCodigo');
    } else {
      this.seleccionarPrimerFila();
    }
    this.calcularSubTotal();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
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
      if (columna.getId() === "parcialProducto") {
        setTimeout(() => {
          this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() });
        })
      } else {
        this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() });
      }
    }
    this.detalleSeleccionado = fila ? fila.data : null;
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event']) onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  /** Funciones generales,mostrar ventana emergente cuando teclea f5 o cierra ventana*/
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.data.accion !== LS.ACCION_CONSULTAR && this.data.accion !== LS.ACCION_ANULAR && this.data.accion !== LS.ACCION_RESTAURAR) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

  //Listados
  listarFormaPago() {
    this.cargando = true;
    this.listaFormaPago = [];
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo
    };
    this.formaPagoService.listarComboFormaPagoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboFormaPagoTO(respuesta) {
    this.cargando = false;
    this.listaFormaPago = respuesta;
    this.listaFormaPago.push(this.comprasFormularioService.fpPorPagar());
  }

  listarMotivos() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activos: true };
    this.motivoComprasService.listarInvComprasMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvComprasMotivoTO(resp) {
    this.listadoMotivos = resp;
    this.cargando = false;
  }

  //piscinas
  listarPiscinas() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      sector: this.detalleSeleccionado.secCodigo,
      mostrarInactivo: false,
    };
    this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPiscina(data) {
    this.cargando = false;
    this.detalleSeleccionado.listadoPiscinaTO = data;
  }

  //Contabilizar
  preguntarContabilizar(data) {
    let cmFormaContabilizar = this.motivoSeleccionado && this.motivoSeleccionado.cmFormaContabilizar ? this.motivoSeleccionado.cmFormaContabilizar : '';
    switch (cmFormaContabilizar) {
      case 'PREGUNTAR':
        let parametros = {
          title: LS.MSJ_TITULO_CONTABILIZAR,
          texto: data.operacionMensaje + '<br> ¿Desea contabilizar la compra?',
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        };
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.contabilizarCompra();
          } else {
            this.cerrarFormulario(this.invCompraCopia);
          }
        });
        break;
      case 'AUTOMATICAMENTE':
        this.contabilizarCompra();
        break;
      case 'NO CONTABILIZAR':
      default:
        this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_SUCCESS, data.operacionMensaje);
        this.cerrarFormulario(this.invCompraCopia);
    }
  }

  preguntarImprimir(data) {
    let cmFormaImprimir = this.motivoSeleccionado && this.motivoSeleccionado.cmFormaImprimir ? this.motivoSeleccionado.cmFormaImprimir : '';
    switch (cmFormaImprimir) {
      case 'AUTOMATICAMENTE':
        this.imprimirCompra();
        this.preguntarContabilizar(data);
        break;
      case 'PREGUNTAR':
        let parametros = {
          title: LS.TOAST_CORRECTO,
          texto: data.operacionMensaje + "<br>" + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>",
          type: LS.SWAL_SUCCESS,
          confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
          cancelButtonText: LS.LABEL_SALIR
        };
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.imprimirCompra();
          }
          this.preguntarContabilizar(data);
        });
        break;
      default:
        this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_SUCCESS, data.operacionMensaje);
        this.cerrarFormulario(this.invCompraCopia);
    }
  }

  recontabilizarCompra() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      invComprasTO: this.invCompraCopia
    };
    this.comprasFormularioService.recontabilizarCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeRecontabilizarCompra(respuesta) {
    if (respuesta) {
      let parametros = {
        title: LS.TOAST_CORRECTO,
        texto: respuesta.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_VER_CONTABLE,
        type: LS.SWAL_SUCCESS,
        confirmButtonText: "<i class='" + LS.ICON_VER + "'></i>  " + LS.ACCION_VER_CONTABLE,
        cancelButtonText: LS.LABEL_SALIR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona CONTABILIZAR
          this.verContable();
        } else {//Cierra el formulario
          this.cargando = false;
          this.cerrarFormulario(this.invCompraCopia);
        }
      });
    }
    this.cargando = false;
    this.cerrarFormulario(this.invCompraCopia);
  }

  contabilizarCompra() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      invComprasTO: this.invCompraCopia
    };
    this.comprasFormularioService.contabilizarCompra(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeContabilizarCompra(data) {
    if (data) {
      this.mostrarBtnContabilizar = false;
      let parametros = {
        title: LS.TOAST_CORRECTO,
        texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_VER_CONTABLE,
        type: LS.SWAL_SUCCESS,
        confirmButtonText: "<i class='" + LS.ICON_VER + "'></i>  " + LS.ACCION_VER_CONTABLE,
        cancelButtonText: LS.LABEL_SALIR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona CONTABILIZAR
          this.verContable();
        } else {//Cierra el formulario
          this.cargando = false;
          this.cerrarFormulario(this.invCompraCopia);
        }
      });
    } else {
      this.cargando = false;
      this.cerrarFormulario(this.invCompraCopia);
    }
  }

  imprimirCompra() {
    this.cargando = true;
    let pk = new InvComprasPK({
      compEmpresa: this.empresaSeleccionada.empCodigo,
      compPeriodo: this.invCompraTO.compPeriodo,
      compMotivo: this.invCompraTO.compMotivo,
      compNumero: this.invCompraTO.compNumero
    });
    let listaPk: Array<InvComprasPK> = [];
    listaPk.push(pk)
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteCompra", { listaPk: listaPk }, this.empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Compra' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //Contable
  verContable() {
    if (this.invCompraCopia.compPeriodo && this.motivoSeleccionado && this.motivoSeleccionado.tipCodigo && this.invCompraCopia.compNumero) {
      this.cargando = true;
      this.parametrosContabilidad = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.invCompraCopia.compPeriodo + " | " + (this.motivoSeleccionado.tipCodigo ? this.motivoSeleccionado.tipCodigo : 'C-COM') + " | " + this.invCompraCopia.compNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: this.activar,
        volverACargar: false,
        listadoSectores: [],
        tamanioEstructura: null,
        tipoContable: (this.motivoSeleccionado.tipCodigo ? this.motivoSeleccionado.tipCodigo : 'C-COM'),
        listaPeriodos: []
      };
      this.mostrarAccionesContabilidad = true;
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
      if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) {
        this.cerrarFormulario(this.invCompraCopia);
      }
    }
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.activar = event.objetoEnviar ? event.objetoEnviar.activar : this.activar;
      this.parametrosContabilidad = null;
      this.mostrarAccionesContabilidad = false;
      this.inicializarAtajos();
      if (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) {
        this.cerrarFormulario(this.invCompraCopia);
      }
    }
  }

  cambiarEstadoActivarContabilidad(event) {
    this.activar = event;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
  }

  //Pagos
  consultarPagos(item) {
    let seleccionado = new CarFunPagosTO();
    seleccionado.pagFecha = item.pagFecha;
    seleccionado.pagValor = item.pagValor;
    seleccionado.pagNumeroSistema = item.pagPeriodo + "|" + item.pagTipo + "|" + item.pagNumero;

    this.parametrosFormularioPagos = {
      accion: LS.ACCION_CONSULTAR,
      seleccionado: seleccionado
    }
    this.mostrarFormularioPagos = true;
  }

  ejecutarAccion(event) {
    this.inicializarAtajos();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, activar: this.activar });
        break;
      case LS.ACCION_CANCELAR:
        this.mostrarFormularioPagos = false;
        this.parametrosFormularioPagos = null;
        break;
    }
  }

  /******************************************************************************Imagenes de compra **************************************************/
  imagenesCompra() {
    this.estamosEnVistaImagenes = true;
  }

}
