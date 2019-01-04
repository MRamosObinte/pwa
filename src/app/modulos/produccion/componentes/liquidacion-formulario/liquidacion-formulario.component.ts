import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgForm } from '@angular/forms';
import { GridApi } from 'ag-grid';
import * as moment from 'moment';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { NgbModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PrdLiquidacionDetalle } from '../../../../entidades/produccion/PrdLiquidacionDetalle';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { LiquidacionPescaService } from '../../transacciones/liquidacion-pesca/liquidacion-pesca.service';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { PrdLiquidacion } from '../../../../entidades/produccion/PrdLiquidacion';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { PrdTalla } from '../../../../entidades/produccion/PrdTalla';
import { PrdProducto } from '../../../../entidades/produccion/PrdProducto';
import { PrdLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdLiquidacionMotivoTO';
import { PrdPiscinaTO } from '../../../../entidadesTO/Produccion/PrdPiscinaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ToastrService } from 'ngx-toastr';
import { PrdCorrida } from '../../../../entidades/produccion/PrdCorrida';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ListaLiquidacionTO } from '../../../../entidadesTO/Produccion/ListaLiquidacionTO';

@Component({
  selector: 'app-liquidacion-formulario',
  templateUrl: './liquidacion-formulario.component.html',
  styleUrls: ['./liquidacion-formulario.component.css']
})
export class LiquidacionFormularioComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() data;
  @Input() empresaSeleccionada;
  @Output() cargandoEstado = new EventEmitter();
  @Output() activarEstado = new EventEmitter();
  @Output() cerrarFormularioAcciones = new EventEmitter();
  @Output() formularioCargadoCompletamente = new EventEmitter();
  public prdLiquidacion: PrdLiquidacion = new PrdLiquidacion();
  public prdLiquidacionCopia: PrdLiquidacion = new PrdLiquidacion();
  public listaTalla: Array<PrdTalla> = [];
  public listaProductos: Array<PrdProducto> = [];
  public listaMotivos: Array<PrdLiquidacionMotivoTO> = [];
  public listaCorridas: Array<PrdCorrida> = [];
  public listaDetalle: Array<PrdLiquidacionDetalle> = [];

  public objetoSeleccionado: PrdLiquidacionDetalle = new PrdLiquidacionDetalle();
  public motivoSeleccionado: PrdLiquidacionMotivoTO = new PrdLiquidacionMotivoTO();
  public secSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public piscSeleccionada: PrdPiscinaTO = new PrdPiscinaTO();
  public corridaSeleccionada: PrdCorrida = new PrdCorrida();

  public tituloForm: string = "";
  public constantes: object = LS;
  public accion: string = null;
  public es: object = {};
  public fecha: any;
  public estilos: {}
  public screamXS: boolean = true;
  public activarFormulario: boolean = false;
  public collapseDatos: boolean = false;
  public mostrarFormularioLiquidacion: boolean = false;
  public isPendiente: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  public configAutonumeric6: AppAutonumeric;
  public pinnedBottomRowData;
  //Cliente
  public cliente: InvFunListadoClientesTO = new InvFunListadoClientesTO();
  public clienteCodigo: string = null;
  //Totales
  public total: number = 0;
  public cantidades: number = 0;
  public totalRendimiento: number = 0;
  //Validaciones
  public isValidoLbsBasura: boolean = true;
  public isValidoColasProcesadas: boolean = true;
  public isValidoColas: boolean = true;
  public isLoteValido: boolean = true;
  public loteCopia: string = null;
  public lote: string = null;
  //Fechas
  public fechaDesde: any = new Date();
  public fechaHasta: any = new Date();
  public fechaInicioCorrida: Date;
  public fechaFinCorrida: Date;
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public rowSelection: string = "single";
  @ViewChild("frmLiquidacionPesca") frmLiquidacionPesca: NgForm;
  public valoresIniciales: any;
  public listaInicial: any;
  //
  public liquidacionSeleccionada: ListaLiquidacionTO = new ListaLiquidacionTO;

  constructor(
    private utilService: UtilService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private liquidacionPescaService: LiquidacionPescaService,
    private toastr: ToastrService,
    private archivoService: ArchivoService
  ) {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.estilos = { 'width': '100%', 'height': 'calc(100vh - 550px)' }
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999.99',
      minimumValue: '0',
    }
    this.configAutonumeric6 = {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '9999999999.999999',
      minimumValue: '0'
    }
  }

  ngOnInit() {
    this.inicializarAtajos();
    this.iniciarAgGrid();
    if (this.data) {
      this.listaMotivos = this.data.listaMotivos;
      this.piscSeleccionada = this.data.piscinaSeleccionada;
      this.secSeleccionado = this.data.sectorSeleccionado;
      this.liquidacionSeleccionada = this.data.seleccionado;
      this.accion = this.data.accion;
      this.tituloForm = this.data.titulo;
      this.obtenerDatosLiquidacionPesca();
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirLiquidacionPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarLiquidacionPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarLiquidacionPesca') as HTMLElement;
      element ? element.focus() : null;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarLiquidacionPesca') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  inicializarFormulario() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmLiquidacionPesca ? this.frmLiquidacionPesca.value : null));
      this.listaInicial = JSON.parse(JSON.stringify(this.listaDetalle ? this.listaDetalle : null));
    }, 50);
  }

  inicializarCorrida() {
    if (this.prdLiquidacion && this.prdLiquidacion.prdCorrida && this.prdLiquidacion.prdCorrida.prdCorridaPK) {
      this.corridaSeleccionada = this.corridaSeleccionada && this.corridaSeleccionada.prdCorridaPK && this.corridaSeleccionada.prdCorridaPK.corNumero ?
        this.listaCorridas.find(item => item.prdCorridaPK.corNumero === this.prdLiquidacion.prdCorrida.prdCorridaPK.corNumero
          && item.prdCorridaPK.corPiscina === this.prdLiquidacion.prdCorrida.prdCorridaPK.corPiscina) : null;
    } else {
      this.corridaSeleccionada = null
    }
  }

  inicializarMotivo() {
    if (this.prdLiquidacion.prdLiquidacionPK && this.prdLiquidacion.prdLiquidacionPK.liqMotivo) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.prdLiquidacionMotivoPK && this.motivoSeleccionado.prdLiquidacionMotivoPK.lmCodigo ?
        this.listaMotivos.find(item => item.prdLiquidacionMotivoPK.lmCodigo === this.prdLiquidacion.prdLiquidacionPK.liqMotivo) : this.listaMotivos[0];
    } else {
      this.motivoSeleccionado = this.listaMotivos[0];
    }
  }

  inicializarCorridas(o1: PrdCorrida, o2: PrdCorrida) {
    if (o1 && o2) {
      return o1.prdCorridaPK.corNumero === o2.prdCorridaPK.corNumero;
    }
  }

  inicializarCliente() {
    this.cliente = new InvFunListadoClientesTO();
    this.cliente.cliCodigo = this.prdLiquidacion.invCliente.invClientePK.cliCodigo;
    this.cliente.cliNombre = this.prdLiquidacion.invCliente.cliNombreComercial;
    this.cliente.cliRazonSocial = this.prdLiquidacion.invCliente.cliRazonSocial;
    this.clienteCodigo = this.cliente.cliCodigo;
  }

  inicializarFechas() {
    this.fechaInicioCorrida = null;
    this.fechaFinCorrida = null;
    this.fechaDesde = null;
    this.fechaHasta = null;
    if (this.corridaSeleccionada) {
      this.fechaInicioCorrida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
      this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
      if (this.corridaSeleccionada.corFechaHasta) {
        this.fechaFinCorrida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaHasta);
        this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaHasta);
      } else {
        this.fechaHasta = null;
        this.fechaFinCorrida = null;
      }
    }
  }

  cambiarActivar() {
    this.activarFormulario = !this.activarFormulario;
    this.activarEstado.emit(this.activarFormulario);
  }

  collapse() {
    this.collapseDatos = !this.collapseDatos;
    let tamanio = this.collapseDatos ? '420px' : '550px';
    this.estilos = {
      'width': '100%',
      'height': "calc(100vh - " + tamanio + ")"
    }
  }

  refrescarDetalle() {
    let index = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      data.detOrden = index;
      index = index + 1;
    });
  }

  //Antes de guardar
  validarDetalle(): boolean {
    let index = 0;
    let detalleValido: boolean = false;
    let cantError = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      data.detOrden = index;
      if (!data.prdLiquidacionProducto || !data.prdLiquidacionTalla || data.detLibras <= 0 || data.detPrecio <= 0) {
        cantError++;
      }
      index = index + 1;
    });

    if (cantError === 0) {
      detalleValido = true;
    }

    return detalleValido;
  }

  puedeGuardar(form: NgForm): boolean {
    let puedeGuardar: boolean = false;
    let detalleValido: boolean = false;
    let datosGeneralesValido: boolean = false;
    let formularioValido: boolean = false;

    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    formularioValido = (formularioTocado && form && form.valid) ? true : false;
    datosGeneralesValido = (this.isLoteValido && this.isValidoColas && this.isValidoColasProcesadas && this.isValidoLbsBasura) ? true : false;
    detalleValido = this.validarDetalle();

    if (!detalleValido || !datosGeneralesValido || !formularioValido) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
    } else {
      puedeGuardar = true;
    }

    return puedeGuardar;
  }

  //Validaciones
  validarLote() {
    this.cargandoEstado.emit(true);
    if (this.lote !== this.prdLiquidacion.liqLote && this.prdLiquidacion.liqLote) {
      this.isLoteValido = false;
      if (this.accion === LS.ACCION_MAYORIZAR && this.prdLiquidacion.liqLote === this.loteCopia) {
        this.isLoteValido = true;
      }
      if (!this.isLoteValido) {
        this.liquidacionPescaService.buscaObjLiquidacionPorLote({ liqEmpresa: this.empresaSeleccionada.empCodigo, liqLote: this.prdLiquidacion.liqLote }, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.cargandoEstado.emit(false);
      }
    } else {
      //this.isLoteValido = true;
      this.cargandoEstado.emit(false);
    }
  }

  //si no trae , entonces no se ha creado el lote aun por tan isLoteValido es true
  despuesDeBuscaObjLiquidacionPorLote(data) {
    if (!data) {
      this.isLoteValido = true;
    } else {
      this.toastr.warning("Ya existe el lote: " + this.prdLiquidacion.liqLote, LS.MSJ_TITULO_INVALIDOS);
    }
    this.lote = this.prdLiquidacion.liqLote;
    this.cargandoEstado.emit(false);
  }

  /**Valiacion lb col proc <= lb cola <= lb netas */
  validacionDeLbColasLbColProcLbNetas(tipoValidacion) {
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasCola)) === '') {
      this.prdLiquidacion.liqLibrasCola = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasColaProcesadas)) === '') {
      this.prdLiquidacion.liqLibrasColaProcesadas = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasNetas)) === '') {
      this.prdLiquidacion.liqLibrasNetas = 0;
    }
    var librasNetas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasNetas);
    var librasColas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasCola);
    var librasColaProcesadas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasColaProcesadas);
    this.isValidoColasProcesadas = librasColaProcesadas <= librasColas;
    this.isValidoColas = librasColas <= librasNetas;
    if (this.isValidoColas) {
      this.prdLiquidacion.liqLibrasEntero = librasNetas - librasColas;
    } else {
      if (tipoValidacion === 'COLA') {
        this.toastr.warning(LS.MSJE_LB_COLAS_NO_MAYOR_LB_NETAS, LS.MSJ_TITULO_INVALIDOS);
      }
    }
    if (!this.isValidoColasProcesadas) {
      this.toastr.warning(LS.MSJE_LB_COLAS_PROCESADAS_NO_MAYOR_LB_COLAS, LS.MSJ_TITULO_INVALIDOS);
    } else {
      if (this.isValidoColas) {
        this.calcularLibrasNetas();
      }
    }
  }

  validacionLibrasBasuraLibrasRecibidas() {
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasBasura)) === '') {
      this.prdLiquidacion.liqLibrasBasura = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasRecibidas)) === '') {
      this.prdLiquidacion.liqLibrasRecibidas = 0;
    }
    this.isValidoLbsBasura = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasBasura) <= this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasRecibidas);
    if (!this.isValidoLbsBasura) {
      this.toastr.warning(LS.MSJE_LB_COLAS_BASURA_NO_MAYOR_LB_RECIBIDAS, LS.MSJ_TITULO_INVALIDOS);
    } else {
      this.calcularLibrasNetas();
    }
  }

  //Calculos
  calcularLibrasNetas() {
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasCola)) === '') {
      this.prdLiquidacion.liqLibrasCola = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasBasura)) === '') {
      this.prdLiquidacion.liqLibrasBasura = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasRecibidas)) === '') {
      this.prdLiquidacion.liqLibrasRecibidas = 0;
    }
    var librasRecibidas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasRecibidas);
    var librasBasura = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasBasura);
    var librasColas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasCola);
    this.prdLiquidacion.liqLibrasNetas = librasRecibidas - librasBasura;
    if (librasColas === 0) {
      this.prdLiquidacion.liqLibrasEntero = this.prdLiquidacion.liqLibrasNetas;
    } else {
      this.calcularLibrasEntero();
    }
  }

  calcularLibrasEntero() {
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasNetas)) === '') {
      this.prdLiquidacion.liqLibrasNetas = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdLiquidacion.liqLibrasCola)) === '') {
      this.prdLiquidacion.liqLibrasCola = 0;
    }
    var librasNetas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasNetas);
    var librasColas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasCola);
    this.isValidoColas = librasColas <= librasNetas;
    if (this.isValidoColas) {
      this.prdLiquidacion.liqLibrasEntero = librasNetas - librasColas;
    } else {
      this.toastr.warning(LS.MSJE_LB_COLAS_NO_MAYOR_LB_NETAS, LS.MSJ_TITULO_INVALIDOS);
    }
    this.calcularRendimiento();
  }

  generarTotales(calcularTotal?) {
    let index = 0;
    let cantidades = 0;
    let totales = 0;

    this.gridApi.forEachNode((rowNode) => {
      let value = rowNode.data;
      cantidades += JSON.parse(JSON.stringify(this.utilService.convertirDecimaleFloat(value.detLibras)));
      calcularTotal ? value.prdTotal = JSON.parse(JSON.stringify(this.utilService.convertirDecimaleFloat(value.detLibras) * this.utilService.convertirDecimaleFloat(value.detPrecio))) : null;
      totales += value.prdTotal;
      value.detOrden = index;
      index = index + 1;
    });
    this.total = totales;
    this.cantidades = cantidades;
    this.refreshGrid();
  }

  multiplicarPrecioCantidad(data: PrdLiquidacionDetalle) {
    data.prdTotal = data.detPrecio * data.detLibras;
    this.gridApi.updateRowData({ update: [data] });
    this.generarTotales();
  }

  totalEntreCantidad(data: PrdLiquidacionDetalle) {
    if (data.detLibras > 0) {
      data.detPrecio = data.prdTotal / data.detLibras;
    } else {
      data.detPrecio = 0;
    }
    this.refreshGrid();
    this.generarTotales();
  }

  calcularRendimiento() {
    if (!this.prdLiquidacion.liqLibrasEnviadas) {
      this.prdLiquidacion.liqLibrasEnviadas = 0;
    }
    if (!this.prdLiquidacion.liqLibrasEntero) {
      this.prdLiquidacion.liqLibrasEntero = 0;
    }
    var librasEnteras = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasEntero);
    var librasEnviadas = this.utilService.convertirDecimaleFloat(this.prdLiquidacion.liqLibrasEnviadas);
    if (librasEnviadas === 0) {
      this.totalRendimiento = 0;
    } else {
      let porcentaje = (librasEnteras / librasEnviadas) * 100;
      this.totalRendimiento = this.utilService.matRound2(porcentaje);
    }
    this.refreshGrid();
  }

  alCambiarValorDeCelda(event) {
    if (event.colDef.field === "detLibras" || event.colDef.field === "detPrecio") {
      this.multiplicarPrecioCantidad(event.data);
    }
    if (event.colDef.field === "prdTotal") {
      this.totalEntreCantidad(event.data);
    }
  }

  //Operaciones
  obtenerDatosLiquidacionPesca() {
    let paramatros = {
      empresa: this.empresaSeleccionada.empCodigo,
      piscina: this.piscSeleccionada.pisNumero,
      sector: this.secSeleccionado.secCodigo
    }
    this.liquidacionPescaService.obtenerDatosLiquidacionPesca(paramatros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosLiquidacionPesca(data) {
    if (data) {
      this.listaProductos = data.listadoProductos;
      this.listaTalla = data.listadoTallas;
      this.listaCorridas = data.listadoCorridas;
      if (this.listaProductos.length === 0 || this.listaTalla.length === 0 || this.listaCorridas.length === 0) {
        this.toastr.warning(LS.MSJE_NO_HAY_PRODUCTOS_CORRIDAS_TALLAS_CREADAS, LS.MSJ_TITULO_INVALIDOS);
        this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
      } else {
        if (this.accion !== LS.ACCION_CREAR) {
          this.consultarLiquidacion();
        } else {
          this.corridaSeleccionada = this.listaCorridas[0];
          this.inicializarFechas();
          this.fechaDesde = this.fechaDesde;
          this.motivoSeleccionado = this.listaMotivos[0];
          this.prdLiquidacion = new PrdLiquidacion();
          let detalle = new PrdLiquidacionDetalle();
          detalle.prdLiquidacionProducto = this.listaProductos[0];
          detalle.prdLiquidacionTalla = this.listaTalla[0];
          this.listaDetalle.push(detalle);
          this.iniciarAgGrid();
          this.mostrarFormularioLiquidacion = true;
          this.formularioCargadoCompletamente.emit(true);
          this.cargandoEstado.emit(false);
          this.focusedCliente();
          this.inicializarFormulario();
        }
      }
    }
  }

  //Consultar liquidación pesca
  consultarLiquidacion() {
    let parametro = { liquidacionPK: this.data.pk }
    this.liquidacionPescaService.consultarLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeConsultarLiquidacion(data) {
    if (data) {
      this.prdLiquidacion = data;
      this.listaDetalle = JSON.parse(JSON.stringify(this.prdLiquidacion.prdLiquidacionDetalleList));
      this.loteCopia = this.prdLiquidacion.liqLote;
      this.lote = this.prdLiquidacion.liqLote;
      this.corridaSeleccionada = this.prdLiquidacion.prdCorrida;
      this.inicializarCorrida();
      this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.prdLiquidacion.liqFecha);
      this.inicializarMotivo();
      this.inicializarCliente();
      this.iniciarAgGrid();
      this.calcularRendimiento();
      this.mostrarFormularioLiquidacion = true;
      this.formularioCargadoCompletamente.emit(true);
      this.inicializarFormulario();
    } else {
      this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
    }
    this.cargandoEstado.emit(false);
  }

  //guardar liquidación pesca
  insertarLiquidacionPesca(form: NgForm, pendiente?) {
    this.isPendiente = pendiente;
    this.cargandoEstado.emit(true);
    let objetoEnviar = { correcto: false, mensaje: "", prdLiquidacion: null, prdLiquidacionDetalleList: [] };
    if (this.puedeGuardar(form)) {
      let copiaLiquidacionPesca: PrdLiquidacion = JSON.parse(JSON.stringify(this.prdLiquidacion));
      objetoEnviar = this.liquidacionPescaService.formatearDetalleParaEnviar(copiaLiquidacionPesca, this.listaDetalle, this);
      if (objetoEnviar.correcto) {
        pendiente ? objetoEnviar.prdLiquidacion.liqPendiente = true : null;
        let paramatros = {
          prdLiquidacion: objetoEnviar.prdLiquidacion,
          listaPrdLiquidacionDetalle: objetoEnviar.prdLiquidacionDetalleList
        }
        this.prdLiquidacionCopia = objetoEnviar.prdLiquidacion;
        this.liquidacionPescaService.insertarModificarLiquidacion(paramatros, this, this.empresaSeleccionada.empCodigo);
      } else {
        this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, objetoEnviar.mensaje, LS.ICON_ERROR_SWAL, LS.SWAL_OK);
        this.cargandoEstado.emit(false);
      }
    } else {
      this.cargandoEstado.emit(false);
    }
  }

  despuesDeInsertarModificarLiquidacion(data) {
    this.cargandoEstado.emit(false);
    if (data) {
      this.prdLiquidacionCopia.liqPendiente = this.isPendiente;
      this.prdLiquidacionCopia.prdLiquidacionPK.liqNumero = data.extraInfo.map.liquidacion.prdLiquidacionPK.liqNumero;
      this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CREADO, liquidacion: this.prdLiquidacionCopia });
      this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    }
  }

  //Anular o restaurar liquidacion pesca
  anularLiquidacionPesca() {
    if (this.liquidacionPescaService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ANULAR_LIQUIDACION_PESCA,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ANULAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargandoEstado.emit(true);
          this.prdLiquidacion.liqAnulado = true;
          let parametro = { liquidacionPK: this.data.pk, anularRestaurar: true }
          this.liquidacionPescaService.anularRestaurarLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
        }
      });
    }
  }

  restaurarLiquidacionPesca() {
    if (this.liquidacionPescaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_RESTAURAR_LIQUIDACION_PESCA,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_RESTAURAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: '#416273'
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargandoEstado.emit(true);
          this.prdLiquidacion.liqAnulado = false;
          let parametro = { liquidacionPK: this.data.pk, anularRestaurar: false }
          this.liquidacionPescaService.anularRestaurarLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
        }
      });
    }
  }

  despuesDeAnularRestaurarLiquidacion(data) {
    this.cargandoEstado.emit(false);
    if (data) {
      this.prdLiquidacion.liqFecha = new Date(this.prdLiquidacion.liqFecha);
      this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CREADO, liquidacion: this.prdLiquidacion });
      this.utilService.generarSwal(LS.TAG_LIQUIDACION_PESCA, LS.SWAL_SUCCESS, data.operacionMensaje);
    }
  }

  //Cancelar liquidación pesca
  cancelarLiquidacionPesca() {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
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
              this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
        break;
      default:
        this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  sePuedeCancelar(): boolean {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmLiquidacionPesca) && this.utilService.compararObjetos(this.listaDetalle, this.listaInicial);
  }

  //Cliente
  buscarCliente(event) {
    let fueBuscado = this.cliente.cliCodigo != "" && this.clienteCodigo === this.cliente.cliCodigo;
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.cliente.cliCodigo && !fueBuscado) {
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        busqueda: this.cliente.cliCodigo,
        mostrarInactivo: false
      }
      event.srcElement.blur();
      event.preventDefault();
      const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametro;
      modalRef.componentInstance.isModal = true;
      modalRef.result.then((result) => {
        if (result) {
          this.cliente = result;
          this.clienteCodigo = this.cliente.cliCodigo;
          this.focusedLote();
        } else {
          this.clienteCodigo = null;
          this.cliente = new InvFunListadoClientesTO();
          this.focusedCliente();
        }
      }, () => {
        this.focusedCliente();
      });
    }
  }

  validarCliente() {
    if (this.clienteCodigo !== this.cliente.cliCodigo) {
      this.clienteCodigo = null;
      this.cliente = new InvFunListadoClientesTO();
    }
  }

  focusedCliente() {
    let element = document.getElementById('codCliente');
    element ? element.focus() : null;
  }

  focusedLote() {
    let element = document.getElementById('lote');
    element ? element.focus() : null;
  }

  //MENU
  mostrarOpciones(event, dataSelected) {
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    if (filasFocusedCell) {
      this.mostrarContextMenu(dataSelected, filasFocusedCell.rowIndex, event);
    }
  }

  mostrarContextMenu(data, rowIndex, event) {
    this.objetoSeleccionado = data;
    this.generarOpcionesDetalle(rowIndex);
    this.menuOpciones.show(event);
    event.stopPropagation();
  }


  generarOpcionesDetalle(rowIndex) {
    let permiso = (this.data.accion === LS.ACCION_MAYORIZAR || this.data.accion === LS.ACCION_CREAR);
    let permisoEliminar = (this.data.accion === LS.ACCION_MAYORIZAR || this.data.accion === LS.ACCION_CREAR);
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up', rowIndex) : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down', rowIndex) : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permisoEliminar, command: () => permisoEliminar ? this.eliminarFila(rowIndex) : null },
    ];
  }

  agregarFila(ubicacion: string, rowIndex, noFocused?) {
    let index = rowIndex;
    if (index >= 0) {
      this.agregarFilaByIndex(index, ubicacion, noFocused);
    }
  }

  agregarFilaByIndex(index, ubicacion, noFocused?) {
    this.objetoSeleccionado = this.listaDetalle[index];
    let indexAbajo = ubicacion === 'up' ? index : index + 1;
    var nuevoItem = this.liquidacionPescaService.obtenerNuevoDetalle(this.objetoSeleccionado);
    this.listaDetalle.splice(indexAbajo, 0, nuevoItem);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexAbajo }) : null;
    //  !noFocused ? this.focusedProducto(indexAbajo) : this.cantidadFocusAndEditingCell(index);
    this.refreshGrid();
  }

  eliminarFila(rowIndex) {
    if (this.listaDetalle.length > 1) {
      this.listaDetalle.splice(rowIndex, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado], addIndex: rowIndex }) : null;
      this.refreshGrid();
      this.generarTotales();
    }
  }

  //Imprimir liquidacion pesca
  imprimirLiquidacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargandoEstado.emit(true);
      let listaResultado: Array<ListaLiquidacionTO> = [];
      listaResultado.push(this.liquidacionSeleccionada);
      let parametros = { ListaLiquidacionTO: listaResultado, empresa: this.empresaSeleccionada.empCodigo };
      this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteLiquidacionPescaPorLote", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoLiquidacionPesca.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargandoEstado.emit(false);
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.liquidacionPescaService.generarColumnasFormulario(this); //crea las colunmas - Siempre en un servicio
    this.columnDefsSelected = this.columnDefs.slice(); // define columnas seleccionadas para el combo de seleccion
    this.context = { componentParent: this }; //compartir el contexto padre a la grilla
    this.frameworkComponents = { //componentes adicionales a incrustar en la tabla
      toolTip: TooltipReaderComponent,
      numericCell: NumericCellComponent
    };
    this.pinnedBottomRowData = [ //creacion del objeto footer
      {
        prdLiquidacionProducto: '',
        prodTipo: '',
        prdLiquidacionTalla: '',
        tallaUnidadMedida: '',
        detLibras: 0,
        detPrecio: '',
        prdTotal: 0
      }
    ];
    this.components = {}; //componentes adicionales
    this.accion === LS.ACCION_CREAR ? this.focusedCliente() : null; //condicion para enfocar una celda
  }

  onGridReady(params) {
    this.gridApi = params.api; //inicializa la grilla
    this.gridColumnApi = params.columnApi; //columnas de la grilla
    this.actualizarFilas(); //se debe actualizar las filas para el footer, incluye el tiempo
    if (this.accion === LS.ACCION_CREAR) {
      this.focusedCliente();
    } else {
      this.seleccionarPrimerFila();
    }
    this.gridApi.sizeColumnsToFit(); //redimensiona las columnas para que se adapten al tamaño de la vista
    this.generarTotales(true);
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
      if (columna.getId() === "prdTotal") {
        //event.preventDefault();
        setTimeout(() => {
          this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() });
        })
      } else {
        this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() });
      }
    }
    this.objetoSeleccionado = fila ? fila.data : null;
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

}
