import { Component, OnInit, ViewChild, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { ListaPreLiquidacionTO } from '../../../../entidadesTO/Produccion/ListaPreLiquidacionTO';
import { NgForm } from '@angular/forms';
import { GridApi } from 'ag-grid';
import { MenuItem } from 'primeng/api';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { PrdCorrida } from '../../../../entidades/produccion/PrdCorrida';
import { PrdPiscinaTO } from '../../../../entidadesTO/Produccion/PrdPiscinaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ContextMenu } from 'primeng/contextmenu';
import { PrdTalla } from '../../../../entidades/produccion/PrdTalla';
import { PrdProducto } from '../../../../entidades/produccion/PrdProducto';
import { PrdPreLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdPreLiquidacionMotivoTO';
import { PrdPreLiquidacion } from '../../../../entidades/produccion/PrdPreLiquidacion';
import { PrdPreLiquidacionDetalle } from '../../../../entidades/produccion/PrdPreLiquidacionDetalle';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PreliquidacionPescaService } from '../../transacciones/preliquidacion-pesca/preliquidacion-pesca.service';
import * as moment from 'moment';
import { LiquidacionPescaService } from '../../transacciones/liquidacion-pesca/liquidacion-pesca.service';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-pre-liquidacion-formulario',
  templateUrl: './pre-liquidacion-formulario.component.html',
  styleUrls: ['./pre-liquidacion-formulario.component.css']
})
export class PreLiquidacionFormularioComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @Input() data;
  @Input() empresaSeleccionada;
  @Output() activarEstado = new EventEmitter();
  @Output() cerrarFormularioAcciones = new EventEmitter();
  @Output() formularioCargadoCompletamente = new EventEmitter();
  public prdPreLiquidacion: PrdPreLiquidacion = new PrdPreLiquidacion();
  public prdPreLiquidacionCopia: PrdPreLiquidacion = new PrdPreLiquidacion();
  public listaTalla: Array<PrdTalla> = [];
  public listaProductos: Array<PrdProducto> = [];
  public listaMotivos: Array<PrdPreLiquidacionMotivoTO> = [];
  public listaCorridas: Array<PrdCorrida> = [];
  public listaDetalle: Array<PrdPreLiquidacionDetalle> = [];

  public objetoSeleccionado: PrdPreLiquidacionDetalle = new PrdPreLiquidacionDetalle();
  public motivoSeleccionado: PrdPreLiquidacionMotivoTO = new PrdPreLiquidacionMotivoTO();
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
  public cargando: boolean = false;

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
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
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
  public preLiquidacionSeleccionada: ListaPreLiquidacionTO = new ListaPreLiquidacionTO;

  constructor(
    private utilService: UtilService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private preLiquidacionPescaService: PreliquidacionPescaService,
    private toastr: ToastrService,
    private liquidacionPescaService: LiquidacionPescaService,
    private archivoService: ArchivoService
  ) {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.estilos = { 'width': '100%', 'height': 'calc(100vh - 550px)' }
    this.configAutonumeric = this.preLiquidacionPescaService.config2number();
    this.configAutonumeric6 = this.preLiquidacionPescaService.config6number();
  }

  ngOnInit() {
    this.inicializarAtajos();
    if (this.data) {
      this.listaMotivos = this.data.listaMotivos;
      this.piscSeleccionada = this.data.piscinaSeleccionada;
      this.secSeleccionado = this.data.sectorSeleccionado;
      this.preLiquidacionSeleccionada = this.data.seleccionado;
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

  inicializarMotivo() {
    if (this.prdPreLiquidacion.prdPreLiquidacionPK && this.prdPreLiquidacion.prdPreLiquidacionPK.plMotivo) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.prdPreLiquidacionMotivoPK && this.motivoSeleccionado.prdPreLiquidacionMotivoPK.plmCodigo ?
        this.listaMotivos.find(item => item.prdPreLiquidacionMotivoPK.plmCodigo === this.prdPreLiquidacion.prdPreLiquidacionPK.plMotivo) : this.listaMotivos[0];
    } else {
      this.motivoSeleccionado = this.listaMotivos[0];
    }
  }

  inicializarCorrida() {
    if (this.prdPreLiquidacion && this.prdPreLiquidacion.prdCorrida && this.prdPreLiquidacion.prdCorrida.prdCorridaPK) {
      this.corridaSeleccionada = this.corridaSeleccionada && this.corridaSeleccionada.prdCorridaPK && this.corridaSeleccionada.prdCorridaPK.corNumero ?
        this.listaCorridas.find(item => item.prdCorridaPK.corNumero === this.prdPreLiquidacion.prdCorrida.prdCorridaPK.corNumero
          && item.prdCorridaPK.corPiscina === this.prdPreLiquidacion.prdCorrida.prdCorridaPK.corPiscina) : null;
    } else {
      this.corridaSeleccionada = null
    }
  }

  inicializarCorridas(o1: PrdCorrida, o2: PrdCorrida) {
    if (o1 && o2) {
      return o1.prdCorridaPK.corNumero === o2.prdCorridaPK.corNumero;
    }
  }

  inicializarCliente() {
    this.cliente = new InvFunListadoClientesTO();
    this.cliente.cliCodigo = this.prdPreLiquidacion.invCliente.invClientePK.cliCodigo;
    this.cliente.cliNombre = this.prdPreLiquidacion.invCliente.cliNombreComercial;
    this.cliente.cliRazonSocial = this.prdPreLiquidacion.invCliente.cliRazonSocial;
    this.clienteCodigo = this.cliente.cliCodigo;
  }

  inicializarFechas() {
    this.fechaInicioCorrida = null;
    this.fechaFinCorrida = null;
    this.fechaDesde = null;
    this.fechaHasta = null;

    this.fechaInicioCorrida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
    this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corridaSeleccionada.corFechaDesde);
    if (this.corridaSeleccionada) {
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
      if (!data.prdProducto || !data.prdTalla || data.detLibras <= 0 || data.detPrecio <= 0) {
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
    this.cargando = true;
    if (this.lote !== this.prdPreLiquidacion.plLote && this.prdPreLiquidacion.plLote) {
      this.isLoteValido = false;
      if (this.accion === LS.ACCION_MAYORIZAR && this.prdPreLiquidacion.plLote === this.loteCopia) {
        this.isLoteValido = true;
      }
      if (!this.isLoteValido) {
        this.preLiquidacionPescaService.buscaObjPreLiquidacionPorLote({ liqEmpresa: this.empresaSeleccionada.empCodigo, liqLote: this.prdPreLiquidacion.plLote }, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.cargando = false;
      }
    } else {
      this.cargando = false;
    }
  }

  despuesDeBuscaObjPreLiquidacionPorLote(data) {
    if (!data) {
      this.isLoteValido = true;
    } else {
      this.toastr.warning("Ya existe el lote: " + this.prdPreLiquidacion.plLote, LS.MSJ_TITULO_INVALIDOS);
    }
    this.lote = this.prdPreLiquidacion.plLote;
    this.cargando = false;
  }

  validacionLibrasBasuraLibrasRecibidas() {
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasBasura)) === '') {
      this.prdPreLiquidacion.plLibrasBasura = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasRecibidas)) === '') {
      this.prdPreLiquidacion.plLibrasRecibidas = 0;
    }
    this.isValidoLbsBasura = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasBasura) <= this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasRecibidas);
    if (!this.isValidoLbsBasura) {
      this.toastr.warning("Las libras basura no pueden ser mayor que las libras recibidas", LS.MSJ_TITULO_INVALIDOS);
    } else {
      this.calcularLibrasNetas();
    }
  }

  validacionDeLbColasLbColProcLbNetas(tipoValidacion) {
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasCola)) === '') {
      this.prdPreLiquidacion.plLibrasCola = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasColaProcesadas)) === '') {
      this.prdPreLiquidacion.plLibrasColaProcesadas = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasNetas)) === '') {
      this.prdPreLiquidacion.plLibrasNetas = 0;
    }
    var librasNetas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasNetas);
    var librasColas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasCola);
    var librasColaProcesadas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasColaProcesadas);
    this.isValidoColasProcesadas = librasColaProcesadas <= librasColas;
    this.isValidoColas = librasColas <= librasNetas;
    if (this.isValidoColas) {
      this.prdPreLiquidacion.plLibrasEntero = librasNetas - librasColas;
    } else {
      if (tipoValidacion === 'COLA') {
        this.toastr.warning("Las libras de colas no puede ser mayor que las libras netas", LS.MSJ_TITULO_INVALIDOS);
      }
    }
    if (!this.isValidoColasProcesadas) {
      this.toastr.warning("Las libras colas procesadas no pueden ser mayor que las libras colas", LS.MSJ_TITULO_INVALIDOS);
    } else {
      if (this.isValidoColas) {
        this.calcularLibrasNetas();
      }
    }
  }

  //Operaciones
  obtenerDatosLiquidacionPesca() {
    this.cargando = true;
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
        this.toastr.warning("No hay productos,corridas o tallas creadas", LS.MSJ_TITULO_INVALIDOS);
        this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
      } else {
        if (this.accion !== LS.ACCION_CREAR) {
          this.consultarPreLiquidacion();
        } else {
          this.corridaSeleccionada = this.listaCorridas[0];
          this.inicializarFechas();
          this.motivoSeleccionado = this.listaMotivos[0];
          this.prdPreLiquidacion = new PrdPreLiquidacion();
          let detalle = new PrdPreLiquidacionDetalle();
          detalle.prdProducto = this.listaProductos[0];
          detalle.prdTalla = this.listaTalla[0];
          this.listaDetalle.push(detalle);
          this.iniciarAgGrid();
          this.mostrarFormularioLiquidacion = true;
          this.formularioCargadoCompletamente.emit(true);
          this.focusedCliente();
          this.inicializarFormulario();
        }
      }
    }
    this.cargando = false;
  }

  consultarPreLiquidacion() {
    this.cargando = true;
    let parametro = { pk: this.data.pk }
    this.preLiquidacionPescaService.consultarPreLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeConsultarPreLiquidacion(data) {
    if (data) {
      this.prdPreLiquidacion = data;
      this.listaDetalle = JSON.parse(JSON.stringify(this.prdPreLiquidacion.prdPreLiquidacionDetalleList));
      this.loteCopia = this.prdPreLiquidacion.plLote;
      this.corridaSeleccionada = this.prdPreLiquidacion.prdCorrida;
      this.inicializarCorrida();
      this.fechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.prdPreLiquidacion.plFecha);
      this.generarTotales();
      this.inicializarMotivo();
      this.inicializarCliente();
      this.iniciarAgGrid();
      this.calcularRendimiento();
      this.cargando = false;
      this.mostrarFormularioLiquidacion = true;
      this.formularioCargadoCompletamente.emit(true);
      this.inicializarFormulario();
    } else {
      this.cargando = false;
      this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  //guardar liquidación pesca
  insertarPreLiquidacionPesca(form: NgForm, pendiente?) {
    this.isPendiente = pendiente;
    this.cargando = true;
    let objetoEnviar = { correcto: false, mensaje: "", prdPreLiquidacion: null, listaPrdPreLiquidacionDetalle: [] };
    if (this.puedeGuardar(form)) {
      let copiaLiquidacionPesca: PrdPreLiquidacion = JSON.parse(JSON.stringify(this.prdPreLiquidacion));
      objetoEnviar = this.preLiquidacionPescaService.formatearDetalleParaEnviar(copiaLiquidacionPesca, this.listaDetalle, this);
      if (objetoEnviar.correcto) {
        let paramatros = {
          pendiente: pendiente,
          prdPreLiquidacion: objetoEnviar.prdPreLiquidacion,
          listaPrdPreLiquidacionDetalle: objetoEnviar.listaPrdPreLiquidacionDetalle
        }
        this.prdPreLiquidacionCopia = objetoEnviar.prdPreLiquidacion;
        this.preLiquidacionPescaService.insertarModificarPreLiquidacion(paramatros, this, this.empresaSeleccionada.empCodigo);
      } else {
        this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, objetoEnviar.mensaje, LS.ICON_ERROR_SWAL, LS.SWAL_OK);
        this.cargando = false;
      }
    } else {
      this.cargando = false;
    }
  }

  despuesDeInsertarModificarPreLiquidacion(data) {
    this.cargando = false;
    if (data) {
      this.prdPreLiquidacionCopia.plPendiente = this.isPendiente;
      this.prdPreLiquidacionCopia.prdPreLiquidacionPK.plNumero = data.extraInfo.prdPreLiquidacionPK.plNumero;
      this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CREADO, preLiquidacion: this.prdPreLiquidacionCopia });
      this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    }
  }

  //Anular o restaurar liquidacion pesca
  anularPreLiquidacionPesca() {
    if (this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ANULAR_PRE_LIQUIDACION_PESCA,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ANULAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.prdPreLiquidacion.plAnulado = true;
          let parametro = { pk: this.data.pk, anularRestaurar: true }
          this.preLiquidacionPescaService.anularRestaurarPreLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
        }
      });
    }
  }

  restaurarPreLiquidacionPesca() {
    if (this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_RESTAURAR_PRE_LIQUIDACION_PESCA,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_RESTAURAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: '#416273'
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.prdPreLiquidacion.plAnulado = false;
          let parametro = { pk: this.data.pk, anularRestaurar: false }
          this.preLiquidacionPescaService.anularRestaurarPreLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
        }
      });
    }
  }

  despuesDeAnularRestaurarPreLiquidacion(data) {
    this.cargando = false;
    if (data) {
      this.prdPreLiquidacion.plFecha = new Date(this.prdPreLiquidacion.plFecha);
      this.cerrarFormularioAcciones.emit({ accion: LS.ACCION_CREADO, preLiquidacion: this.prdPreLiquidacion });
      this.utilService.generarSwal(LS.TAG_PRE_LIQUIDACION_PESCA, LS.SWAL_SUCCESS, data.operacionMensaje);
    }
  }

  //Cancelar liquidación pesca
  cancelarPreLiquidacionPesca() {
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
    var nuevoItem = this.preLiquidacionPescaService.obtenerNuevoDetalle(this.objetoSeleccionado);
    this.listaDetalle.splice(indexAbajo, 0, nuevoItem);
    this.gridApi ? this.gridApi.updateRowData({ add: [nuevoItem], addIndex: indexAbajo }) : null;
    //  !noFocused ? this.focusedProducto(indexAbajo) : this.cantidadFocusAndEditingCell(index);
    this.refreshGrid();
  }

  eliminarFila(rowIndex) {
    if (this.listaDetalle.length > 1) {
      let index = rowIndex;
      this.listaDetalle.splice(index, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado], addIndex: index }) : null;
      this.refreshGrid();
      this.generarTotales();
    }
  }

  //Imprimir liquidacion pesca
  imprimirLiquidacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaResultado: Array<ListaPreLiquidacionTO> = [];
      listaResultado.push(this.preLiquidacionSeleccionada);
      let parametros = {
        ListaLiquidacionTO: listaResultado,
        empresa: this.empresaSeleccionada.empCodigo
      };
      this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteLiquidacionPesca", parametros, this.empresaSeleccionada)
        .then(data => {
          this.cargando = false;
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoLiquidacionPesca.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.preLiquidacionPescaService.generarColumnasFormulario(this); //crea las colunmas - Siempre en un servicio
    this.columnDefsSelected = this.columnDefs.slice(); // define columnas seleccionadas para el combo de seleccion
    this.context = { componentParent: this }; //compartir el contexto padre a la grilla
    this.frameworkComponents = { //componentes adicionales a incrustar en la tabla
      toolTip: TooltipReaderComponent,
      numericCell: NumericCellComponent
    };
    this.pinnedBottomRowData = [ //creacion del objeto footer
      {
        prdProducto: '',
        prodTipo: '',
        prdTalla: '',
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
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
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

  //calculos
  alCambiarValorDeCelda(event) {
    if (event.colDef.field === "detLibras" || event.colDef.field === "detPrecio") {
      this.multiplicarPrecioCantidad(event.data);
    }
    if (event.colDef.field === "prdTotal") {
      this.totalEntreCantidad(event.data);
    }
  }

  calcularLibrasNetas() {
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasCola)) === '') {
      this.prdPreLiquidacion.plLibrasCola = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasBasura)) === '') {
      this.prdPreLiquidacion.plLibrasBasura = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasRecibidas)) === '') {
      this.prdPreLiquidacion.plLibrasRecibidas = 0;
    }
    var librasRecibidas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasRecibidas);
    var librasBasura = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasBasura);
    var librasColas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasCola);
    this.prdPreLiquidacion.plLibrasNetas = librasRecibidas - librasBasura;
    if (librasColas === 0) {
      this.prdPreLiquidacion.plLibrasEntero = this.prdPreLiquidacion.plLibrasNetas;
    } else {
      this.calcularLibrasEntero();
    }
  }

  calcularLibrasEntero() {
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasNetas)) === '') {
      this.prdPreLiquidacion.plLibrasNetas = 0;
    }
    if (JSON.parse(JSON.stringify(this.prdPreLiquidacion.plLibrasCola)) === '') {
      this.prdPreLiquidacion.plLibrasCola = 0;
    }
    var librasNetas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasNetas);
    var librasColas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasCola);
    this.isValidoColas = librasColas <= librasNetas;
    if (this.isValidoColas) {
      this.prdPreLiquidacion.plLibrasEntero = librasNetas - librasColas;
    } else {
      this.toastr.warning("Las libras de colas no puede ser mayor que las libras netas", LS.MSJ_TITULO_INVALIDOS);
    }
    this.calcularRendimiento();
  }

  totalEntreCantidad(data: PrdPreLiquidacionDetalle) {
    if (data.detLibras > 0) {
      data.detPrecio = data.prdTotal / data.detLibras;
    } else {
      data.detPrecio = 0;
    }
    this.refreshGrid();
    this.generarTotales();
  }

  multiplicarPrecioCantidad(data: PrdPreLiquidacionDetalle) {
    data.prdTotal = data.detPrecio * data.detLibras;
    this.refreshGrid();
    this.generarTotales();
  }

  calcularRendimiento() {
    if (!this.prdPreLiquidacion.plLibrasEnviadas) {
      this.prdPreLiquidacion.plLibrasEnviadas = 0;
    }
    if (!this.prdPreLiquidacion.plLibrasEntero) {
      this.prdPreLiquidacion.plLibrasEntero = 0;
    }
    var librasEnteras = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasEntero);
    var librasEnviadas = this.utilService.convertirDecimaleFloat(this.prdPreLiquidacion.plLibrasEnviadas);
    if (librasEnviadas === 0) {
      this.totalRendimiento = 0;
    } else {
      let porcentaje = (librasEnteras / librasEnviadas) * 100;
      this.totalRendimiento = Math.round(porcentaje * 100) / 100;
    }
    this.refreshGrid();
  }

  generarTotales() {
    let index = 0;
    let cantidades = 0;
    let totales = 0;
    this.listaDetalle.forEach(value => {
      cantidades += JSON.parse(JSON.stringify(this.utilService.convertirDecimaleFloat(value.detLibras)));
      value.prdTotal = JSON.parse(JSON.stringify(this.utilService.convertirDecimaleFloat(value.detLibras) * this.utilService.convertirDecimaleFloat(value.detPrecio)));
      totales += value.prdTotal;
      value.detOrden = index;
      index = index + 1;
    });
    this.total = totales;
    this.cantidades = cantidades;
    this.refreshGrid();
  }

}
