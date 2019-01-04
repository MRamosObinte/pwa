import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ContextMenu } from 'primeng/contextmenu';
import { ListadoProductosComponent } from '../../../inventario/componentes/listado-productos/listado-productos.component';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { NgForm } from '@angular/forms';
import { InvConsumos } from '../../../../entidades/inventario/InvConsumos';
import { InvConsumosDetalle } from '../../../../entidades/inventario/InvConsumosDetalle';
import * as moment from 'moment';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { ConsumoService } from '../../transacciones/consumo/consumo.service';
import { InvListaConsultaConsumosTO } from '../../../../entidadesTO/inventario/InvListaConsultaConsumosTO';
import { ConsumoFormularioService } from './consumo-formulario.service';
import { InvProducto } from '../../../../entidades/inventario/InvProducto';
import { InvConsumosTO } from '../../../../entidadesTO/inventario/InvConsumosTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';

@Component({
  selector: 'app-consumo-formulario',
  templateUrl: './consumo-formulario.component.html'
})
export class ConsumoFormularioComponent implements OnInit {

  public constantes: any = LS;
  public accion: string = null;
  public vistaFormulario = false;
  public vistaDistribucion = false;
  public listadoPiscinaTO: Array<PrdListaPiscinaTO> = new Array();
  public listadoPiscinaPorEmpresaTO: Array<PrdListaPiscinaTO> = new Array();
  public es: any = {}; //Locale Date (Obligatoria)
  public listaBodega: Array<InvListaBodegasTO> = [];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  /**
   * parametros debe incluir: --> accion: (crear, mayorizar, consultar, resaturar, anular)
   *                          --> motivoSeleccionado, seleccionado
   */
  @Input() parametros;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarAccion = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();

  public listaInvConsumosDetalle: Array<InvConsumosDetalle> = new Array();
  public listaInvConsumosDetalleOriginal: Array<InvConsumosDetalle> = new Array();
  public listaInvConsumosDetalleDistribucion: Array<InvConsumosDetalle> = new Array();
  public listaConsumoMotivo: Array<InvConsumosMotivoTO> = [];

  public invConsumos: InvConsumos = new InvConsumos(); // esto pasa como parametro
  public motivoSeleccionado: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  public bodegaSeleccionado: InvListaBodegasTO;
  public detalleSeleccionado: InvConsumosDetalle = new InvConsumosDetalle();
  public invProducto: InvProducto = new InvProducto();

  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = true;
  public empresaExtranjera: boolean = false;
  public activar: boolean = false;
  public fechaActual: Date = new Date();
  public isFechaValido: boolean = false;
  public puedeEditar: boolean = false;
  public parametrosDistribucion: any = {};
  public sisPeriodo: SisPeriodo;
  public titulo: string = "";

  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  //formulario
  @ViewChild("frmConsumoDatos") frmConsumoDatos: NgForm; //debe llamarse como el formulario
  public valoresIniciales: any;
  public detalleInicial: any;

  constructor(
    private consumoService: ConsumoService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private modalService: NgbModal,
    private consumoFormularioService: ConsumoFormularioService,
    public archivoService: ArchivoService,
    private piscinaService: PiscinaService,
    private periodoService: PeriodoService
  ) {
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999999999999999.99',
      minimumValue: '0',
    }
  }

  ngOnInit() {
    this.cargando = true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.accion = this.parametros.accion;
    this.consumoFormularioService.definirAtajosDeTeclado();
    this.invConsumos = new InvConsumos();
    this.obtenerDatosParaCrudConsumos();
  }

  inicializarMotivos(o1: InvConsumosMotivoTO, o2: InvConsumosMotivoTO) {
    if (o1 && o2) {
      return o1.cmCodigo === o2.cmCodigo;
    }
  }


  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmConsumoDatos ? this.frmConsumoDatos.value : null));
      this.detalleInicial = JSON.parse(JSON.stringify(this.listaInvConsumosDetalle ? this.listaInvConsumosDetalle : null));
      this.establecerFocus();
    }, 50);
  }

  establecerFocus() {
    if (!this.motivoSeleccionado) {
      this.enfocarInput("selectMotivo");
    } else if (!this.bodegaSeleccionado) {
      this.enfocarInput("selectBodega");
    } else if (this.accion === LS.ACCION_MAYORIZAR) {
      //this.focusedProducto(0);
    }
  }

  obtenerDatosParaCrudConsumos() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.consumoService.obtenerDatosParaCrudConsumos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaBodegasTO()*/
  despuesDeObtenerDatosParaCrudConsumos(data) {
    this.listaConsumoMotivo = data ? data.listaConsumoMotivo : [];
    this.listaBodega = data ? data.listaBodega : [];
    this.listadoPiscinaPorEmpresaTO = data ? data.piscinasPorEmpresa : [];
    this.invConsumos.consFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaActual);
    this.fechaActual = new Date(data.fechaActual);
    this.despuesDeGetPeriodoPorFecha(data.periodo);
    this.motivoSeleccionado = this.parametros.motivoSeleccionado ? this.parametros.motivoSeleccionado : null; // tengo que seleccionar del padre
    this.actuarSegunAccionDelPadre(this.accion);
  }

  actuarSegunAccionDelPadre(accion) {
    this.invConsumos.consCodigo = this.utilService.generarCodigoAleatorio(LS.KEY_EMPRESA_SELECT, new Date());
    let objetoSeleccionado: InvListaConsultaConsumosTO = this.parametros.seleccionado;//Objeto seleccionado
    switch (accion) {
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_ANULAR:
      case LS.ACCION_RESTAURAR:
        this.titulo = accion + " " + LS.TAG_CONSUMO.toLowerCase() + " N. " + objetoSeleccionado.consNumero;
        this.puedeEditar = false;
        this.iniciarAgGrid();
        this.consultarConsumo(objetoSeleccionado.consNumero);
        break;
      case LS.ACCION_CREAR:
        this.titulo = LS.TAG_REGISTRO + " " + LS.TAG_CONSUMO.toLowerCase();
        this.puedeEditar = true;
        let invVentaDetalle = new InvConsumosDetalle({ detCantidad: 1.00 });
        invVentaDetalle['proCodigoPrincipal'] = "";
        this.listaInvConsumosDetalle.push(invVentaDetalle);
        this.seleccionarBodega();
        this.cargando = false;
        this.iniciarAgGrid();
        this.extraerValoresIniciales();
        break;
      case LS.ACCION_MAYORIZAR:
        this.titulo = accion + " " + LS.TAG_CONSUMO.toLowerCase() + " N. " + objetoSeleccionado.consNumero;
        this.puedeEditar = true;
        this.iniciarAgGrid();
        this.consultarConsumo(objetoSeleccionado.consNumero);
        break;
    }
    this.focusedProducto(0);
  }

  seleccionarBodega() {
    this.bodegaSeleccionado = this.motivoSeleccionado ? this.consumoFormularioService.seleccionarBodega(this.listaBodega, this.motivoSeleccionado.cmBodega) : null;
    this.bodegaSeleccionado ? this.obtenerPiscinasParaConsumoDetalle() : this.limpiarPiscinas();
  }

  consultarConsumo(consnumero) {
    this.cargando = true;
    let comprobante: Array<string> = consnumero.split("|");
    let periodo = comprobante[0].trim();
    let motivo = comprobante[1].trim();
    let numero = comprobante[2].trim();
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: periodo,
      motivo: motivo,
      numero: numero
    }
    this.consumoService.obtenerInvConsumo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerConsumo(data: InvConsumos) {
    this.invConsumos = data;
    if (this.accion === LS.ACCION_MAYORIZAR) {
      this.obtenerPeriodo(this.invConsumos.invConsumosPK.consPeriodo);
    }
    this.invConsumos.consFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.invConsumos.consFecha);
    this.listaInvConsumosDetalle = this.invConsumos.invConsumosDetalleList;
    this.listaInvConsumosDetalleOriginal = this.invConsumos.invConsumosDetalleList ? JSON.parse(JSON.stringify(this.invConsumos.invConsumosDetalleList)) : [];
    this.llenarCombos();
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  llenarCombos() {
    if (this.invConsumos.invBodega) {
      this.bodegaSeleccionado = this.consumoFormularioService.seleccionarBodega(this.listaBodega, this.invConsumos.invBodega.invBodegaPK.bodCodigo);
    }
    this.motivoSeleccionado = this.consumoFormularioService.seleccionarMotivo(this.listaConsumoMotivo, this.invConsumos.invConsumosPK.consMotivo);
    if (this.accion == LS.ACCION_MAYORIZAR) {
      this.bodegaSeleccionado ? this.obtenerPiscinasParaConsumoDetalle() : this.limpiarPiscinas();
    }
  }

  // obtener piscinas
  obtenerPiscinasParaConsumoDetalle() {
    this.limpiarPiscinas();
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.bodegaSeleccionado.codigoCP,
      fecha: moment(this.invConsumos.consFecha).format('YYYY-MM-DD')
    }
    this.piscinaService.listarPiscinaTOBusqueda(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  limpiarPiscinas() {
    this.listadoPiscinaTO = [];
    if (this.gridApi) {
      this.gridApi.forEachNode(function (node) {
        node.data ? node.data.pisNumero = null : null;
      });
      this.refreshGrid();
    }
  }

  despuesDeListarPiscinaTOBusqueda(data) {//todo lo que se necesita para hacer consumos
    this.listadoPiscinaTO = data;
    this.cargando = false;
  }

  cancelarDistribucion() {
    this.vistaDistribucion = !this.vistaDistribucion;
  }

  aceptarDistribucion() {
    if (this.parametrosDistribucion.cantidad > 0 && this.parametrosDistribucion.invProducto && this.parametrosDistribucion.invProducto.invProductoPK.proCodigoPrincipal) {
      if (this.parametrosDistribucion.listaInvConsumosDetalleDistribucion && this.parametrosDistribucion.listaInvConsumosDetalleDistribucion.length > 0) {
        this.listaInvConsumosDetalle = [...this.listaInvConsumosDetalle, ...this.parametrosDistribucion.listaInvConsumosDetalleDistribucion];
        this.gridApi ? this.gridApi.updateRowData({ add: this.parametrosDistribucion.listaInvConsumosDetalleDistribucion }) : null;
        this.refreshGrid();
        this.actualizarFilas();
      }
      this.vistaDistribucion = !this.vistaDistribucion;
      this.invProducto = new InvProducto();
      this.listaInvConsumosDetalleDistribucion = new Array();
    } else {
      if (this.parametrosDistribucion.cantidad <= 0) {
        let element = document.getElementById("cantidad");
        element ? element.focus() : null;
        element ? element.blur() : null;
      }
      this.toastr.warning(LS.MSJ_DATOS_INVALIDOS_PARA_DISTRIBUCION, LS.TAG_AVISO);
    }
  }

  enfocarInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.consumoService.verificarPermiso(accion, this.empresaSeleccionada, mostraMensaje);
  }

  // Aqui guarda el consumo
  insertarConsumo(form: NgForm, estado) {
    if (this.validarAntesDeEnviar(form)) {
      this.invConsumos = this.consumoFormularioService.construirConsumo(estado, this.invConsumos, this.bodegaSeleccionado, this.motivoSeleccionado);
      this.listaInvConsumosDetalle = this.consumoFormularioService.contruirDetalleConsumo(this.invConsumos, this.listaInvConsumosDetalle, this.bodegaSeleccionado);
      this.cargando = true;
      let parametro = {
        invConsumos: { ...this.invConsumos },
        listaInvConsumosDetalle: this.listaInvConsumosDetalle
      }
      this.invConsumos.consFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.invConsumos.consFecha);
      this.consumoService.insertarModificarInvConsumos(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  validarDetalle(): boolean {
    let esValido = true;
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        let cantidadSolicitadaValido = this.consumoService.validarCantidad(node.data) && this.consumoService.validarProducto(node.data);
        !cantidadSolicitadaValido ? esValido = false : null;
        !node.data.pisNumero ? esValido = false : null;
      });
    }
    return esValido;
  }

  despuesDeInsertarModificarInvConsumos(data) {
    let estado: boolean = JSON.parse(JSON.stringify(this.invConsumos.consPendiente));
    this.invConsumos = data.extraInfo.consumo ? data.extraInfo.consumo : this.invConsumos;
    this.invConsumos.consFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.invConsumos.consFecha);
    this.invConsumos.consPendiente = estado;
    try {
      this.cargando = false;
      this.mensajeOk(data.operacionMensaje);
      !this.invConsumos.consPendiente ? this.preguntarImprimirConsumo(data.operacionMensaje) : this.cerrarFormulario();
    } catch (err) {
      this.cargando = false;
      this.mensajeOk(data.operacionMensaje);
    }
  }

  preguntarImprimirConsumo(texto: string) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>",
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.imprimirConsumo();
      } else {//Cierra el formulario
        this.cerrarFormulario();
      }
    });
  }

  cerrarFormulario() {
    let parametro = {
      accion: LS.ACCION_CREADO,
      consResultante: this.consumoFormularioService.construirObjetoParaPonerloEnLaLista(this.invConsumos),
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
  }

  imprimirConsumo() {
    this.cargando = true;
    let consultaconsumo: Array<InvListaConsultaConsumosTO> = new Array();
    consultaconsumo.push(this.consumoFormularioService.construirObjetoParaPonerloEnLaLista(this.invConsumos));
    let invConsumosTOs: Array<InvConsumosTO> = this.consumoFormularioService.formatearResporteConsumos(consultaconsumo, LS.KEY_EMPRESA_SELECT);
    let parametro = {
      invConsumosTOs: invConsumosTOs,
      ordenado: false
    }
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsumoDetalle", parametro, this.empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('consumos' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR ? this.cerrarFormulario() : null;
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  mensajeOk(mensaje: string) {
    this.utilService.generarSwal(this.accion + " " + LS.ACCION_CONSUMO, LS.SWAL_SUCCESS, mensaje);
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    var detalleValidado = this.validarDetalle();
    let listadoDetalle = this.getRowData();
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid && detalleValidado)) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    } else if (listadoDetalle.length === 0) {
      this.toastr.warning(LS.MSJ_INGRESE_DATOS_DETALLE, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    this.cargando = validado;
    return validado;
  }

  distribuirConsumo() {
    if (this.bodegaSeleccionado && this.invConsumos.consFecha) {
      this.vistaDistribucion = true;
      this.parametrosDistribucion = {
        sector: this.bodegaSeleccionado.codigoCP,
        bodega: this.bodegaSeleccionado.bodCodigo,
        fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.invConsumos.consFecha)
      }
    } else {
      this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_BODEGA, LS.TAG_AVISO);
    }
  }

  mayorizarConsumo(form: NgForm, estado) {
    if (this.validarAntesDeEnviar(form)) {
      this.invConsumos = this.consumoFormularioService.construirConsumo(estado, this.invConsumos, this.bodegaSeleccionado, this.motivoSeleccionado);
      this.invConsumos.consCodigo = null;
      this.listaInvConsumosDetalle = this.consumoFormularioService.contruirDetalleConsumo(this.invConsumos, this.listaInvConsumosDetalle, this.bodegaSeleccionado);
      this.invConsumos.invConsumosDetalleList = this.listaInvConsumosDetalleOriginal ? JSON.parse(JSON.stringify(this.listaInvConsumosDetalleOriginal)) : []
      this.cargando = true;
      let parametro = {
        invConsumos: { ...this.invConsumos },
        listaInvConsumosDetalle: this.listaInvConsumosDetalle
      }
      this.invConsumos.consFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.invConsumos.consFecha);
      this.consumoService.insertarModificarInvConsumos(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  anularConsumo() {
    let parametros = {
      title: LS.ACCION_ANULAR + " " + LS.TAG_CONSUMO + " " + this.invConsumos.invConsumosPK.consNumero,
      texto: LS.MSJ_PREGUNTA_ANULAR_CONSUMO,
      type: LS.SWAL_QUESTION,
      confirmButtonText: "<i class='" + LS.ICON_ANULAR + "'></i>  " + LS.ACCION_ANULAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          periodo: this.invConsumos.invConsumosPK.consPeriodo,
          motivo: this.invConsumos.invConsumosPK.consMotivo,
          numero: this.invConsumos.invConsumosPK.consNumero
        }
        this.consumoService.anularConsumo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeAnularConsumo(data) {
    let objetoSeleccionado: InvListaConsultaConsumosTO = this.parametros.seleccionado;
    objetoSeleccionado.consStatus = "ANULADO";
    this.cargando = false;
    let parametro = {
      accion: LS.ACCION_CREADO,
      consResultante: objetoSeleccionado,
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
    this.utilService.generarSwal(LS.TAG_CONSUMO, LS.SWAL_SUCCESS, data.operacionMensaje);
  }

  restaurarConsumo() {
    let parametros = {
      title: LS.ACCION_RESTAURAR + " " + LS.TAG_CONSUMO + " " + this.invConsumos.invConsumosPK.consNumero,
      texto: LS.MSJ_PREGUNTA_ANULAR_CONSUMO,
      type: LS.SWAL_QUESTION,
      confirmButtonText: "<i class='" + LS.ICON_RESTAURAR + "'></i>  " + LS.ACCION_RESTAURAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          periodo: this.invConsumos.invConsumosPK.consPeriodo,
          motivo: this.invConsumos.invConsumosPK.consMotivo,
          numero: this.invConsumos.invConsumosPK.consNumero
        }
        this.consumoService.restaurarConsumo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeRestaurarConsumo(data) {
    let objetoSeleccionado: InvListaConsultaConsumosTO = this.parametros.seleccionado;
    objetoSeleccionado.consStatus = "";
    this.cargando = false;
    let parametro = {
      accion: LS.ACCION_CREADO,
      consResultante: objetoSeleccionado,
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
    this.utilService.generarSwal(LS.TAG_CONSUMO, LS.SWAL_SUCCESS, data.operacionMensaje);
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        break;
      default:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  sePuedeCancelar(): boolean {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmConsumoDatos) && this.utilService.compararObjetos(this.detalleInicial, this.listaInvConsumosDetalle);
  }

  // validar fechas
  validarFechaPorPeriodo() {
    this.isFechaValido = false;
    let parametro = {
      fecha: moment(this.invConsumos.consFecha).format('YYYY-MM-DD'),
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    if (data && !data.perCerrado) {
      this.isFechaValido = true;
    } else {
      this.isFechaValido = false;
    }
    if (this.accion != LS.ACCION_CREAR && this.accion != LS.ACCION_MAYORIZAR) {
      this.isFechaValido = true;
    }
  }

  obtenerPeriodo(codigo) {
    this.cargando = true;
    let parametro = {
      periodo: codigo,
      empresa: LS.KEY_EMPRESA_SELECT
    };
    this.periodoService.obtenerSisPeriodo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerSisPeriodo(data) {
    this.sisPeriodo = data;
    this.cargando = false;
  }

  cambioLaFecha() {
    if (this.accion === LS.ACCION_CREAR) {
      this.invConsumos.consFecha ? this.validarFechaPorPeriodo() : this.isFechaValido = false;
      this.toastr.warning(LS.MSJ_SE_ALETRARAN_CC, LS.TAG_AVISO);
      this.bodegaSeleccionado && this.invConsumos.consFecha ? this.obtenerPiscinasParaConsumoDetalle() : null;
    } else if (this.accion === LS.ACCION_MAYORIZAR) {
      if (this.sisPeriodo && this.invConsumos.consFecha) {
        let consumoFecha: Date = this.invConsumos.consFecha.getTime();
        if (consumoFecha >= this.sisPeriodo.perDesde && consumoFecha <= this.sisPeriodo.perHasta) {
          this.isFechaValido = true;
        } else {
          this.isFechaValido = false;
        }
      } else {
        this.isFechaValido = false;
      }
      this.toastr.warning(LS.MSJ_SE_ALETRARAN_CC, LS.TAG_AVISO);
      this.bodegaSeleccionado && this.invConsumos.consFecha ? this.obtenerPiscinasParaConsumoDetalle() : null;
    } else {
      this.isFechaValido = true;
    }
  }
  //fin validar fechas

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consumoService.generarColumnasConsumo(this);
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      inputLabelCell: InputLabelCellComponent,
      botonAccion: BotonAccionComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimensionarColumnas();
    this.seleccionarPrimerFila();
    this.gridApi.sizeColumnsToFit();
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

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.detalleSeleccionado = fila ? fila.data : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
  }

  mostrarOpciones(event, dataSelected) {
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    if (filasFocusedCell) {
      this.mostrarContextMenu(dataSelected, filasFocusedCell.rowIndex, event);
    }
  }

  mostrarContextMenu(data, rowIndex, event) {
    this.detalleSeleccionado = data;
    if (this.puedeEditar) {
      this.generarOpciones(rowIndex);
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  generarOpciones(rowIndex) {
    let permiso = this.empresaSeleccionada.listaSisPermisoTO.gruCrear && this.puedeEditar;
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', rowIndex) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', rowIndex) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: () => permiso ? this.eliminarFila(rowIndex) : null },
    ];
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  alCambiarValorDeCelda(event) {
    //Si finalizo de editar el codigo de producto, validar el codigo principal
    if (event.colDef.field === "proCodigoPrincipal") {
      this.validarProducto(event.data);
    }
  }

  getRowData(): Array<InvConsumosDetalle> {
    var rowData = [];
    if (this.gridApi) {
      this.gridApi.forEachNode(function (node) {
        rowData.push(node.data);
      });
    }
    return rowData;
  }

  agregarFilaAlFinal(params) {
    let keyCode = params.event.keyCode;
    let index = params.node.rowIndex;
    this.detalleSeleccionado = this.listaInvConsumosDetalle[index];
    if (this.detalleSeleccionado.invProducto.invProductoPK.proCodigoPrincipal && this.utilService.validarKeyBuscar(keyCode) && (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_MAYORIZAR) && index >= 0 && index === (this.listaInvConsumosDetalle.length - 1)) {
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
    this.detalleSeleccionado = this.listaInvConsumosDetalle[index];
    let indexNuevo = ubicacion === 'up' ? index : index + 1;
    var nuevoItem = new InvConsumosDetalle({ detCantidad: 1 });
    nuevoItem.pisNumero = this.detalleSeleccionado.pisNumero;//piscina seleccionada anterior
    this.listaInvConsumosDetalle.splice(indexNuevo, 0, nuevoItem);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexNuevo }) : null;
    !noFocused ? this.focusedProducto(indexNuevo) : this.cantidadFocusAndEditingCell(index);
    this.refreshGrid();
  }

  refrescarOrdenDetalle(event) {
    let indexFinal = event.overIndex;
    let detalle = event.node.data;
    if (this.gridApi) {
      this.gridApi.updateRowData({ remove: [detalle] })
      this.gridApi.updateRowData({ add: [detalle], addIndex: indexFinal });
    }
  }

  eliminarFila(rowIndex) {
    if (this.listaInvConsumosDetalle.length > 1) {
      let index = rowIndex;
      if (this.detalleSeleccionado && this.detalleSeleccionado.detSecuencial > 0) {
        let parametros = {
          title: LS.MSJ_TITULO_ELIMINAR,
          texto: LS.MSJ_PREGUNTA_ELIMINAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI_ACEPTAR,
          cancelButtonText: LS.MSJ_NO_CANCELAR
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona aceptar
            this.quitarElementoDeFila(index);
          }
        });
      } else {
        this.quitarElementoDeFila(index);
      }
    }
  }

  quitarElementoDeFila(index) {
    this.listaInvConsumosDetalle.splice(index, 1);
    this.gridApi ? this.gridApi.updateRowData({ remove: [this.detalleSeleccionado], addIndex: index }) : null;
    this.refreshGrid();
  }

  buscarProducto(params) {
    let keyCode = params.event.keyCode;
    let codigoProductoInput = params.event.target.value;
    let codigoProducto = params.data.invProducto.invProductoPK.proCodigoPrincipal;
    if (this.utilService.validarKeyBuscar(keyCode)) {
      if (this.bodegaSeleccionado && this.bodegaSeleccionado.bodCodigo) {//buscar solo si hay bodega seleccionada
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
              bodega: this.bodegaSeleccionado ? this.bodegaSeleccionado.bodCodigo : null,
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
      } else {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_BODEGA, LS.TOAST_ADVERTENCIA);
      }
    }
  }

  abrirModalProducto(parametroBusquedaProducto, params) {
    let index = params.node.rowIndex;
    const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.isModal = true;
    modalRef.componentInstance.isConsumos = true;
    modalRef.result.then((result) => {
      if (result) {
        let resultado = new InvListaProductosGeneralTO(result);
        params.event.target.value = resultado.proCodigoPrincipal;
        params.data.proCodigoPrincipal = resultado.proCodigoPrincipal;
        params.data.invProducto.invProductoPK.proCodigoPrincipal = resultado.proCodigoPrincipal;
        params.data.invProducto.invProductoPK.proEmpresa = this.empresaSeleccionada.empCodigo;
        params.data.invProducto.proNombre = resultado.proNombre;
        params.data.invProducto.invProductoMedida.medDetalle = resultado.detalleMedida;
        params.data.invProducto.invProductoTipo.tipTipo = resultado.tipTipo;
        this.refreshGrid();
        if (index >= 0 && index === (this.listaInvConsumosDetalle.length - 1)) {
          this.agregarFilaByIndex(index, 'down', true);
        } else {
          this.cantidadFocusAndEditingCell(index);
        }
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

  validarProducto(detalle: InvConsumosDetalle) {
    if (detalle.invProducto.invProductoPK.proCodigoPrincipal !== detalle['proCodigoPrincipal']) {
      this.resetearProducto(detalle);
    }
  }

  resetearProducto(detalle) {
    detalle.proCodigoPrincipal = null;//Se borra la copia
    detalle.invProducto.invProductoPK.proCodigoPrincipal = null;
    detalle.invProducto.invProductoPK.proEmpresa = null;
    detalle.invProducto.proNombre = null;
    detalle.invProducto.invProductoMedida.medDetalle = null;
    this.refreshGrid();
  }
  //#end

  //FOCUS
  focusedProducto(index) {
    setTimeout(() => { this.productoFocusAndEditingCell(index) }, 50);
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
      this.gridApi.ensureIndexVisible(index + 1);
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (!this.sePuedeCancelar()) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

}
