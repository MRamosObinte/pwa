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
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { CarListaPagosTO } from '../../../../entidadesTO/cartera/CarListaPagosTO';
import { CarFunPagosSaldoAnticipoTO } from '../../../../entidadesTO/cartera/CarFunPagosSaldoAnticipoTO';
import { CarFunPagosTO } from '../../../../entidadesTO/cartera/CarFunPagosTO';
import { PagoService } from './pago.service';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { CarPagosTO } from '../../../../entidadesTO/cartera/CarPagosTO';
import { CarPagosDetalleFormaTO } from '../../../../entidadesTO/cartera/CarPagosDetalleFormaTO';
import { CarPagosDetalleComprasTO } from '../../../../entidadesTO/cartera/CarPagosDetalleComprasTO';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { InvListaConsultaCompraTO } from '../../../../entidadesTO/inventario/InvListaConsultaCompraTO';
import { CarListaPagosProveedorTO } from '../../../../entidadesTO/cartera/CarListaPagosProveedorTO';
import { ListadoProveedoresComponent } from '../../../inventario/componentes/listado-proveedores/listado-proveedores.component';
import { PagosListadoService } from '../../consultas/pagos-listado/pagos-listado.service';

@Component({
  selector: 'app-pago-formulario',
  templateUrl: './pago-formulario.component.html'
})
export class PagoFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Input() titulo: string = LS.CARTERA_PAGOS;

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
  public listadoPagos: Array<CarListaPagosTO> = new Array();
  public listadoPagosAnticipos: Array<CarFunPagosSaldoAnticipoTO> = new Array();
  //lO QUE SE VA
  public pago: CarPagosTO = new CarPagosTO();
  public listadoDeFormasDePago: Array<CarPagosDetalleFormaTO> = new Array();
  public listadoDePagoCompraAGuardar: Array<CarPagosDetalleComprasTO> = new Array();
  //parametros para consultar otros componentes
  public parametrosCompra: any;
  public objetoContableEnviar: any;
  public mostrarAccionesContabilidad: boolean = true;
  public tipoDocumento: string = "";

  public objetoSeleccionado: CarFunPagosTO = new CarFunPagosTO();
  public compraSeleccionada: CarListaPagosTO = new CarListaPagosTO();
  public fechaActual: Date = new Date();
  public codigoProveedor: string = null;
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
    private periodoService: PeriodoService,
    private listadoPagosService: PagosListadoService
  ) {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.configAutonumericReales = pagoService.obtenerAutonumericReales();
  }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = this.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.accion = this.parametrosFormulario.accion;
    this.objetoSeleccionado = this.parametrosFormulario.seleccionado;
    this.generarAtajos();
    this.parametrosFormulario.proveedor ? this.completarDatosProveedor(this.parametrosFormulario.proveedor) : null;
    if (this.accion != LS.ACCION_CREAR) {
      this.titulo = this.titulo + " (" + this.objetoSeleccionado.pagNumeroSistema + ")";
      this.obtenerInformacionParaMostrarPago();
    }
    this.iniciarAgGrid();
  }

  completarDatosProveedor(proveedor: any) {
    this.codigoProveedor = proveedor.provCodigo;
    this.pago.provCodigo = proveedor.provCodigo;
    this.pago.conApellidosNombres = proveedor.provRazonSocial;
    this.direccion = proveedor.provDireccion;
    this.ruc = proveedor.provIdNumero;
    this.obtenerDatosParaCrudPagos();
    setTimeout(() => { this.focusInput('fecha') }, 50);
  }

  obtenerDatosParaCrudPagos() {
    this.totales = this.pagoService.inicializarTotales();
    this.seEncontraronResultados = false;
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, proveedor: this.codigoProveedor, accion: 'P' }
    this.pagoService.obtenerDatosParaPagos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaPagos(data) {
    this.fechaActual = new Date(data.fechaActual);
    this.listaFormaPago = data.listaForma;
    this.listadoPagos = data.listaPagos;
    this.completarTablaPagos();
    this.listadoPagosAnticipos = data.listaAnticipo;
    this.cargando = false;
    this.validarFechaPorPeriodo();
    this.extraerValoresIniciales();
    this.seEncontraronResultados = true;
  }

  obtenerInformacionParaMostrarPago() {
    this.seEncontraronResultados = false;
    this.cargando = true;//numero: "2018-12 | C-COB | 0000001"
    let contablePK = this.utilService.obtenerConContablePK(this.objetoSeleccionado.pagNumeroSistema, LS.KEY_EMPRESA_SELECT, "|");
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: contablePK.conPeriodo,
      tipo: contablePK.conTipo,
      numero: contablePK.conNumero
    }
    this.pagoService.obtenerPago(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerPago(data) {
    this.formatearPago(data.pago);
    this.listadoPagos = data.listaPagos;
    this.completarTablaPagos();
    this.listadoDeFormasDePago = data.listadoDeFormasDePago;
    this.conContable = data.contable ? data.contable : new ConContable();
    this.fechaActual = new Date(this.conContable.conFecha);
    this.cargando = false;
    this.extraerValoresIniciales();
    this.seEncontraronResultados = true;
  }

  formatearPago(datosPagoProveedor: CarListaPagosProveedorTO) {
    this.codigoProveedor = this.pago.provCodigo = datosPagoProveedor.provCodigo;
    this.pago.conApellidosNombres = datosPagoProveedor['provRazonSocial'];
    this.direccion = datosPagoProveedor.provDireccion;
    this.observaciones = datosPagoProveedor.provObservaciones;
    this.ruc = datosPagoProveedor.provRuc;
    this.pago.pagValor = datosPagoProveedor.pagValor;
  }

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
  buscarProveedor(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && this.pago.provCodigo) {
      let fueBuscado = (this.pago.provCodigo && this.codigoProveedor && this.pago.provCodigo === this.codigoProveedor);
      if (!fueBuscado) {
        let parametro = { empresa: LS.KEY_EMPRESA_SELECT, inactivos: false, busqueda: this.pago.provCodigo };
        event.srcElement.blur();
        event.preventDefault();
        this.abrirModalProveedor(parametro);
      }
    }
  }

  abrirModalProveedor(parametro) {
    const modalRef = this.modalService.open(ListadoProveedoresComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.parametrosBusqueda = parametro;
    modalRef.componentInstance.isModal = true;
    modalRef.result.then((result) => {
      if (result) {
        this.codigoProveedor = result.provCodigo;
        this.pago.provCodigo = result.provCodigo;
        this.pago.conApellidosNombres = result.provRazonSocial;
        this.direccion = result.provDireccion;
        this.ruc = result.provId;
        this.obtenerDatosParaCrudPagos();
        this.focusInput('fecha');
      } else {
        this.focusInput('proveedor');
      }
    }, () => {
      this.focusInput('proveedor');
    });
  }

  validarProveedor() {
    if (this.codigoProveedor !== this.pago.provCodigo) {
      this.codigoProveedor = null;
      this.pago.conApellidosNombres = "";
      this.pago.provCodigo = "";
      this.direccion = "";
      this.ruc = "";
      this.listadoDeFormasDePago = new Array();
      this.listadoDePagoCompraAGuardar = new Array();
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
          carPagosTO: this.pago,
          carPagosDetalleComprasTOs: this.listadoDePagoCompraAGuardar,
          carPagosDetalleAnticiposTOs: this.totales.anticipo != 0 ? this.pagoService.armarAnticipos(this.listadoPagosAnticipos) : new Array(),
          carPagosDetalleFormaTOs: this.totales.forma != 0 ? this.pagoService.armarFormasDePago(this.listadoDeFormasDePago) : new Array()
        };
        this.pagoService.insertarCarPagos(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    }
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado && this.isFechaValido) {
      if (!this.listadoPagos || this.listadoPagos.length <= 0) {//No hay detalle venta
        this.toastr.warning(LS.MSJ_NO_EXISTEN_DOCUMENTOS_POR_PAGAR, LS.MSJ_TITULO_INVALIDOS);
        return false;
      }
      for (let i = 0; i < this.listadoPagos.length; i++) {
        let data = this.listadoPagos[i];
        if (data && data['valor'] && data['valor'] != 0) {
          if (data['valor'] < 0 && this.utilService.quitarComasNumero(data['valor']) < data.cxppSaldo) {
            this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
            return false;
          }
          if (this.pagoService.validarFechaFactura(data.cxppFechaEmision, this.fechaActual)) {
            this.toastr.warning(LS.MSJ_COBRANDO_FACTURA_CON_FECHA_ANTERIOR, LS.MSJ_TITULO_INVALIDOS);
            return false;
          }
        }
      }
      if (this.totales.forma != 0) {
        for (let i = 0; i < this.listadoDeFormasDePago.length; i++) {
          let data = this.listadoDeFormasDePago[i];
          if (!data || !data['fpSeleccionada'] || !data['fpSeleccionada']['fpDetalle'] && (!data.detValor || data.detValor != 0)) {
            this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
            return false;
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
    this.listadoDePagoCompraAGuardar = new Array();
    //armar pago
    this.pago.pagTipo = "C-PAG";
    this.pago.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    this.pago.usrCodigo = this.auth.getCodigoUser();
    this.pago.pagSaldoAnterior = 0;
    this.pago.pagValor = 0;
    this.pago.pagSaldoActual = 0;
    this.pago.pagFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual);// EJB contable
    this.pago.pagObservaciones = this.observaciones;// EJB contable
    //armarDetallePago
    for (let i = 0; i < this.listadoPagos.length; i++) {
      let pago = this.listadoPagos[i];
      if (pago['valor'] && pago['valor'] != 0) {
        let pagoParaGuardar = this.pagoService.armarPagoParaGuardar(pago, this.codigoProveedor);
        this.listadoDePagoCompraAGuardar.push(pagoParaGuardar);
        //completar valores de pagos
        this.pago.pagSaldoAnterior = this.mathRound2(this.pago.pagSaldoAnterior) + this.mathRound2(pago.cxppSaldo);
        this.pago.pagValor = this.mathRound2(this.pago.pagValor) + this.mathRound2(pago['valor']);
        this.pago.pagSaldoActual = this.mathRound2(this.pago.pagSaldoAnterior) - this.mathRound2(this.pago.pagValor);
      }
    }
  }

  despuesDeInsertarCarPagos(data) {
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
      resultante: this.pagoService.construirObjetoParaPonerloEnLaLista(this.pago, this.conContable),
      empresa: this.empresaSeleccionada
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  ejecutarMetodoChecbox(data) {
    if (data.cobrar) {
      data.valor = data.cxppSaldo;
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
        data.valor = data.cxppSaldo;
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
    if (data.valor === data.cxppSaldo) {
      data.cobrar = true;
    } else {
      data.cobrar = false;
    }
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    this.calcularTotal();
  }

  calcularTotal() {
    this.cobrarTodosCheck = true;
    this.totales.pago = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      this.totales.pago = this.mathRound2(this.totales.pago) + this.mathRound2(data.valor);
      this.totales.diferencia = this.mathRound2(this.totales.pago) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
      if (data.valor != data.cxppSaldo) {
        this.cobrarTodosCheck = false;
      }
    });
  }

  completarTablaPagos() {
    this.cobrarTodosCheck = true;
    this.totales.pago = 0;
    if (this.listadoPagos) {
      for (let i = 0; i < this.listadoPagos.length; i++) {
        let data = this.listadoPagos[i];
        this.listadoPagos[i]['valor'] = data['valor'] ? data['valor'] : 0;
        if (data['valor'] === data.cxppSaldo) {
          this.listadoPagos[i]['cobrar'] = true;
        } else {
          this.listadoPagos[i]['cobrar'] = false;
        }
        if (data['valor'] != data.cxppSaldo) {
          this.cobrarTodosCheck = false;
        }
        data['valor'] = this.accion == LS.ACCION_CREAR ? data['valor'] : data.cxppAbonos;
        this.totales.pago = this.mathRound2(this.totales.pago) + this.mathRound2(data['valor']);
        this.totales.diferencia = this.mathRound2(this.totales.pago) - (this.mathRound2(this.totales.forma) + this.mathRound2(this.totales.anticipo));
      }
    }
  }

  mathRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  imprimirListaPagosIndividual() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        numeroSistema: [this.objetoSeleccionado.pagNumeroSistema],
        nombre: "reportPagos.jrxml"
      }
      this.listadoPagosService.imprimirPagosPorLote(parametro, this, this.empresaSeleccionada);
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
    modalRef.componentInstance.nombreArchivoPDFImprimir = "ContablePago";
    modalRef.componentInstance.parametrosImprimirCombo = { empresa: LS.KEY_EMPRESA_SELECT, numeroSistema: listaNumeros, nombre: "reportPagos.jrxml" };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/carteraWebController/generarReportePorLotePagos";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "ReporteComprobantePago";
    modalRef.result.then((result) => {
      this.cerrarFormulario();
    }, () => {
      this.cerrarFormulario();
    });
  }

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
      this.focusInput("proveedor");
      this.pararEdicionDeTablas();
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      this.focusInput("proveedor");
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
      { label: LS.LABEL_CONSULTAR_COMPRA, icon: LS.ICON_CONSULTAR, disabled: !permiso, command: () => permiso ? this.consultarCompra() : null },
    ];
  }

  consultarCompra() {
    let itemCompra: InvListaConsultaCompraTO = new InvListaConsultaCompraTO();
    itemCompra.compNumero = this.compraSeleccionada.cxppPeriodo + "|" + this.compraSeleccionada.cxppMotivo + "|" + this.compraSeleccionada.cxppNumero;//2018-12|201|0000012
    this.parametrosCompra = {
      accion: LS.ACCION_CONSULTAR,
      parametroBusqueda: {
        empresa: LS.KEY_EMPRESA_SELECT,
        periodo: this.compraSeleccionada.cxppPeriodo,
        motivo: this.compraSeleccionada.cxppMotivo,
        numero: this.compraSeleccionada.cxppNumero
      }
    }
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.cambiarActivar(event.estado);
        break;
      case LS.ACCION_CANCELAR:
        this.generarAtajos();
        this.parametrosCompra = null;
        this.objetoContableEnviar = null;
        break;
      case LS.ACCION_CONSULTAR_CONTABLE:
        this.parametrosCompra = null;
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
    this.columnDefs = this.pagoService.generarColumnas(this);
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
    this.compraSeleccionada = data;
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
    this.compraSeleccionada = fila ? fila.data : null;
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
