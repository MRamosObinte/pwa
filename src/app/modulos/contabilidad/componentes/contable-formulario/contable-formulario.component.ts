import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConListaContableDetalleTO } from '../../../../entidadesTO/contabilidad/ConListaContableDetalleTO';
import { ItemListaContableTO } from '../../../../entidadesTO/contabilidad/ItemListaContableTO';
import { LS } from '../../../../constantes/app-constants';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { ConCuentas } from '../../../../entidades/contabilidad/ConCuentas';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoPlanCuentasComponent } from '../listado-plan-cuentas/listado-plan-cuentas.component';
import * as moment from 'moment';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import swal from 'sweetalert2';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ListaConContableTO } from '../../../../entidadesTO/contabilidad/ListaConContableTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { VisualizadorImagenesComponent } from '../../../../componentesgenerales/visualizador-imagenes/visualizador-imagenes.component';
import { GridApi } from 'ag-grid';
import { ContableListadoService } from '../../transacciones/contable-listado/contable-listado.service';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { NgForm } from '@angular/forms';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../archivo/tipo-contable/tipo-contable.service';
import { ListaBanCuentaTO } from '../../../../entidadesTO/banco/ListaBanCuentaTO';

@Component({
  selector: 'app-contable-formulario',
  templateUrl: './contable-formulario.component.html',
  styleUrls: ['./contable-formulario.component.css']
})
export class ContableFormularioComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() data;
  @Output() cargandoEstado = new EventEmitter();
  @Output() activarEstado = new EventEmitter();
  @Output() cerrarContabilidadAcciones = new EventEmitter();

  public listaFiltrado: Array<ConListaContableDetalleTO> = [];
  public listaPeriodos: Array<SisPeriodo> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaCuentasDeBanco: Array<ListaBanCuentaTO> = [];

  public objetoContable: ItemListaContableTO = new ItemListaContableTO();
  public conContable: ConContable = new ConContable();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public objetoSeleccionado: ConListaContableDetalleTO = new ConListaContableDetalleTO();
  public tituloForm: string = "";
  public tipoConcepto: string = "";
  public opcionesDetalle: MenuItem[];
  public totalesDebitos: number = 0;
  public totalesCreditos: number = 0;
  public totalesDiferencia: number = 0;
  public fechaMin: Date = null;
  public fechaMax: Date = null;
  public activar: boolean = true;
  public mostrarContable: boolean = false;
  public constantes: object = null;
  public es: object = {};
  public isCompra: boolean = false;
  public objetoAlDesmayorizar: object = null;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //VALIDACIONES
  public formularioCorrecto: boolean = false;
  public detalleValido: boolean = false;
  public fechaValido: boolean = true;
  public isValidoCheques: boolean = false;
  public isValidoCuentas: boolean = false;
  public isValidoDebitosCreditos: boolean = false;
  //
  public listaTipos: Array<ConTipoTO> = [];
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
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
  public configuracionAutoNumeric: AppAutonumeric;
  public rowSelection: string = "single";
  public isCollapsed: boolean = false;
  public estilos: any = {};
  @ViewChild("frmContableDetalle") frmContableDetalle: NgForm;
  public valoresIniciales: any;
  public listaFiltradoInicial: any;

  constructor(
    private utilService: UtilService,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private filasService: FilasResolve,
    private contableService: ContableListadoService,
    private tipoContableService: TipoContableService
  ) {
    this.configuracionAutoNumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '9999999.99',
      minimumValue: '0',
    }
  }

  ngOnInit() {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.obtenerDatosParaCrudContable();
    if (this.data) {
      this.operaciones();
      this.generarOpcionesDetalle();
    }
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 394px)'
    }
    this.inicializarAtajos();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmContableDetalle ? this.frmContableDetalle.value : null));
      this.listaFiltradoInicial = JSON.parse(JSON.stringify(this.listaFiltrado ? this.listaFiltrado : null));
    }, 50);
  }

  //INICIALIZACIONES
  /**Metodo para inicializar el rango(perDesde,perHasta) del período seleccionado dependiendo si es NUEVO,se considera perDesde, desde que se inicio el primer periodo de la empresa y perHasta, el ultimo dia del periodo actual abierto de la empresa, variables en html: fechaMin y fechaMax*/
  inicializarRangoPeriodoSeleccionado() {
    if (this.data.accion === LS.ACCION_NUEVO) {
      this.fechaMin = new Date(this.listaPeriodos[this.listaPeriodos.length - 1].perDesde);
      this.fechaMax = new Date(this.listaPeriodos[0].perHasta);
      this.periodoSeleccionado = new SisPeriodo();
      this.periodoSeleccionado.perDesde = JSON.parse(JSON.stringify(this.fechaMin.getTime()));
      this.periodoSeleccionado.perHasta = JSON.parse(JSON.stringify(this.fechaMax.getTime()));
    } else {
      this.fechaMin = new Date(this.periodoSeleccionado.perDesde);
      this.fechaMax = new Date(this.periodoSeleccionado.perHasta);
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  /**Metodo para inicializar valores en común, variables en html:listaSectores,objetoSeleccionado,activar*/
  inicializarValores() {
    let arrayReferencia = this.conContable.conReferencia ? this.conContable.conReferencia.split('.') : null;
    this.isCompra = arrayReferencia ? (arrayReferencia[1] === 'inv_compras' ? true : false) : false;
    this.listaSectores = this.data.listadoSectores;
    this.listaPeriodos = this.data.listaPeriodos;
    this.objetoSeleccionado = this.listaFiltrado[0];
    this.activar = this.data.activar;
    this.data.accion !== LS.ACCION_NUEVO ? this.generarTotales() : null;
    this.inicializarRangoPeriodoSeleccionado();
    this.cerrarContabilidadAcciones.emit({ mostrarContilidadAcciones: true, objetoEnviar: this.data, contable: null, noIniciarAtajoPadre: true });
    this.cargandoEstado.emit(false);
    this.tipoConcepto = this.objetoContable.tipoSeleccionado.tipTipoPrincipal === LS.LISTA_TIPOS[2] ? LS.TAG_CONCEPTO : LS.TAG_BENEFICIARIO;
    this.mostrarContable = true;
    this.filasTiempo.finalizarContador();
    this.extraerValoresIniciales();
    this.iniciarAgGrid();
    this.inicializarAtajos();
  }

  obtenerDatosParaCrudContable() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.contableService.obtenerDatosParaCrudContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaCrudContable(data) {
    this.listaCuentasDeBanco = data.cuentaBanco;
    this.despuesDeListarTipoContable(data.tipos);
  }

  /** Metodo que lista todos los periodos segun empresa*/
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

  //OPERACIONES
  operaciones() {
    this.filasTiempo.iniciarContador();
    switch (this.data.accion) {
      case LS.ACCION_NUEVO: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_NUEVO, this, true)) {
          this.tituloForm = LS.TITULO_FORM_NUEVO_COMPROBANTE_CONTABLE;
          this.nuevoContable();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.tituloForm = LS.TITULO_FORM_CONSULTA_COMPROBANTE_CONTABLE;
        this.obtenerObjetoItemListaContableTO();
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_MAYORIZAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_MAYORIZAR_COMPROBANTE_CONTABLE;
          this.obtenerContablePorOperacion();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_DESMAYORIZAR, this, true)) {
          this.desmayorizarContable();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
      case LS.ACCION_REVERSAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_REVERSAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_REVERSAR_COMPROBANTE_CONTABLE;
          this.obtenerContablePorOperacion();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
      case LS.ACCION_ANULAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_ANULAR, this, true)) {
          this.tituloForm = LS.TITULO_FORM_ANULAR_COMPROBANTE_CONTABLE;
          this.obtenerContablePorOperacion();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
      case LS.ACCION_RESTAURAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_RESTAURAR, this, true)) {
          this.restaurarContable();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
      case LS.ACCION_DESBLOQUEAR: {
        if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_DESBLOQUEAR, this, true)) {
          this.desbloquerContable();
        } else {
          this.cargandoEstado.emit(false);
        }
        break;
      }
    }
  }

  nuevoContable() {
    this.objetoContable = new ItemListaContableTO();
    this.objetoContable.tipoSeleccionado = this.data.tipoContable;
    this.conContable = new ConContable();
    this.listaFiltrado.push(new ConListaContableDetalleTO());
    this.listaFiltrado[0].sectorSeleccionado = this.data.listadoSectores[0];
    this.tipoSeleccionado = this.data.tipoContable;
    this.listarPiscina(this.listaFiltrado[0]);
    this.inicializarValores();
    this.verificarFechaValida();
    this.extraerValoresIniciales();
  }

  /**Metodo para desmayorizar un contable, si tiene permiso de mayorizar, le mostrará una confirmación caso contrario solo mostrará un aviso que se desmayorizó */
  desmayorizarContable() {
    this.contableService.desmayorizarContable(this, this.obtenerconContablePK());
  }

  despuesDeDesmayorizarContable(respuesta) {
    this.cargandoEstado.emit(false);
    this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
    this.objetoAlDesmayorizar = respuesta.extraInfo;
    if (this.data.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables) {
      this.confirmacionMayorizar(respuesta.extraInfo);
    } else {
      this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
    }
  }

  /**Metodo para restaurar un contable */
  restaurarContable() {
    this.cargandoEstado.emit(true);
    this.contableService.restaurarContable(this, this.obtenerconContablePK());
  }

  despuesDeRestaurarContable(respuesta) {
    this.cargandoEstado.emit(false);
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Metodo para desbloquear un contable */
  desbloquerContable() {
    this.cargandoEstado.emit(true);
    let enviarObjeto = { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|'), usuario: this.auth.getCodigoUser() };
    this.contableService.desbloquerContable(this, enviarObjeto);
  }

  despuesDeDesbloquerContable(respuesta) {
    this.cargandoEstado.emit(false);
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Mayorizar contable */
  mayorizarContable(parametro) {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_MAYORIZAR, this, true)) {
      this.cargandoEstado.emit(true);
      this.contableService.mayorizarContable(this, parametro);
    }
  }

  despuesDeMayorizarContable(respuesta) {
    this.cargandoEstado.emit(false);
    this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    this.data.volverACargar ? this.cerrarDefinitivo(true) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Anular o reversar contable */
  anularReversarContable(parametros) {
    this.contableService.anularReversarContable(this, parametros);
  }

  despuesDeAnularReversarContable(respuesta) {
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Nuevo contable */
  insertarContable(parametros) {
    this.contableService.insertarContable(this, parametros);
  }

  despuesDeInsertarContable(respuesta) {
    this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    this.cerrarDefinitivo(respuesta.extraInfo);
  }

  /**Metodo para obtener el objeto ItemListaContableTO y así visualizar el contable*/
  obtenerObjetoItemListaContableTO() {
    this.api.post("todocompuWS/contabilidadWebController/consultaContable", this.obtenerconContablePK(), LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          this.objetoContable = new ItemListaContableTO(respuesta.extraInfo);
          this.data.listadoSectores = respuesta.extraInfo.listasectorSeleccionado
          this.conContable = this.objetoContable.conContable;
          this.conContable.conFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.objetoContable.conContable.conFecha);
          this.listaFiltrado = this.objetoContable.detalle;
          this.llenarSectorSeleccionado();
          this.periodoSeleccionado = new SisPeriodo(respuesta.extraInfo.periodoSeleccionado);
          this.tipoSeleccionado = this.objetoContable.tipoSeleccionado;
          this.inicializarValores();
          this.cargandoEstado.emit(false);
          this.extraerValoresIniciales();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cerrarDefinitivo(null);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**
   * Método para llenar los combos de los formularios, al iniciar una Mayorización
   *
   * @memberof ContableFormularioComponent
   */
  llenarSectorSeleccionado() {
    for (let i = 0; i < this.listaFiltrado.length; i++) {
      this.listaFiltrado[i].sectorSeleccionado = this.listaFiltrado[i].sectorSeleccionado ? this.data.listadoSectores.find(item => item.secCodigo === this.listaFiltrado[i].sectorSeleccionado.secCodigo) : null;
      this.listaFiltrado[i].piscinaSeleccionada = this.listaFiltrado[i].piscinaSeleccionada ? this.listaFiltrado[i].listapiscinaSeleccionada.find(item => item.pisNumero === this.listaFiltrado[i].piscinaSeleccionada.pisNumero) : null;
    }
  }

  /**Metodo para imprimir el contable*/
  imprimirContable() {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargandoEstado.emit(true);
      let itemContableTO: ListaConContableTO = new ListaConContableTO();
      let listadoConContable: Array<ListaConContableTO> = [];
      itemContableTO.empCodigo = this.data.empresaSeleccionada.empCodigo;
      itemContableTO.perCodigo = this.conContable.conContablePK.conPeriodo;
      itemContableTO.tipCodigo = this.conContable.conContablePK.conTipo;
      itemContableTO.conNumero = this.conContable.conContablePK.conNumero;
      itemContableTO.conFecha = this.utilService.convertirFechaStringDDMMYYYY(JSON.parse(JSON.stringify(this.conContable.conFecha)));
      itemContableTO.conPendiente = this.conContable.conPendiente ? LS.ETIQUETA_PENDIENTE : " ";
      itemContableTO.conAnulado = this.conContable.conAnulado ? LS.ETIQUETA_ANULADO : " ";
      itemContableTO.conReversado = this.conContable.conReversado ? LS.ETIQUETA_REVERSADO : " ";
      itemContableTO.conBloqueado = this.conContable.conBloqueado ? LS.ETIQUETA_BLOQUEADO : " ";
      itemContableTO.conConcepto = this.conContable.conConcepto;
      itemContableTO.conDetalle = this.conContable.conDetalle;
      itemContableTO.conObservaciones = this.conContable.conObservaciones;
      itemContableTO.conReferencia = this.conContable.conReferencia;
      delete itemContableTO.seleccionado;
      listadoConContable.push(itemContableTO);
      let parametros = { ListaConContableTO: listadoConContable };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableDetalle", parametros, this.data.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listadoContables.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_SE_PUEDE_IMPRIMIR_POR_ESTADO, LS.TAG_AVISO);
          }
          this.cargandoEstado.emit(false);
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /**Metodo para ver imagenes cuando es contable de compra */
  verImagenes() {
    this.cargandoEstado.emit(true);
    this.api.post("todocompuWS/inventarioWebController/obtenerAdjuntosCompra", this.obtenerconContablePK(), LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          let listado = respuesta.extraInfo ? respuesta.extraInfo : [];
          let listadoEnviar = [];
          listado.forEach(value => { listadoEnviar.push({ source: value.imagenString, alt: value.adjTipo, title: value.adjTipo }) });
          if (listado.length > 0) {
            const modalRef = this.modalService.open(VisualizadorImagenesComponent, { size: 'lg', backdrop: 'static' });
            modalRef.componentInstance.listaImagenes = listadoEnviar;
          } else {
            this.toastr.warning(LS.MSJ_NO_HAY_IMAGENES, LS.TAG_AVISO);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        this.cargandoEstado.emit(false);
      }).catch(err => this.utilService.handleError(err, this));
  }

  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = !this.isCollapsed ? '405px' : '260px';
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')'
    }
  }
  //LISTADOS
  /** Metodo que lista todos las piscinas segun empresa */
  listarPiscina(item) {
    item.listapiscinaSeleccionada = [];
    item.piscinaSeleccionada = null;
    let parametro = { empresa: this.data.empresaSeleccionada.empCodigo, sector: item.sectorSeleccionado.secCodigo };
    this.api.post("todocompuWS/produccionWebController/getListaPiscinaTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          item.listapiscinaSeleccionada = respuesta.extraInfo;
        } else {
          item.listapiscinaSeleccionada = [];
        }
        this.refreshGrid();
        this.extraerValoresIniciales();
      }).catch(err => this.utilService.handleError(err, this));
  }

  //BUSQUEDAS
  /**Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentas(params) {
    let keyCode = params.event.keyCode;
    let cuentaInput = params.event.target.value;
    let codigoProducto = params.data.conCuentas.conCuentasPK.ctaCodigo;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      params.data.ctaCodigo = cuentaInput;
      let fueBuscado = (cuentaInput && codigoProducto && cuentaInput === codigoProducto);
      if (!fueBuscado) {
        cuentaInput = cuentaInput === '' ? null : cuentaInput;
        cuentaInput = cuentaInput ? cuentaInput.toUpperCase() : null;
        if (cuentaInput) {
          let parametroBusqueda = { empresa: LS.KEY_EMPRESA_SELECT, buscar: cuentaInput, ctaGrupo: null };
          this.abrirModalCuentas(parametroBusqueda, params);
        } else {
          if (keyCode === LS.KEYCODE_TAB) {
            this.gridApi.tabToNextCell();
          } else {
            this.cuentaFocusCell(params.node.rowIndex);
          }
        }
      } else {
        this.gridApi.tabToNextCell();
      }
    }
  }

  abrirModalCuentas(parametroBusqueda, params) {
    let index = params.node.rowIndex;
    const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusqueda;
    modalRef.componentInstance.tamanioEstructura = this.data.tamanioEstructura;
    modalRef.result.then((result) => {
      if (result) {
        params.event.target.value = result ? result.cuentaCodigo : null;
        params.data.conCuentas.conCuentasPK.ctaCodigo = result ? result.cuentaCodigo : null;
        params.data.conCuentas.conCuentasPK.ctaEmpresa = result ? result.empCodigo : null;
        params.data.conCuentas.ctaDetalle = result ? result.cuentaDetalle.trim() : null;
        params.data.conCuentas.usrEmpresa = result ? result.usrInsertaCuenta.trim() : null;
        params.data.ctaCodigo = result ? result.cuentaCodigo : null;
        params.data.ctaDetalle = result ? result.cuentaDetalle.trim() : null;
        params.data.conCuentaVacia = false;
        this.refreshGrid();
        if (index >= 0 && index === (this.listaFiltrado.length - 1)) {
          this.agregarFila('down', false);
        }
        this.documentoFocusCell(index)
      } else {
        params.data.conCuentaVacia = true;
        this.cuentaFocusCell(index);
        this.refreshGrid();
      }
    }, () => {
      params.data.ctaCodigo = '';
      params.data.conCuentaVacia = true;
      this.cuentaFocusCell(index);
      this.refreshGrid();
    });
  }

  //MENU
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
      let listaTemporal = this.listaFiltrado.slice();
      listaTemporal.splice(index, 0, nuevoItem);
      this.listaFiltrado = listaTemporal;
      focused ? this.focusedCuenta(index) : null;
    }
    this.refreshGrid();
  }

  eliminarFila() {
    if (this.listaFiltrado.length > 1) {
      var selected = this.gridApi.getFocusedCell();
      let listaTemporal = this.listaFiltrado.slice();
      listaTemporal.splice(selected.rowIndex, 1);
      this.listaFiltrado = listaTemporal;
      this.refreshGrid();
    }
  }

  //CONFIRMACIONES
  /**Metodo que se ejecuta al dar clic en boton cancelar, si se acepta la confirmación simplemente cerrará la vista de contable y no se realizara ningun cambio*/
  confirmacionCerrarContable() {
    if (this.data.accion === LS.ACCION_NUEVO) {
      if (this.sePuedeCancelar()) {
        this.cerrarDefinitivo(null);
      } else {
        swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_PREGUNTA_CANCELAR, LS.MSJ_PERDERA_TODOS_DATOS_INGRESADOS, LS.SWAL_QUESTION))
          .then((result) => {
            if (result.value) {
              this.cerrarDefinitivo(null);
            }
          });
      }
    } else {
      if (this.data.accion === LS.ACCION_MAYORIZAR) {
        if (this.sePuedeCancelar()) {
          if (this.objetoAlDesmayorizar && this.objetoAlDesmayorizar['conPendiente'] === true) {
            this.cerrarContabilidadAcciones.emit({ mostrarContilidadAcciones: false, objetoEnviar: null, contable: this.objetoAlDesmayorizar });
          }
          this.cerrarDefinitivo(null);
        } else {
          swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_PREGUNTA_CANCELAR, LS.MSJ_PERDERA_TODOS_DATOS_MODIFICADOS, LS.SWAL_QUESTION))
            .then((result) => {
              if (result.value) {
                if (this.objetoAlDesmayorizar) {
                  this.cerrarDefinitivo(this.objetoAlDesmayorizar);
                } else {
                  this.cerrarDefinitivo(null);
                }
              }
            });
        }
      } else {
        this.cerrarDefinitivo(null);
      }
    }
  }

  sePuedeCancelar(): boolean {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmContableDetalle) && this.utilService.compararObjetos(this.listaFiltradoInicial, this.listaFiltrado);
  }

  /**Metodo que se ejecuta cuando se demayoriza un contable y tiene permiso de mayorizar, saldra una confirmacion de mayorizar */
  confirmacionMayorizar(contable) {
    swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
      .then((result) => {
        if (result.value) {
          this.cargandoEstado.emit(true);
          this.data.accion = LS.ACCION_MAYORIZAR;
          this.obtenerObjetoItemListaContableTO();
        }
        if (result.dismiss) {
          this.data.volverACargar ? this.cerrarDefinitivo(false) : this.cerrarDefinitivo(contable);
        }
      });
  }

  //OTROS METODOS
  /**Metodo para obtener el objeto ItemListaContableTO formateado y seteado */
  setearDatosPrincipalesContable(): ItemListaContableTO {
    let itemListaContableTO = new ItemListaContableTO();
    itemListaContableTO.conContable = JSON.parse(JSON.stringify(this.conContable));
    itemListaContableTO.conContable.conContablePK.conEmpresa = LS.KEY_EMPRESA_SELECT;
    itemListaContableTO.conContable.conContablePK.conTipo = this.tipoSeleccionado.tipCodigo;
    itemListaContableTO.detalle = this.utilService.formatearDebitosCreditosStringNumber(JSON.parse(JSON.stringify(this.listaFiltrado)));
    itemListaContableTO.conContable.conFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.conContable.conFecha);
    return itemListaContableTO;
  }

  /**Metodo que se ejecuta al dar clic derecho en el icono de mostrar más y mostrar menos,variable html: activar */
  cambiarEstadoActivar() {
    this.activar = !this.activar;
    this.activarEstado.emit(this.activar);
  }

  /**Metodo que se ejecuta para cerrar definitivamente la vista de contable */
  cerrarDefinitivo(contable) {
    this.listaSectores = [];
    this.listaFiltrado = [];
    this.tituloForm = null;
    this.mostrarContable = false;
    this.cargandoEstado.emit(false);
    this.cerrarContabilidadAcciones.emit({ mostrarContilidadAcciones: false, objetoEnviar: null, contable: contable });
    this.objetoContable = null;
    this.conContable = null;
    this.tipoConcepto = null;
    this.data = null;
  }

  /**Metodo para obtener la cabecera el contable y asi validar, si la accion es MAYORIZAR, debe estar pendiente para poder mostrar el contable, caso contrario (ANULAR,REVERSAR) no debe estar anulado,reversado,bloqueado ni pendiente para mostrarse el contable... si no se cumple con esta condición se mostrará un mensaje personalizado */
  obtenerContablePorOperacion() {
    this.cargandoEstado.emit(true);
    this.api.post("todocompuWS/contabilidadWebController/getConContable", this.obtenerconContablePK(), LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          let contable = respuesta.extraInfo;
          if (this.sePuedeVisualizarContable(contable)) {
            this.obtenerObjetoItemListaContableTO();
          } else {
            this.toastr.warning(LS.MSJ_NO_SE_PUEDE + this.data.accion + LS.MSJ_EL_CONTABLE + contable.conContablePK.conNumero + " " + this.obtenerMensajeError(contable) + " ", LS.TAG_AVISO);
            this.cerrarDefinitivo(null);
          }
          this.extraerValoresIniciales();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          this.cerrarDefinitivo(null);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  /**Metodo para obtener el PK del contable */
  obtenerconContablePK(): object {
    return { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|') };
  }

  /**Metodo para obtener el mensaje personalizado de error */
  obtenerMensajeError(contable): string {
    let status = "." + LS.MSJ_ESTA;
    if (this.data.accion === LS.ACCION_MAYORIZAR) {
      status = contable.conPendiente ? "" : "." + LS.MSJ_NO_ESTA + LS.ETIQUETA_PENDIENTE;
    } else {
      status += contable.conPendiente ? LS.ETIQUETA_PENDIENTE : contable.conBloqueado ? LS.ETIQUETA_BLOQUEADO : contable.conReversado ? LS.ETIQUETA_BLOQUEADO : LS.ETIQUETA_REVERSADO;
    }
    return status;
  }

  /**Metodo para saber si se puede visualizar el contable, si es true, se visualiza caso contrario no se mostrará, para visualizar cuando se se quiere MAYORIZAR, debe estar pendiente. Para visualizar cuando (REVERSAR,ANULAR) no se debe estar anulado,bloqueado,pendiente o reversado */
  sePuedeVisualizarContable(contable): boolean {
    return this.data.accion === LS.ACCION_MAYORIZAR ? contable.conPendiente :
      (!contable.conAnulado && !contable.conBloqueado && !contable.conPendiente && !contable.conReversado);
  }

  /**Metodo para obtener un nuevo detalle, en este caso se crea un ID provisional para diferenciar en la tabla dependiendo del Id y asi no se seleccione varios objetos que tengan las misma informacion, al enviar al servidor este se borra */
  obtenerNuevoDetalle(elementoActual): ConListaContableDetalleTO {
    let detalle = new ConListaContableDetalleTO();
    detalle.sectorSeleccionado = elementoActual.sectorSeleccionado;
    detalle.piscinaSeleccionada = elementoActual.piscinaSeleccionada;
    detalle.listapiscinaSeleccionada = elementoActual.listapiscinaSeleccionada;
    return detalle;
  }

  /**Metodo para verificar que la fecha del contable este en el rango del periodo seleccionado,variable en html:fechaValido */
  verificarFechaValida() {
    this.fechaValido = false;
    if (this.conContable.conFecha) {
      let fechaContable = this.conContable.conFecha.getTime();
      if (this.data.accion === LS.ACCION_MAYORIZAR) {
        /**Mayorizar */
        this.fechaValido = JSON.parse(JSON.stringify(this.periodoSeleccionado.perDesde)) <= fechaContable && fechaContable <= JSON.parse(JSON.stringify(this.periodoSeleccionado.perHasta));
      } else {
        /**Nuevo */
        this.utilService.validarPeriodo({ fecha: this.conContable.conFecha }, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  despuesDeValidarPeriodo(periodo) {
    if (periodo == null) {
      this.fechaValido = false;
    } else {
      this.fechaValido = !periodo.perCerrado;
    }
  }

  /**Metodo para verificar si el cuenta codigo que se ingresa es correcto si no es correcto se limpiara, variable en html: ctaCodigo de cada item en la tabla */
  verificarCuentaCorrecta(item) {
    if (item.ctaCodigo !== item.conCuentas.conCuentasPK.ctaCodigo) {
      item.ctaCodigo = null;
      item.ctaDetalle = null;
      item.conCuentas = new ConCuentas();
      this.refreshGrid();
    }
    this.verificarChequeImprimir(item);
  }

  /**Metodo para verificar si se guarda como pendiente al crear un nuevo contable o al mayorizar un contable */
  verificarGuardarComoPendiente(): boolean {
    let totalDebito = this.utilService.convertirDecimaleFloat(JSON.parse(JSON.stringify(this.totalesDebitos)));
    let totalCredito = this.utilService.convertirDecimaleFloat(JSON.parse(JSON.stringify(this.totalesCreditos)));
    let guardarComoPendiente = (totalDebito !== totalCredito);
    return guardarComoPendiente;
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event']) onresize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

  /** Funciones generales,mostrar ventana emergente cuando teclea f5 o cierra ventana*/
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.data.accion !== LS.ACCION_CONSULTAR) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.contableService.generarColumnas(this); //crea las colunmas - Siempre en un servicio
    this.columnDefsSelected = this.columnDefs.slice(); // define columnas seleccionadas para el combo de seleccion
    this.context = { componentParent: this }; //compartir el contexto padre a la grilla
    this.frameworkComponents = { //componentes adicionales a incrustar en la tabla
      toolTip: TooltipReaderComponent,
      numericCell: NumericCellComponent,
      pinnedCell: PinnedCellComponent
    };
    this.pinnedBottomRowData = [ //creacion del objeto footer
      {
        ctaCodigo: '',
        ctaDetalle: '',
        sectorSeleccionado: '',
        piscinaSeleccionada: '',
        detDocumento: '',
        detDebitos: 0,
        detCreditos: 0
      }
    ];
    this.components = {}; //componentes adicionales
    this.rowClassRules = { //estilos al footer
      "ag-footer-pinned": function (params) {
        return params.node.rowPinned ? true : false;
      }
    };
    this.inicializarAtajos();
  }

  onGridReady(params) {
    this.gridApi = params.api; //inicializa la grilla
    this.gridColumnApi = params.columnApi; //columnas de la grilla
    this.actualizarFilas(); //se debe actualizar las filas para el footer, incluye el tiempo
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit(); //redimensiona las columnas para que se adapten al tamaño de la vista
    this.data.accion === LS.ACCION_NUEVO ? this.focusedCuenta(0) : null; //condicion para enfocar una celda
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
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
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  celdaEditingStopped(params) {
    var colId = params.column.getId();
    if (colId === 'ctaCodigo') {
      this.verificarCuentaCorrecta(params.data);
    }
    if (colId === 'detDocumento') {
      this.verificarChequeImprimir(params.data);
    }
    if (colId === 'detDebitos') {
      this.calcularDebito(params.data);
      this.generarTotales();
    }
    if (colId === 'detCreditos') {
      this.calcularCredito(params.data);
      this.generarTotales();
    }
  }

  validarFilaCompleta(params) {
    let keyCode = params.event.keyCode;
    let index = this.listaFiltrado.indexOf(this.objetoSeleccionado);
    if (this.utilService.validarKeyBuscar(keyCode) && index === (this.listaFiltrado.length - 1)) {
      if (this.objetoSeleccionado.conCuentas.conCuentasPK.ctaCodigo && (this.objetoSeleccionado.detCreditos > 0 || this.objetoSeleccionado.detDebitos > 0)) {
        this.agregarFila('down', true);
        this.cuentaFocusCell(index + 1);
      }
    }
  }

  focusedCuenta(index) {
    setTimeout(() => { this.cuentaFocusCell(index) }, 50);
  }

  cuentaFocusCell(index) {
    this.gridApi.setFocusedCell(index, 'ctaCodigo')
  }

  documentoFocusCell(index) {
    this.gridApi.setFocusedCell(index, 'detDocumento')
  }

  ejecutarMetodoChange(params, value) {
    let data = params.node.data;
    data.sectorSeleccionado = value;
    this.refreshGrid();
    this.listarPiscina(data);
  }

  //DOCUMENTO 
  verificarChequeImprimir(itemEvaluar) {
    itemEvaluar.conChequeImprimir = true;
    this.gridApi ? this.gridApi.updateRowData({ update: [itemEvaluar] }) : null;
    let cuentaBanco = itemEvaluar && itemEvaluar.conCuentas ? this.listaCuentasDeBanco.find(item => item.ctaCuentaContable === itemEvaluar.conCuentas.conCuentasPK.ctaCodigo) : null;
    if (itemEvaluar.detDocumento && cuentaBanco) {
      this.contableService.verificarChequeImprimir(itemEvaluar, this);
    } else {
      itemEvaluar.conChequeImprimir = false;
      this.gridApi ? this.gridApi.updateRowData({ update: [itemEvaluar] }) : null;
      this.validarDocumentosRepetido();
    }
  }

  despuesDeVerificarChequeImprimir(respuesta, itemEvaluar) {
    itemEvaluar.conChequeImprimir = respuesta ? false : true;
    this.objetoSeleccionado.conChequeImprimir = respuesta ? false : true;
    this.gridApi ? this.gridApi.updateRowData({ update: [itemEvaluar] }) : null;
    this.validarDocumentosRepetido();
  }

  /**ConEstado = false (cheque imprimir),conChequeRepetido = true.. ambos pintan rojo */
  validarDocumentosRepetido() {
    this.listaFiltrado.forEach(item => {
      let cuentaBanco = item && item.conCuentas ? this.listaCuentasDeBanco.find(item2 => item2.ctaCuentaContable === item.conCuentas.conCuentasPK.ctaCodigo) : null;
      let arrayRepetidos = this.listaFiltrado.filter(value => (value.detDocumento && item.detDocumento && value !== item && value.detDocumento.trim() === item.detDocumento.trim() && cuentaBanco));
      item.conChequeRepetido = (arrayRepetidos.length > 0);
    });
    this.refreshGrid();
  }

  //DEBITOS Y CREDITO 
  calcularDebito(ItemContable) {
    if (ItemContable.detDebitos > 0) {
      ItemContable.debidoCredito = "D";
      ItemContable.detCreditos = 0;
    }
  }

  /**Metodo que se ejecuta al cambiar de valor al input de crédito del ítem */
  calcularCredito(ItemContable) {
    if (ItemContable.detCreditos > 0) {
      ItemContable.debidoCredito = "C";
      ItemContable.detDebitos = 0;
    }
  }

  /**Metodo para calcular los totales de creditos y debitos del contable */
  generarTotales() {
    let totalesDebitos = 0;
    let totalesCreditos = 0;
    this.listaFiltrado.forEach(value => {
      let debitos = JSON.parse(JSON.stringify(this.utilService.convertirDecimaleFloat(value.detDebitos)));
      let creditos = JSON.parse(JSON.stringify(this.utilService.convertirDecimaleFloat(value.detCreditos)));
      if (debitos === 0 && creditos === 0) {
        //Error
        value.conEstadoDebitoCreditoValido = false;
      } else {
        //Correcto 
        totalesDebitos = totalesDebitos + debitos;
        totalesCreditos = totalesCreditos + creditos;
        value.conEstadoDebitoCreditoValido = true;
      }
    });
    this.totalesDebitos = Math.round(totalesDebitos * 100) / 100;
    this.totalesCreditos = Math.round(totalesCreditos * 100) / 100;
    this.totalesDiferencia = Math.abs(this.totalesDebitos - this.totalesCreditos);
    this.refreshGrid();
  }

  //METODOS DE GUARDAR
  verificarAntesGuardar(frmContableDetalle) {
    let contadorErroresCuenta = 0;
    let contadorErroresDebitosCredito00 = 0;
    let contadorErroresCheques = 0;

    this.listaFiltrado.forEach(value => {
      if (!value.conCuentas.conCuentasPK.ctaCodigo) {
        value.conCuentaVacia = true;
        contadorErroresCuenta++;
      }
      if (value.detDebitos === 0 && value.detCreditos === 0) {
        value.conEstadoDebitoCreditoValido = false;
        contadorErroresDebitosCredito00++;
      }
      if (value.conChequeRepetido || value.conChequeImprimir) {
        contadorErroresCheques++;
      }
    });
    this.isValidoDebitosCreditos = (contadorErroresDebitosCredito00 === 0);
    this.isValidoCheques = (contadorErroresCheques === 0);
    this.isValidoCuentas = (contadorErroresCuenta === 0);
    if (this.conContable.conConcepto || this.conContable.conDetalle || this.conContable.conObservaciones) {
      this.detalleValido = true;
    } else {
      this.detalleValido = false;
    }
    this.formularioCorrecto = this.utilService.establecerFormularioTocado(frmContableDetalle);
    this.refreshGrid();
  }

  mensajesErrores() {
    if (!this.isValidoCheques || !this.fechaValido || !this.isValidoDebitosCreditos || !this.isValidoCuentas) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
    }
    if (this.listaFiltrado.length < 2) {
      this.toastr.warning(LS.MSJ_INGRESAR_2_FILAS, LS.TAG_AVISO)
    }
    if (!this.detalleValido) {
      this.toastr.warning(LS.MSJ_INGRESAR_AL_MENOS_CONCEPTO_DETALLE_OBSERVACION, LS.TAG_AVISO)
    }
  }

  sePuedeGuardar(): boolean {
    return this.isValidoCuentas && this.isValidoCheques && this.isValidoDebitosCreditos && this.fechaValido && this.listaFiltrado.length >= 2 && this.detalleValido;
  }

  /**Metodo que se ejecuta antes de guardar un nuevo contable o mayorizar un contable*/
  verificarSiGuardarComoPendiente(form) {
    if ((this.data.accion === LS.ACCION_NUEVO && this.contableService.verificarPermisoFORMULARIO(LS.ACCION_NUEVO, this, true)) || (this.data.accion === LS.ACCION_MAYORIZAR && this.contableService.verificarPermisoFORMULARIO(LS.ACCION_MAYORIZAR, this, true))) {
      this.verificarAntesGuardar(form);
      if (this.sePuedeGuardar()) {
        let itemListaContableTO = this.setearDatosPrincipalesContable();
        if (this.verificarGuardarComoPendiente()) {
          swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_PREGUNTA_GUARDAR, LS.MSJ_CONTABLE_TIENE_DIFERENCIAS_DEBITO + this.totalesDebitos.toFixed(2) + LS.MSJ_Y_CREDITO + this.totalesCreditos.toFixed(2) + LS.MSJ_DESEA_GUARDAR_CONTABLE_COMO_PENDIENTE, LS.SWAL_QUESTION))
            .then((result) => {
              if (result.value) {
                itemListaContableTO.conContable.conPendiente = true;
                this.data.accion === LS.ACCION_NUEVO ? this.guardarNuevoContable(itemListaContableTO) : null;
                this.data.accion === LS.ACCION_MAYORIZAR ? this.guardarMayorizarContable(itemListaContableTO) : null;
              }
            });
        } else {
          itemListaContableTO.conContable.conPendiente = false;
          this.data.accion === LS.ACCION_NUEVO ? this.guardarNuevoContable(itemListaContableTO) : null;
          this.data.accion === LS.ACCION_MAYORIZAR ? this.guardarMayorizarContable(itemListaContableTO) : null;
        }
      } else {
        this.mensajesErrores();
      }
    }
  }

  /**Metodo para guardar un nuevo contable */
  guardarNuevoContable(itemListaContableTO) {
    this.cargandoEstado.emit(true);
    itemListaContableTO.conContable.conCodigo = this.utilService.generarCodigoAleatorio(LS.KEY_EMPRESA_SELECT, new Date());
    this.insertarContable({ itemListaContableTO: itemListaContableTO });
  }

  /**Metodo para mayorizar un contable */
  guardarMayorizarContable(itemListaContableTO) {
    this.cargandoEstado.emit(true);
    this.mayorizarContable({ itemListaContableTO: itemListaContableTO });
  }

  /**Metodo para guardar un nuevo contable como PENDIENTE */
  guardarNuevoContablePendiente(form) {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_NUEVO, this, true)) {
      this.verificarAntesGuardar(form);
      if (this.sePuedeGuardar()) {
        this.cargandoEstado.emit(true);
        let itemListaContableTO = this.setearDatosPrincipalesContable();
        itemListaContableTO.conContable.conCodigo = this.utilService.generarCodigoAleatorio(LS.KEY_EMPRESA_SELECT, new Date());
        itemListaContableTO.conContable.conPendiente = true;
        this.insertarContable({ itemListaContableTO: itemListaContableTO });
      } else {
        this.mensajesErrores();
      }
    }
  }

  /**Metodo para mayorizar un contable como PENDIENTE */
  guardarMayorizarPendiente(form) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmContableDetalle)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.cerrarDefinitivo(false)
    } else {
      if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_MAYORIZAR, this, true)) {
        this.verificarAntesGuardar(form);
        if (this.sePuedeGuardar()) {
          this.cargandoEstado.emit(true);
          let itemListaContableTO = this.setearDatosPrincipalesContable();
          itemListaContableTO.conContable.conPendiente = true;
          this.mayorizarContable({ itemListaContableTO: itemListaContableTO });
        } else {
          this.mensajesErrores();
        }
      }
    }
  }

  /**Metodo para anular o reversar un contable */
  guardarAnularReversar() {
    if (this.contableService.verificarPermisoFORMULARIO(LS.ACCION_ANULAR, this, true)) {
      this.cargandoEstado.emit(true);
      let parametros = { conContablePK: this.utilService.obtenerConContablePK(this.data.contable, LS.KEY_EMPRESA_SELECT, '|'), anularReversar: this.data.accion === LS.ACCION_ANULAR ? true : false };
      this.anularReversarContable(parametros);
    }
  }
}
