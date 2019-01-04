import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { NgForm } from '@angular/forms';
import { PrdCorrida } from '../../../../entidades/produccion/PrdCorrida';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { CorridaFormularioService } from './corrida-formulario.service';
import * as moment from 'moment';
import { PrdCorridaDetalle } from '../../../../entidades/produccion/PrdCorridaDetalle';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';

@Component({
  selector: 'app-corrida-formulario',
  templateUrl: './corrida-formulario.component.html'
})
export class CorridaFormularioComponent implements OnInit {

  public constantes: any = LS;
  public accion: string = null;
  public listadoPiscinaTO: Array<PrdListaPiscinaTO> = new Array();
  public es: any = {}; //Locale Date (Obligatoria)
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public autonumeric30: AppAutonumeric;//3,0
  public autonumeric90: AppAutonumeric;//9,0
  public autonumeric92: AppAutonumeric;//9,2
  public autonumeric62: AppAutonumeric;//6,2

  @Input() parametros;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarAccion = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();

  public corrida: PrdCorrida = new PrdCorrida();
  public listaCorridaDetalleDestino: Array<PrdCorridaDetalle> = new Array();//tabla editable
  public listaCorridaDetalleOrigen: Array<PrdCorridaDetalle> = new Array();//tabla no editable
  public detalleSeleccionado: PrdCorridaDetalle = new PrdCorridaDetalle();
  public sectorSeleccionado: PrdListaSectorTO;
  public sectores: Array<PrdListaSectorTO> = new Array();
  public todoLosSectores: Array<PrdListaSectorTO> = new Array();
  public piscinaSeleccionada: PrdListaPiscinaTO;
  public sisPeriodo: SisPeriodo;

  public cargando: boolean = true;
  public activar: boolean = true;
  public estadoPeriodo: boolean = false;
  public fechaActual: Date = new Date();
  public isFechaValido: boolean = false;
  public isFechaHastaValido: boolean = true;
  public fechaDesdeInicial: string = null;
  public fechaHastaInicial: string = null;
  public parObligadoRegistrarLiquidacionPesca: boolean = false;
  public puedeEditar: boolean = false;
  public puedeTransferir: boolean = false;
  public titulo: string = "";
  public tipo: string = "";
  public innerWidth: number;
  public isScreamMd: boolean = true;

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
  @ViewChild("frmCorridaDatos") frmCorridaDatos: NgForm; //debe llamarse como el formulario
  public valoresIniciales: any;
  public detalleInicial: any;

  constructor(
    private corridaService: CorridaService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private corridaFormularioService: CorridaFormularioService,
    private periodoService: PeriodoService,
    private toastr: ToastrService,
    private api: ApiRequestService
  ) {
    this.constantes = LS;
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
    this.autonumeric62 = this.corridaFormularioService.autonumeric62();
    this.autonumeric92 = this.corridaFormularioService.autonumeric92();
    this.autonumeric90 = this.corridaFormularioService.autonumeric90();
    this.autonumeric30 = this.corridaFormularioService.autonumeric30();
  }

  ngOnInit() {
    this.cargando = true;
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.parObligadoRegistrarLiquidacionPesca = this.empresaSeleccionada.parametros[0] ? this.empresaSeleccionada.parametros[0].parObligadoRegistrarLiquidacionPesca : false;
    this.accion = this.parametros.accion;
    this.sectorSeleccionado = this.parametros.sectorSeleccionado;
    this.piscinaSeleccionada = this.parametros.piscinaSeleccionada;
    this.corridaFormularioService.definirAtajosDeTeclado();
    this.corrida = new PrdCorrida();
    this.obtenerDatosParaCrudCorrida();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmCorridaDatos ? this.frmCorridaDatos.value : null));
    }, 50);
  }

  obtenerDatosParaCrudCorrida() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.corridaService.obtenerDatosParaCrudCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaBodegasTO()*/
  despuesDeObtenerDatosParaCrudCorrida(data) {
    this.corrida.corFechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaActual);
    this.fechaActual = new Date(data.fechaActual);
    this.sectores = data.sectores;
    this.todoLosSectores = data.todoLosSectores;
    this.despuesDeGetPeriodoPorFecha(data.periodo);
    this.actuarSegunAccionDelPadre(this.accion);
  }

  actuarSegunAccionDelPadre(accion) {
    let objetoSeleccionado: PrdCorrida = { ...this.parametros.seleccionado };//Objeto seleccionado
    switch (accion) {
      case LS.ACCION_CONSULTAR:
        this.titulo = accion + " " + LS.TAG_CORRIDA.toLowerCase() + " N. " + objetoSeleccionado.prdCorridaPK.corNumero;
        this.puedeEditar = false;
        this.consultarDetalleCorrida(objetoSeleccionado);
        break;
      case LS.ACCION_CREAR:
        this.titulo = LS.TAG_REGISTRO + " " + LS.TAG_CORRIDA.toLowerCase();
        this.puedeEditar = true;
        this.corrida.corHectareas = this.piscinaSeleccionada.pisHectareaje;
        this.cargando = false;
        this.extraerValoresIniciales();
        break;
      case LS.ACCION_EDITAR:
        this.titulo = accion + " " + LS.TAG_CORRIDA.toLowerCase() + " N. " + objetoSeleccionado.prdCorridaPK.corNumero;
        this.puedeEditar = true;
        this.iniciarAgGrid();
        this.consultarDetalleCorrida(objetoSeleccionado);
        break;
    }
    this.focusedSector(0);
  }

  consultarDetalleCorrida(objetoSeleccionado: PrdCorrida) {
    this.corrida = objetoSeleccionado;
    this.corrida.corFechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaDesde);
    this.fechaDesdeInicial = this.corrida.corFechaDesde;
    this.corrida.corFechaSiembra = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaSiembra);
    this.corrida.corFechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaHasta);
    this.fechaHastaInicial = this.corrida.corFechaHasta;
    this.corrida.corFechaPesca = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaPesca);
    this.cargando = true;
    let parametro = {
      empresa: objetoSeleccionado.prdCorridaPK.corEmpresa,
      sector: objetoSeleccionado.prdCorridaPK.corSector,
      piscina: objetoSeleccionado.prdCorridaPK.corPiscina,
      numero: objetoSeleccionado.prdCorridaPK.corNumero,
      fechaHasta: objetoSeleccionado.corFechaHasta ? this.utilService.formatoDateSinZonaHorariaYYYMMDD(objetoSeleccionado.corFechaHasta).getTime() : null
    }
    this.corridaService.obtenerDetalleCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDetalleCorrida(data) {
    this.tipo = this.accion == LS.ACCION_CONSULTAR ? 'D' : 'O';
    this.listaCorridaDetalleOrigen = data.listaCorridaDetalleOrigen;
    this.listaCorridaDetalleDestino = data.listaCorridaDetalleDestino;
    this.isFechaValido = true;
    if (this.accion === LS.ACCION_EDITAR) {
      if (this.corrida.corFechaHasta) {
        this.puedeTransferir = true;
        this.isFechaHastaValido = data.estadoPeriodoHasta;
      } else {
        this.isFechaHastaValido = true;
      }
      if (this.listaCorridaDetalleDestino && this.listaCorridaDetalleDestino.length > 0) {
        this.completarDatosDestino();
      } else {
        this.cargando = false;
      }
      this.iniciarAgGrid();
    } else {
      this.cargando = false;
    }
    this.extraerValoresIniciales();
  }

  completarDatosDestino() {
    for (let i = 0; i < this.listaCorridaDetalleDestino.length; i++) {
      this.listaCorridaDetalleDestino[i]['secCodigo'] = this.listaCorridaDetalleDestino[i].prdCorridaDestino.prdCorridaPK.corSector;
      let piscinaSeleccionadaTO: PrdListaPiscinaTO = new PrdListaPiscinaTO();
      let piscinaSeleccionada = this.listaCorridaDetalleDestino[i].prdCorridaDestino.prdPiscina;
      piscinaSeleccionadaTO.pisSector = piscinaSeleccionada.prdPiscinaPK.pisSector;
      piscinaSeleccionadaTO.pisNombre = piscinaSeleccionada.pisNombre;
      piscinaSeleccionadaTO.pisNumero = piscinaSeleccionada.prdPiscinaPK.pisNumero;
      this.listaCorridaDetalleDestino[i]['piscinaSeleccionada'] = piscinaSeleccionadaTO;
      this.listaCorridaDetalleDestino[i]['corridaSeleccionada'] = this.listaCorridaDetalleDestino[i].prdCorridaDestino;
      this.listarPiscina(this.listaCorridaDetalleDestino[i], i === this.listaCorridaDetalleDestino.length - 1);
      this.listarCorrida(this.listaCorridaDetalleDestino[i], i === this.listaCorridaDetalleDestino.length - 1);
    }
  }

  listarPiscina(item, pararCargando?) {
    item.listapiscinaSeleccionada = [];
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      sector: item.secCodigo,
      mostrarInactivo: true
    };
    this.api.post("todocompuWS/produccionWebController/getListaPiscinaTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listadoPiscinas: Array<PrdListaPiscinaTO> = respuesta.extraInfo;
          item.piscinaSeleccionada = item.piscinaSeleccionada && listadoPiscinas ?
            listadoPiscinas.find(item2 => item2.pisNumero === item.piscinaSeleccionada.pisNumero && item2.pisSector === item.piscinaSeleccionada.pisSector) : null;
          item.listapiscinaSeleccionada = listadoPiscinas;
        } else {
          item.listapiscinaSeleccionada = [];
        }
        pararCargando ? this.cargando = false : null;
        this.refreshGrid();
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarCorrida(item, pararCargando?) {
    item.listacorridaSeleccionada = [];
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      sector: item.secCodigo,
      piscina: item.piscinaSeleccionada.pisNumero,
      fecha: this.corrida.corFechaHasta ? this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaHasta).getTime() : null
    };
    this.api.post("todocompuWS/produccionWebController/getListaCorridasPorEmpresaSectorPiscinaFecha", parametro, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listaCorridas: Array<PrdCorrida> = respuesta.extraInfo;
          item.corridaSeleccionada = item.corridaSeleccionada && listaCorridas ? listaCorridas.find(item2 =>
            item2.prdCorridaPK.corEmpresa == item.corridaSeleccionada.prdCorridaPK.corEmpresa &&
            item2.prdCorridaPK.corNumero == item.corridaSeleccionada.prdCorridaPK.corNumero &&
            item2.prdCorridaPK.corPiscina == item.corridaSeleccionada.prdCorridaPK.corPiscina &&
            item2.prdCorridaPK.corSector == item.corridaSeleccionada.prdCorridaPK.corSector) : null;
          item.listacorridaSeleccionada = listaCorridas;
        } else {
          item.listacorridaSeleccionada = [];
        }
        pararCargando ? this.cargando = false : null;
        this.refreshGrid();
      }).catch(err => this.utilService.handleError(err, this));
  }

  transferir() {
    let corridaDet: PrdCorridaDetalle = new PrdCorridaDetalle();
    corridaDet.prdCorridaOrigen = this.corrida;
    this.listaCorridaDetalleDestino.push(corridaDet);
  }

  enfocarInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  // Aqui guarda el corrida
  insertarCorrida(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true) && this.validarAntesDeEnviar(form)) {
      if (!this.isFechaValido) {//validez de periodos para fechas
        this.toastr.warning(LS.MSJ_INGRESE_DATOS_VALIDOS, LS.TAG_AVISO);
        this.cargando = false;
        return false;
      } else {
        this.corrida = this.corridaFormularioService.construirCorrida(this.corrida, this.piscinaSeleccionada, this.sectorSeleccionado);
        this.cargando = true;
        let parametro = {
          prdCorrida: { ...this.corrida }
        }
        this.corrida.corFechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaDesde);
        this.corrida.corFechaSiembra = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaSiembra);
        this.corridaService.insertarCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid)) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    this.cargando = validado;
    return validado;
  }

  despuesDeInsertarCorrida(data) {
    this.cargando = false;
    this.mensajeOk(data.operacionMensaje);
    this.cerrarFormulario();
  }

  editarCorrida(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true) && this.validarAntesDeEnviar(form)) {
      if (this.validarParaEdicion()) {
        this.corrida = this.corridaFormularioService.construirCorridaEdicion(this.corrida);
        this.cargando = true;
        let parametro = {
          cambioFechaDesde: this.fechaDesdeInicial === this.corrida.corFechaDesde,
          cambioFechaHasta: this.fechaHastaInicial === this.corrida.corFechaHasta,
          corridaDetalleList: this.corridaFormularioService.construirListaDetalleDestino(this.listaCorridaDetalleDestino),
          prdCorrida: { ...this.corrida }
        }
        this.corrida.corFechaDesde = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaDesde);
        this.corrida.corFechaSiembra = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.corrida.corFechaSiembra);
        this.corridaService.modificarCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.cargando = false;
      }
    }
  }

  despuesDeModificarCorrida(data) {
    this.cargando = false;
    this.mensajeOk(data.operacionMensaje);
    this.cerrarFormulario();
  }

  cerrarFormulario() {
    let parametro = {
      accion: LS.ACCION_CREADO,
      corResultante: this.corrida,
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
  }

  mensajeOk(mensaje: string) {
    this.utilService.generarSwal(this.accion + " " + LS.TAG_CORRIDA, LS.SWAL_SUCCESS, mensaje);
  }

  eliminar() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        let parametro = {
          prdCorrida: this.corrida
        }
        this.corridaService.eliminarCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarCorrida(data) {
    this.cargando = false;
    let parametro = {
      accion: LS.ACCION_ELIMINAR,
      corResultante: this.corrida,
      empresa: this.empresaSeleccionada
    };
    this.enviarAccion.emit(parametro);
    this.utilService.generarSwal(LS.TAG_CORRIDA, LS.SWAL_SUCCESS, data.operacionMensaje);
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_EDITAR:
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
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmCorridaDatos) && this.utilService.compararObjetos(this.detalleInicial, this.listaCorridaDetalleDestino);
  }

  seleccionarPiscina(o1: PrdListaPiscinaTO, o2: PrdListaPiscinaTO): boolean {
    return o1 && o2 ? o1.pisNumero === o2.pisNumero : o1 === o2;
  }

  // validar fechas
  validarFechaPorPeriodo() {
    this.isFechaValido = false;
    let parametro = {
      fecha: moment(this.corrida.corFechaDesde).format('YYYY-MM-DD'),
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    this.sisPeriodo = data;
    if (data && !data.perCerrado) {
      this.isFechaValido = true;
    } else {
      this.isFechaValido = false;
    }
    this.cargando = false;
  }

  cambioLaFecha() {
    this.corrida.corFechaDesde ? this.validarFechaPorPeriodo() : this.isFechaValido = false;
  }
  //fin validar fechas

  //validacion fecha hasta
  validarFechaHastaPorPeriodo() {
    this.isFechaHastaValido = false;
    let parametro = {
      fecha: moment(this.corrida.corFechaHasta).format('YYYY-MM-DD'),
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.api.post("todocompuWS/sistemaWebController/getPeriodoPorFecha", parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data && data.extraInfo) {
          if (!data.extraInfo.perCerrado) {
            this.isFechaHastaValido = true;
          } else {
            this.isFechaHastaValido = false;
          }
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
        }
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  cambioLaFechaHasta() {
    if (this.corrida.corFechaHasta && this.puedeTransferir && this.listaCorridaDetalleDestino && this.listaCorridaDetalleDestino.length > 0) {
      this.toastr.warning(LS.MSJ_SE_ACTUALIZARA_LISTADO_CORRIDAS, LS.TAG_AVISO);
      for (let i = 0; i < this.listaCorridaDetalleDestino.length; i++) {
        this.listaCorridaDetalleDestino[i]['corridaSeleccionada'] = null;
        this.listarCorrida(this.listaCorridaDetalleDestino[i], i === this.listaCorridaDetalleDestino.length - 1);
      }
    }
    this.corrida.corFechaHasta ? this.validarFechaHastaPorPeriodo() : this.isFechaHastaValido = false;
  }
  //fin validacion fecha hasta

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.corridaService.generarColumnasCorrida(this);
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {};
    this.components = {};
  }

  ejecutarMetodoChangeAtributo(params, value) {
    let data = params.node.data;
    data.secCodigo = value;
    data.listapiscinaSeleccionada = [];
    data.piscinaSeleccionada = null;
    data.listacorridaSeleccionada = [];
    data.corridaSeleccionada = null;
    this.refreshGrid();
    this.listarPiscina(data);
  }

  ejecutarMetodoChange(params, value) {
    let data = params.node.data;
    data.piscinaSeleccionada = value;
    data.listacorridaSeleccionada = [];
    data.corridaSeleccionada = null;
    this.refreshGrid();
    this.listarCorrida(data);
  }

  ejecutarMetodoChangeAlterno(params, value): boolean {
    if (!this.validarCorridaRepetida(value)) {
      this.toastr.warning(LS.MSJ_NO_PUEDE_ELEGIR_MISMA_CORRIDA, LS.TAG_AVISO);
      return false;
    }
    return true;
  }

  validarCorridaRepetida(value): boolean {
    if (value && this.listaCorridaDetalleDestino && this.listaCorridaDetalleDestino.length > 0) {
      let corrida: PrdCorrida = value;
      for (let i = 0; i < this.listaCorridaDetalleDestino.length; i++) {
        let corridaDestino: PrdCorrida = this.listaCorridaDetalleDestino[i]['corridaSeleccionada'];
        if (corrida && corridaDestino && corrida.prdCorridaPK && corrida.prdCorridaPK.corNumero === corridaDestino.prdCorridaPK.corNumero
          && corrida.prdCorridaPK.corPiscina === corridaDestino.prdCorridaPK.corPiscina && corrida.prdCorridaPK.corSector === corridaDestino.prdCorridaPK.corSector) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  validar100(mostrarToastr): boolean {
    if (this.listaCorridaDetalleDestino && this.listaCorridaDetalleDestino.length > 0) {
      let suma: number = 0;
      for (let i = 0; i < this.listaCorridaDetalleDestino.length; i++) {
        let porcentaje = this.utilService.quitarComasNumero(this.listaCorridaDetalleDestino[i].detPorcentaje);
        suma = suma + Math.round(porcentaje * 100) / 100;
        suma = Math.round(suma * 100) / 100;
      }
      if (suma == 100) {
        return true;
      }
      mostrarToastr ? this.toastr.warning(LS.MSJ_SUMA_DEBE_SER_100, LS.TAG_AVISO) : null;
      return false;
    }
    mostrarToastr ? this.toastr.warning(LS.MSJ_SUMA_DEBE_SER_100, LS.TAG_AVISO) : null;
    return false;
  }

  validarParaEdicion(): boolean {
    let suma: number = 0;
    if (!this.isFechaValido || !this.isFechaHastaValido) {//validez de periodos para fechas
      this.toastr.warning(LS.MSJ_INGRESE_DATOS_VALIDOS, LS.TAG_AVISO);
      return false;
    }
    if (this.puedeTransferir && !this.corrida.corFechaHasta) {//validez ue la fecha hasta no se haya borrado
      this.toastr.warning(LS.MSJ_INGRESE_DATOS_VALIDOS, LS.TAG_AVISO);
      return false;
    }
    if (this.listaCorridaDetalleDestino && this.listaCorridaDetalleDestino.length > 0) {//validar datos obligatorios en la tabla
      for (let i = 0; i < this.listaCorridaDetalleDestino.length; i++) {
        let corridaDestino: PrdCorrida = this.listaCorridaDetalleDestino[i]['corridaSeleccionada'];
        let corridaOrigen: PrdCorrida = this.listaCorridaDetalleDestino[i].prdCorridaOrigen;
        let piscina = this.listaCorridaDetalleDestino[i]['piscinaSeleccionada'];
        let sector = this.listaCorridaDetalleDestino[i]['secCodigo'];
        let porcentaje = this.utilService.quitarComasNumero(this.listaCorridaDetalleDestino[i].detPorcentaje);
        suma = suma + Math.round(porcentaje * 100) / 100;
        suma = Math.round(suma * 100) / 100;
        if (sector && corridaDestino && piscina && corridaOrigen && porcentaje > 0) {
        } else {
          this.toastr.warning(LS.MSJ_INGRESE_DATOS_VALIDOS, LS.TAG_AVISO);
          return false;
        }
      }
      if (suma == 100) {
        return true;
      } else {
        this.toastr.warning(LS.MSJ_SUMA_DEBE_SER_100, LS.TAG_AVISO);
        return false;
      }
    }
    return true;
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
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.detalleSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.detalleSeleccionado = data;
    if (this.puedeEditar) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
  }

  generarOpciones() {
    let permiso = this.empresaSeleccionada.listaSisPermisoTO.gruCrear && this.puedeEditar;
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: () => permiso ? this.agregarFila('up') : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: () => permiso ? this.agregarFila('down') : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: () => permiso ? this.eliminarFila() : null },
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
    if (event.colDef.field === "detPorcentaje") {
      this.validar100(true);
    }
  }

  agregarFilaAlFinal(params) {
    let keyCode = params.event.keyCode;
    let index = this.listaCorridaDetalleDestino.indexOf(this.detalleSeleccionado);
    if (this.utilService.validarKeyBuscar(keyCode) && (this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_EDITAR) && index >= 0 && index === (this.listaCorridaDetalleDestino.length - 1)) {
      let corridaDet: PrdCorridaDetalle = new PrdCorridaDetalle();
      corridaDet.prdCorridaOrigen = this.corrida;
      let listaTemporal = [...this.listaCorridaDetalleDestino];
      listaTemporal.push(corridaDet);
      this.listaCorridaDetalleDestino = listaTemporal;
      this.focusedSector(index + 1);
    }
  }

  agregarFila(ubicacion) {
    let index = this.listaCorridaDetalleDestino.indexOf(this.detalleSeleccionado);
    if (index >= 0) {
      index = ubicacion === 'up' ? index : index + 1;
      let corridaDet: PrdCorridaDetalle = new PrdCorridaDetalle();
      corridaDet.prdCorridaOrigen = this.corrida;
      let listaTemporal = this.listaCorridaDetalleDestino.slice();
      listaTemporal.splice(index, 0, corridaDet);
      this.listaCorridaDetalleDestino = listaTemporal;
      this.focusedSector(index);
    }
  }

  eliminarFila() {
    if (this.listaCorridaDetalleDestino.length > 1) {
      let index = this.listaCorridaDetalleDestino.indexOf(this.detalleSeleccionado);
      if (this.detalleSeleccionado && this.detalleSeleccionado.detSecuencia > 0) {
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
    let listaTemporal = this.listaCorridaDetalleDestino.slice();
    listaTemporal.splice(index, 1);
    this.listaCorridaDetalleDestino = listaTemporal;
    this.refreshGrid();
  }
  //#end

  //FOCUS
  focusedSector(index) {
    setTimeout(() => { this.productoFocusAndEditingCell(index) }, 50);
  }

  productoFocusAndEditingCell(index) {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(index, 'secCodigo');
      this.gridApi.startEditingCell({ rowIndex: index, colKey: "secCodigo" });
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (!this.sePuedeCancelar()) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
