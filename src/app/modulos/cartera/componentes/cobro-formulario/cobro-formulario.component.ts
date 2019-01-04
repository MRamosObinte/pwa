import { Component, OnInit, Input, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { CarComboPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarComboPagosCobrosFormaTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { PagosAnticiposService } from '../../transacciones/pagos-anticipos/pagos-anticipos.service';
import { ClienteListadoComponent } from '../../../inventario/componentes/cliente-listado/cliente-listado.component';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { CarListaCobrosTO } from '../../../../entidadesTO/cartera/CarListaCobrosTO';
import { CarFunCobrosSaldoAnticipoTO } from '../../../../entidadesTO/cartera/CarFunCobrosSaldoAnticipoTO';
import { CarFunCobrosTO } from '../../../../entidadesTO/cartera/CarFunCobrosTO';
import { CobroService } from './cobro.service';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { CarCobrosTO } from '../../../../entidadesTO/cartera/CarCobrosTO';
import { CarCobrosDetalleFormaTO } from '../../../../entidadesTO/cartera/CarCobrosDetalleFormaTO';
import { CarCobrosDetalleVentasTO } from '../../../../entidadesTO/cartera/CarCobrosDetalleVentasTO';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { CarListaCobrosClienteTO } from '../../../../entidadesTO/cartera/CarListaCobrosClienteTO';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { ListaCobrosListadoService } from '../../consultas/lista-cobros-listado/lista-cobros-listado.service';
import { ListaBanBancoTO } from '../../../../entidadesTO/banco/ListaBanBancoTO';
import { PagoService } from '../pago-formulario/pago.service';

@Component({
  selector: 'app-cobro-formulario',
  templateUrl: './cobro-formulario.component.html'
})
export class CobroFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Input() titulo: string = LS.CARTERA_COBROS;

  public constantes: any = LS;
  public innerWidth: number;
  public accion: string = null;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public cobrarTodosCheck: boolean = false;
  public seEncontraronResultados: boolean = false;
  public configAutonumericReales: AppAutonumeric;
  public es: object = {};
  //Objetos para crud
  public conContable: ConContable = new ConContable();
  //LO QUE VIENE
  public listaFormaPago: Array<CarComboPagosCobrosFormaTO> = new Array();
  public listadoCobros: Array<CarListaCobrosTO> = new Array();
  public listadoCobrosAnticipos: Array<CarFunCobrosSaldoAnticipoTO> = new Array();
  public bancos: Array<ListaBanBancoTO> = new Array();
  //lO QUE SE VA
  public cobro: CarCobrosTO = new CarCobrosTO();
  public listadoDeFormasDeCobro: Array<CarCobrosDetalleFormaTO> = new Array();
  public listadoDeCobroVentaAGuardar: Array<CarCobrosDetalleVentasTO> = new Array();
  //parametros para consultar otros componentes
  public parametrosVenta: any;
  public objetoContableEnviar: any;
  public mostrarAccionesContabilidad: boolean = true;
  public tipoDocumento: string = "";

  public objetoSeleccionado: CarFunCobrosTO = new CarFunCobrosTO();
  public ventaSeleccionada: CarListaCobrosTO = new CarListaCobrosTO();
  public fechaActual: Date = new Date();
  public codigoCliente: string = null;
  public observaciones: string = "";
  public direccion: string = "";
  public ruc: string = "";
  public isFechaValido = true;
  //Numericos
  public totales: any = {};
  //Documento
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridApiForma: GridApi;
  public gridApiAnticipo: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public noData = LS.MSJ_NO_HAY_DATOS;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private auth: AuthService,
    private pagoAnticipoService: PagosAnticiposService,
    private pagoService: PagoService,
    private cobroService: CobroService,
    private periodoService: PeriodoService,
    private listadoCobrosService: ListaCobrosListadoService
  ) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.configAutonumericReales = cobroService.obtenerAutonumericReales();
  }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = this.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.accion = this.parametrosFormulario.accion;
    this.objetoSeleccionado = this.parametrosFormulario.seleccionado;
    this.generarAtajos();
    this.parametrosFormulario.cliente ? this.completarDatosCliente(this.parametrosFormulario.cliente) : null;
    if (this.accion != LS.ACCION_CREAR) {
      this.titulo = this.titulo + " (" + this.objetoSeleccionado.cobNumeroSistema + ")";
      this.obtenerInformacionParaMostrarCobro();
    }
    this.iniciarAgGrid();
  }

  //#region [R] [Acciones contable]
  completarDatosCliente(cliente: InvCliente) {
    this.codigoCliente = cliente.invClientePK.cliCodigo;
    this.cobro.cliCodigo = cliente.invClientePK.cliCodigo;
    this.cobro.conApellidosNombres = cliente.cliRazonSocial;
    this.direccion = cliente.cliDireccion;
    this.ruc = cliente.cliIdNumero;
    this.obtenerDatosParaCrudCobros();
    setTimeout(() => { this.focusInput('fecha') }, 50);
  }

  obtenerDatosParaCrudCobros() {
    this.totales = this.cobroService.inicializarTotales();
    this.seEncontraronResultados = false;
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, cliente: this.codigoCliente, accion: 'C' }
    this.cobroService.obtenerDatosParaCobros(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaCobros(data) {
    this.fechaActual = new Date(data.fechaActual);
    this.listaFormaPago = data.listaForma;
    this.listadoCobros = data.listaCobros;
    this.bancos = data.bancos;
    this.completarTablaCobros();
    this.listadoCobrosAnticipos = data.listaAnticipo;
    this.cargando = false;
    this.validarFechaPorPeriodo();
    this.extraerValoresIniciales();
    this.seEncontraronResultados = true;
  }

  obtenerInformacionParaMostrarCobro() {
    this.seEncontraronResultados = false;
    this.cargando = true;//numero: "2018-12 | C-COB | 0000001"
    let contablePK = this.utilService.obtenerConContablePK(this.objetoSeleccionado.cobNumeroSistema, LS.KEY_EMPRESA_SELECT, "|");
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: contablePK.conPeriodo,
      tipo: contablePK.conTipo,
      numero: contablePK.conNumero
    }
    this.cobroService.obtenerCobro(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerCobro(data) {
    this.formatearCobro(data.cobro);
    this.listadoCobros = data.listaCobros;
    this.completarTablaCobros();
    this.listadoDeFormasDeCobro = data.listadoDeFormasDeCobro;
    this.conContable = data.contable ? data.contable : new ConContable();
    this.fechaActual = new Date(this.conContable.conFecha);
    this.cargando = false;
    this.extraerValoresIniciales();
    this.seEncontraronResultados = true;
  }

  formatearCobro(datosCobroCliente: CarListaCobrosClienteTO) {
    this.codigoCliente = this.cobro.cliCodigo = datosCobroCliente.cliCodigo;
    this.cobro.conApellidosNombres = datosCobroCliente['cliRazonSocial'];
    this.direccion = datosCobroCliente.cliDireccion;
    this.observaciones = datosCobroCliente.cliObservaciones;
    this.ruc = datosCobroCliente.cliRuc;
    this.cobro.cobValor = datosCobroCliente.cobValor;
  }
  //#endregion

  //#region [R0] [VALIDAR-FECHA] 
  validarFechaPorPeriodo() {
    this.isFechaValido = false;
    if (this.fechaActual) {
      let parametro = {
        fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual),
        empresa: LS.KEY_EMPRESA_SELECT
      }
      this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
    this.refreshGrid();
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    if (data && !data.perCerrado) {
      this.isFechaValido = true;
    } else {
      this.isFechaValido = false;
    }
  }
  //#endregion

  //#region [R1] [CLIENTE]
  buscarCliente(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.cobro.cliCodigo) {
      let fueBuscado = (this.cobro.cliCodigo && this.codigoCliente && this.cobro.cliCodigo === this.codigoCliente);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false, busqueda: this.cobro.cliCodigo };
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalCliente(parametro);
      }
    }
  }

  abrirModalCliente(parametro) {
    const modalRef = this.modalService.open(ClienteListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametros = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.codigoCliente = result.cliCodigo;
        this.cobro.cliCodigo = result.cliCodigo;
        this.cobro.conApellidosNombres = result.cliRazonSocial;
        this.direccion = result.cliDireccion;
        this.ruc = result.cliId;
        this.obtenerDatosParaCrudCobros();
        this.focusInput('fecha');
      } else {
        this.focusInput('cliente');
      }
    }, () => {
      this.focusInput('cliente');
    });
  }

  validarCliente() {
    if (this.codigoCliente !== this.cobro.cliCodigo) {
      this.codigoCliente = null;
      this.cobro.conApellidosNombres = "";
      this.cobro.cliCodigo = "";
      this.direccion = "";
      this.ruc = "";
      this.listadoDeFormasDeCobro = new Array();
      this.listadoDeCobroVentaAGuardar = new Array();
    }
  }
  //#endregion

  focusInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  pararEdicionDeTablas() {
    this.gridApi ? this.gridApi.stopEditing() : null;
    this.gridApiAnticipo ? this.gridApiAnticipo.stopEditing() : null;
    this.gridApiForma ? this.gridApiForma.stopEditing() : null;
  }

  guardar(form: NgForm) {
    this.pararEdicionDeTablas();
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      if (this.validarAntesDeEnviar(form)) {
        this.cargando = true;
        this.antesDeGuardar();
        let parametro = {
          carCobrosTO: this.cobro,
          carCobrosDetalleVentasTOs: this.listadoDeCobroVentaAGuardar,
          carCobrosDetalleAnticiposTOs: this.totales.anticipo != 0 ? this.cobroService.armarAnticipos(this.listadoCobrosAnticipos) : [],
          carCobrosDetalleFormaTOs: this.totales.forma != 0 ? this.cobroService.armarFormasDeCobro(this.listadoDeFormasDeCobro) : []
        };
        this.cobroService.insertarCarCobros(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado && this.isFechaValido) {
      if (!this.listadoCobros || this.listadoCobros.length <= 0) {//No hay detalle venta
        this.toastr.warning(LS.MSJ_NO_EXISTEN_DOCUMENTOS_POR_COBRAR, LS.MSJ_TITULO_INVALIDOS);
        return false;
      }
      for (let i = 0; i < this.listadoCobros.length; i++) {
        let data = this.listadoCobros[i];
        if (data && data['valor'] && data['valor'] != 0) {
          if (data['valor'] < 0 && this.utilService.quitarComasNumero(data['valor']) != data.cxccSaldo) {
            this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
            return false;
          }
          if (this.cobroService.validarFechaFactura(data.cxccFechaEmision, this.fechaActual)) {
            this.toastr.warning(LS.MSJ_COBRANDO_FACTURA_CON_FECHA_ANTERIOR, LS.MSJ_TITULO_INVALIDOS);
            return false;
          }
        }
      }
      if (this.totales.forma != 0) {
        for (let i = 0; i < this.listadoDeFormasDeCobro.length; i++) {
          let data = this.listadoDeFormasDeCobro[i];
          if (!data || !data['fpSeleccionada'] || !data['fpSeleccionada']['fpDetalle'] && (!data.detValor || data.detValor != 0)) {
            this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
            return false;
          }
          if (data['fpSeleccionada']['postFechados']) {
            if (!data['bancoSeleccionado'] || !data['bancoSeleccionado']['banNombre']
              || !data.detCuenta || !data.detFechaPst) {
              this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
              return false;
            }
            if (!this.pagoService.validarFecha(this.listadoDeFormasDeCobro[i], this.fechaActual)) {
              this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
              return false;
            }
          }
        }
      }
      if (this.utilService.quitarComasNumero(this.totales.diferencia) != 0) {
        this.toastr.warning(LS.MSJ_LOS_VALORES_TOTALES_NO_COINCIDEN, LS.MSJ_TITULO_INVALIDOS);
        return false;
      }
    } else {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      return false;
    }
    return true;
  }

  antesDeGuardar() {
    this.listadoDeCobroVentaAGuardar = new Array();
    //armar cobro
    this.cobro.cobTipo = "C-COB";
    this.cobro.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    this.cobro.usrCodigo = this.auth.getCodigoUser();
    this.cobro.cobSaldoAnterior = 0;
    this.cobro.cobValor = 0;
    this.cobro.cobSaldoActual = 0;
    this.cobro.cobFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual);// EJB contable
    this.cobro.cobObservaciones = this.observaciones;// EJB contable
    //armarDetalleCobro
    for (let i = 0; i < this.listadoCobros.length; i++) {
      let cobro = this.listadoCobros[i];
      if (cobro['valor'] && cobro['valor'] != 0) {
        let cobroParaGuardar = this.cobroService.armarCobroParaGuardar(cobro, this.codigoCliente);
        this.listadoDeCobroVentaAGuardar.push(cobroParaGuardar);
        //completar valores de cobros
        this.cobro.cobSaldoAnterior = this.mathRound2(this.cobro.cobSaldoAnterior) + this.mathRound2(cobro.cxccSaldo);
        this.cobro.cobValor = this.mathRound2(this.cobro.cobValor) + this.mathRound2(cobro['valor']);
        this.cobro.cobSaldoActual = this.mathRound2(this.cobro.cobSaldoAnterior) - this.mathRound2(this.cobro.cobValor);
      }
    }
  }

  despuesDeInsertarCarCobros(data) {
    if (data) {
      try {
        this.conContable = data.extraInfo;
        this.preguntarImprimir(data.operacionMensaje);
      } catch (err) {
        this.cargando = false;
        this.cerrarFormulario();
      }
    } else {
      this.cargando = false;
    }
  }

  cerrarFormulario() {
    let parametro = {
      accion: LS.ACCION_CREADO,
      resultante: this.cobroService.construirObjetoParaPonerloEnLaLista(this.cobro, this.conContable),
      empresa: this.empresaSeleccionada
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  ejecutarMetodoChecbox(data) {
    if (data.cobrar) {
      data.valor = data.cxccSaldo;
    } else {
      data.valor = 0;
    }
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    this.calcularTotal();
  }

  cambiarEstadoCheckCabecera(data) {
    if (data) {
      this.gridApi.forEachNode((rowNode) => {
        var data = rowNode.data;
        data.valor = data.cxccSaldo;
        data.cobrar = true;
      });
    } else {
      this.gridApi.forEachNode((rowNode) => {
        var data = rowNode.data;
        data.valor = 0;
        data.cobrar = false;
      });
    }
    this.refreshGrid();
    this.calcularTotal();
  }

  cambioValor(data) {
    if (data.valor === data.cxccSaldo) {
      data.cobrar = true;
    } else {
      data.cobrar = false;
    }
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    this.calcularTotal();
  }

  calcularTotal() {
    this.cobrarTodosCheck = true;
    this.totales.cobro = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      this.totales.cobro = this.mathRound2(this.totales.cobro) + this.mathRound2(data.valor);
      this.totales.diferencia = this.mathRound2(this.totales.cobro) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
      if (data.valor != data.cxccSaldo) {
        this.cobrarTodosCheck = false;
      }
    });
  }

  completarTablaCobros() {
    this.cobrarTodosCheck = true;
    this.totales.cobro = 0;
    if (this.listadoCobros) {
      for (let i = 0; i < this.listadoCobros.length; i++) {
        let data = this.listadoCobros[i];
        this.listadoCobros[i]['valor'] = data['valor'] ? data['valor'] : 0;
        if (data['valor'] === data.cxccSaldo) {
          this.listadoCobros[i]['cobrar'] = true;
        } else {
          this.listadoCobros[i]['cobrar'] = false;
        }
        if (data['valor'] != data.cxccSaldo) {
          this.cobrarTodosCheck = false;
        }
        data['valor'] = this.accion == LS.ACCION_CREAR ? data['valor'] : data.cxccAbonos;
        this.totales.cobro = this.mathRound2(this.totales.cobro) + this.mathRound2(data['valor']);
        this.totales.diferencia = this.mathRound2(this.totales.cobro) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
      }
    }
  }

  mathRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  imprimirListaCobrosIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        numeroSistema: [this.objetoSeleccionado.cobNumeroSistema],
        nombre: "reportCobros.jrxml"
      }
      this.listadoCobrosService.imprimirCarFunCobrosPorLote(parametro, this, this.empresaSeleccionada);
    }
  }

  preguntarImprimir(texto: string) {
    let listaPk = [this.conContable.conContablePK];
    let listaNumeros = [this.conContable.conContablePK.conPeriodo + " | " + this.conContable.conContablePK.conTipo + " | " + this.conContable.conContablePK.conNumero];
    const modalRef = this.modalService.open(ImprimirComponent, { backdrop: 'static' });
    modalRef.componentInstance.mensaje = texto;
    modalRef.componentInstance.mostrarCombo = true;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.textoImprimirCombo = LS.LABEL_IMPRIMIR_COMPROBANTE_COBRO;
    modalRef.componentInstance.parametrosImprimir = { listadoPK: listaPk };
    modalRef.componentInstance.nombreRutaImprimir = "todocompuWS/contabilidadWebController/generarReporteContableIndividual";
    modalRef.componentInstance.nombreArchivoPDFImprimir = "ContableAnticipo";
    modalRef.componentInstance.parametrosImprimirCombo = { empresa: LS.KEY_EMPRESA_SELECT, numeroSistema: listaNumeros, nombre: "reportCobros.jrxml" };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/carteraWebController/generarReportePorLoteCobros";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "ReporteComprobanteCobro";
    modalRef.result.then((result) => {
      this.cerrarFormulario();
    }, () => {
      this.cerrarFormulario();
    });
  }
  //#region [R.1.4] [Acciones contable]
  anular() {
    let parametros = {
      conContablePK: this.conContable.conContablePK,
      anularReversar: true,
      accionUsuario: "ANULAR",
      bandera: ""
    };
    this.cargando = true;
    this.pagoAnticipoService.anularReversarContable(this, parametros);
  }

  reversar() {
    let parametros = {
      conContablePK: this.conContable.conContablePK,
      anularReversar: false,
      accionUsuario: "REVERSAR",
      bandera: ""
    };
    this.cargando = true;
    this.pagoAnticipoService.anularReversarContable(this, parametros);
  }

  despuesDeAnularReversarContable(respuesta) {
    this.cargando = false;
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
    let parametro = {
      accion: LS.ACCION_ELIMINADO
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }
  //#endregion

  //#region [R1.5] [GENERALES]
  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
    }, 50);
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos)) {
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
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: !activar });
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      this.focusInput("cliente");
      this.pararEdicionDeTablas();
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      this.focusInput("cliente");
      this.pararEdicionDeTablas();
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirContable') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let permiso = true;
    this.opciones = [
      { label: LS.LABEL_CONSULTAR_VENTA, icon: LS.ICON_CONSULTAR, disabled: !permiso, command: () => permiso ? this.consultarVenta() : null },
    ];
  }
  //#endregion

  consultarVenta() {
    let itemVenta: InvListaConsultaVentaTO = new InvListaConsultaVentaTO();
    itemVenta.vtaNumero = this.ventaSeleccionada.cxccPeriodo + "|" + this.ventaSeleccionada.cxccMotivo + "|" + this.ventaSeleccionada.cxccNumero;//2018-12|201|0000012
    this.parametrosVenta = {
      accion: LS.ACCION_CONSULTAR,
      seleccionado: itemVenta
    }
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.cambiarActivar(event.estado);
        break;
      case LS.ACCION_CANCELAR:
        this.generarAtajos();
        this.parametrosVenta = null;
        this.objetoContableEnviar = null;
        break;
      case LS.ACCION_CONSULTAR_CONTABLE:
        this.parametrosVenta = null;
        this.verContable(event.objetoSeleccionado);
        break;
    }
  }

  //#region [R2] [VER CONTABLE]
  verContable(objetoSeleccionado) {
    if (objetoSeleccionado) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: objetoSeleccionado.antPeriodo + " | " + objetoSeleccionado.antTipo + " | " + objetoSeleccionado.antNumero,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        volverACargar: true
      };
      this.activar = true;
    } else {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
    }
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.generarAtajos();
      this.activar = false;
      this.objetoContableEnviar = event.objetoEnviar;
      this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    }
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para el componente app-contable-formulario, cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.cambiarActivar(event);
  }
  //#endregion

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.cobroService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.ventaSeleccionada = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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
    this.ventaSeleccionada = fila ? fila.data : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  alCambiarValorDeCelda(event) {
    //Si finalizo de editar el codigo de producto, validar el codigo principal
    if (event.colDef.field === "valor") {
      this.cambioValor(event.data);
    }
  }
  //#endregion

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
