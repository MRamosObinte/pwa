import { Component, OnInit, Input, HostListener } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { InvVentasTO } from '../../../../../entidadesTO/inventario/InvVentasTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InvVentasDetalleTO } from '../../../../../entidadesTO/inventario/InvVentasDetalleTO';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { CajCajaTO } from '../../../../../entidadesTO/caja/CajCajaTO';
import { AnxVentaTO } from '../../../../../entidadesTO/anexos/AnxVentaTO';
import { ItemRetencionVenta } from '../../../../../entidadesTO/inventario/ItemRetencionVenta';
import { ArchivoService } from '../../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvListaBodegasTO } from '../../../../../entidadesTO/inventario/InvListaBodegasTO';
import { VentaFormularioService } from '../venta-formulario.service';
import { InvVentaMotivoComboTO } from '../../../../../entidadesTO/inventario/InvVentaMotivoComboTO';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { AuthService } from '../../../../../serviciosgenerales/auth.service';
import { ApiRequestService } from '../../../../../serviciosgenerales/api-request.service';
import { VentaService } from '../../../transacciones/venta/venta.service';
import { PrdListaPiscinaTO } from '../../../../../entidadesTO/Produccion/PrdListaPiscinaTO';

@Component({
  selector: 'app-modal-venta-detalle',
  templateUrl: './modal-venta-detalle.component.html'
})
export class ModalVentaDetalleComponent implements OnInit {

  constantes: any = LS;
  @Input() item: InvVentasDetalleTO;
  @Input() venta: InvVentasTO;
  @Input() tipo: string;
  @Input() caja: CajCajaTO;
  @Input() tipoDocumento;
  @Input() tipoEmpresa;
  @Input() accion;
  @Input() configAutonumeric: AppAutonumeric;
  @Input() listaInvVentasDetalleTO: Array<InvVentasDetalleTO>;
  @Input() listadoPiscinaTO: Array<PrdListaPiscinaTO>
  @Input() etiquetaSeleccionada;
  @Input() fechaEmision;
  @Input() diasCredito;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  @Input() motivoSeleccionado: InvVentaMotivoComboTO = new InvVentaMotivoComboTO();
  @Input() anxVentasTO: AnxVentaTO = new AnxVentaTO();
  @Input() contexto: any;
  retencion: ItemRetencionVenta = new ItemRetencionVenta();
  formasDeImprimir: Array<string> = LS.LISTA_MOTIVOS_VENTA_FORMA_IMPRIMIR;
  itemCopia: InvVentasDetalleTO;
  isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  cargando: boolean = false;
  validarElectronico: boolean = false;
  montoTotalPagoValido: boolean = false;
  vistaSoloParcial: boolean = false;
  valor: number = 0;
  cambio: number = 0;
  conversion: number = 0;
  autonumericCambios: AppAutonumeric;

  constructor(
    public activeModal: NgbActiveModal,
    public utilService: UtilService,
    private ventaService: VentaService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private auth: AuthService,
    private api: ApiRequestService,
    private ventaFormularioService: VentaFormularioService
  ) {
  }

  ngOnInit() {
    this.autonumericCambios = { ...this.configAutonumeric };
    this.autonumericCambios.maximumValue = '9999999999.99';
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.valor = this.utilService.convertirNDecimale(this.valor, 6);
    this.conversion = this.item ? this.item.detCantidad : 0;
    this.item ? this.item.vtIva = this.utilService.quitarComasNumero(this.item.vtIva) : null;
    this.venta.vtaPagadoEfectivo = 0;
    this.venta.vtaPagadoDineroElectronico = 0;
    this.venta.vtaPagadoTarjetaCredito = 0;
    this.venta.vtaPagadoOtro = 0;
    this.item ? this.item.conversion = this.item.conversion ? this.item.conversion : 1 : null;
    this.itemCopia = JSON.parse(JSON.stringify(this.item));
    if(this.tipo === 'precio'){
      setTimeout(() => {   this.enfocarInput('precio') }, 50);
    }else if(this.tipo === 'cantidad'){
      setTimeout(() => {   this.enfocarInput('bultos') }, 50);
    }else if(this.tipo === 'detalle'){
      setTimeout(() => {   this.enfocarInput('parcial') }, 50);
    }
  }

  enfocarInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  validarDesbordamiento(): boolean {
    let bultos = this.utilService.quitarComasNumero(this.conversion) * this.utilService.quitarComasNumero(this.item.conversion);
    if (bultos > 9999999999.99) {
      this.toastr.warning(LS.MSJ_DESBORDAMIENTO, LS.TAG_AVISO);
      return false;
    }
    return true;
  }

  aceptarVenta(estado) {
    if (this.accion === LS.ACCION_MAYORIZAR) {
      this.modificarVenta(estado);
    } else {
      this.insertarVenta(estado);
    }
  }

  insertarVenta(estado) {
    this.cargando = true;
    this.venta = this.ventaFormularioService.formatearVenta(this.venta, this);
    this.venta.vtaPendiente = estado;
    this.anxVentasTO = this.ventaFormularioService.construirRetencion(this.anxVentasTO, this.retencion, this.venta);
    let listaDetalle = this.ventaFormularioService.formatearVentaDetalle(this.listaInvVentasDetalleTO, this.venta, this.bodegaSeleccionada);
    let parametro = {
      invVentasTO: new InvVentasTO(this.venta),
      listaInvVentasDetalleTO: listaDetalle,
      anxVentasTO: this.anxVentasTO,
      tipoDocumentoComplemento: this.contexto.tipoDocumentoComplemento,
      numeroDocumentoComplemento: this.contexto.numeroDocumentoComplemento,
      motivoDocumentoComplemento: this.contexto.motivoComplemento,
      isComprobanteElectronica: false
    }
    this.ventaService.insertarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeInsertarVenta(data) {
    this.venta = data.extraInfo.invVentasTO;
    try {
      if (this.venta.vtaPendiente === true) {
        this.cargando = false;
        this.mensajeOk(data.operacionMensaje);
        this.activeModal.close(this.venta);
      } else {
        switch (this.motivoSeleccionado.vmFormaContabilizar) {
          case 'PREGUNTAR'://preguntar
            this.preguntarContabilizar(data.operacionMensaje);
            break;
          default:
            this.formaDeImprimir(data.operacionMensaje);
            break;
        }
      }
    } catch (err) {
      this.cargando = false;
      this.mensajeOk(data.operacionMensaje);
      this.activeModal.close(this.venta);
    }
  }

  despuesDeContabilizarVenta(mensaje) {
    this.formaDeImprimir(mensaje);
  }

  formaDeImprimir(mensaje) {
    switch (this.motivoSeleccionado.vmFormaImprimir) {
      case 'AUTOMATICAMENTE'://imprimir
      case 'VISTA PREVIA'://imprimir
        this.mensajeOk(mensaje);
        this.imprimirInvVentas();
        break;
      case 'SELECCIONAR IMPRESORA':
        this.mensajeOk(mensaje);
        this.imprimirInvVentas();
        break;
      case 'PREGUNTAR':
      case 'PREGUNTAR, VISTA PREVIA':
        this.preguntarImprimirVenta(mensaje);
        break;
      case 'PREGUNTAR, SELECCIONAR IMPRESORA':
        this.preguntarImprimirVenta(mensaje);
        break;
      case 'NO IMPRIMIR':
        this.mensajeOk(mensaje);
        this.activeModal.close(this.venta);
        break;
      default:
        this.mensajeOk(mensaje);
        this.activeModal.close(this.venta);
        break;
    }
  }

  mensajeOk(mensaje: string) {
    this.utilService.generarSwal(LS.VENTA, LS.SWAL_SUCCESS, mensaje);
  }

  preguntarContabilizar(texto: string) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: texto + '<br>' + LS.MSJ_PREGUNTA_CONTABILIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_CALCULADORA + "'></i>  " + LS.LABEL_CONTABILIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          periodo: this.venta.vtaPeriodo,
          motivo: this.venta.vtaMotivo,
          ventaNumero: this.venta.vtaNumero,
          codigoUsuario: this.auth.getCodigoUser()
        };
        this.api.post("todocompuWS/inventarioWebController/insertarInvContableVentasTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(data => {
            if (data) {
              let mensaje = data.operacionMensaje ? texto + " <br><br>" + "<strong>" + data.operacionMensaje + "</strong>" : texto;
              this.despuesDeContabilizarVenta(mensaje);
            }
          }
          ).catch(err => this.utilService.handleError(err, this));
      } else {//Cierra el formulario
        this.formaDeImprimir(texto);
      }
    });
  }

  preguntarImprimirVenta(texto: string) {
    if (this.ventaService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada, true)) {
      let parametros = {
        title: LS.TOAST_CORRECTO,
        texto: texto + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR + "<br>" + LS.TAG_NUMERO + ': ' + this.venta.vtaNumero,
        type: LS.SWAL_SUCCESS,
        confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
        cancelButtonText: LS.LABEL_SALIR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona Imprimir
          this.imprimirInvVentas();
        } else {//Cierra el formulario
          this.activeModal.close(this.venta);
        }
      });
    } else {
      this.activeModal.close(this.venta);
    }
  }

  imprimirInvVentas() {
    this.cargando = true;
    let listaDetalle = this.ventaFormularioService.formatearVentaDetalle(this.listaInvVentasDetalleTO, this.venta, this.bodegaSeleccionada);
    let parametro = {
      invVentasTO: new InvVentasTO(this.venta),
      listaInvVentasDetalleTO: listaDetalle,
      isComprobanteElectronica: false,
      nombreReporte: "reportComprobanteVenta"
    }
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteVentaDetalleImpresion", parametro, this.empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('venta' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
        this.activeModal.close(this.venta);
      }).catch(err => this.utilService.handleError(err, this));
  }

  modificarVenta(estado) {
    this.cargando = true;
    this.venta = this.ventaFormularioService.formatearVenta(this.venta, this);
    this.venta.vtaPendiente = estado;
    this.anxVentasTO = this.ventaFormularioService.construirRetencion(this.anxVentasTO, this.retencion, this.venta);
    let listaDetalle = this.ventaFormularioService.formatearVentaDetalle(this.listaInvVentasDetalleTO, this.venta, this.bodegaSeleccionada);
    let parametro = {
      invVentasTO: new InvVentasTO(this.venta),
      listaInvVentasDetalleTO: listaDetalle,
      anxVentasTO: this.anxVentasTO,
      tipoDocumentoComplemento: this.contexto.tipoDocumentoComplemento,
      numeroDocumentoComplemento: this.contexto.numeroDocumentoComplemento,
      motivoDocumentoComplemento: this.contexto.motivoComplemento,
      isComprobanteElectronica: false
    }
    this.ventaService.modificarVenta(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeModificarVenta(data) {
    this.cargando = false;
    this.mensajeOk(data.operacionMensaje);
    this.activeModal.close(this.venta);
  }

  calcularTotales(item: InvVentasDetalleTO) {
    item.detPorcentajeRecargo = this.utilService.convertirNDecimale(item.detPorcentajeRecargo, 6);
    item.detPorcentajeDescuento = this.utilService.convertirNDecimale(item.detPorcentajeDescuento, 6);
    item.detCantidad = this.utilService.convertirNDecimale(item.detCantidad, 6);
    item.detPrecio = this.utilService.convertirNDecimale((this.utilService.convertirDecimaleFloat(item.parcial) / this.utilService.convertirDecimaleFloat(item.detCantidad)), 6);
    var recargo = this.utilService.convertirDecimaleFloat(item.parcial) * (this.utilService.convertirDecimaleFloat(item.detPorcentajeRecargo) / 100);
    var descuento = (this.utilService.convertirDecimaleFloat(item.parcial) + recargo) * (this.utilService.convertirDecimaleFloat(item.detPorcentajeDescuento) / 100);
    var sumTotal = this.utilService.convertirDecimaleFloat(item.parcial) + recargo - descuento;
    item.vtIva = item.proEstadoIva == 'GRAVA' ? this.utilService.convertirNDecimale((parseFloat(sumTotal * (parseFloat(this.venta.vtaIvaVigente + "") / 100) + "")), 6) : this.utilService.convertirNDecimale(0, 6);
    item.vtIva = this.utilService.quitarComasNumero(item.vtIva);
    item.total = sumTotal + this.utilService.convertirDecimaleFloat(item.vtIva);
    this.ventaFormularioService.calcularValoresVenta(this.venta, this.listaInvVentasDetalleTO, null);
  };

  calcularTotales2(item: InvVentasDetalleTO) {
    item = this.ventaFormularioService.calcularValorItem(item, this.venta);
    this.ventaFormularioService.calcularValoresVenta(this.venta, this.listaInvVentasDetalleTO, null);
  };

  //PRECIO
  calcularPrecio(item: InvVentasDetalleTO) {
    let iva: any = this.utilService.convertirNDecimale(this.venta.vtaIvaVigente, 6);
    this.valor = this.utilService.convertirNDecimale(this.valor, 6);
    if (item.proEstadoIva == 'GRAVA') {
      this.valor = this.utilService.quitarComasNumero(this.valor);
      iva = this.utilService.quitarComasNumero(iva);
      item.detPrecio = this.valor / ((iva / 100) + 1);
    } else {
      item.detPrecio = this.valor;
    }
    this.calcularTotales2(item);
    this.activeModal.close();
  }
  //CANTIDAD
  calcularCantidadBultos(item: InvVentasDetalleTO) {
    if (this.validarDesbordamiento()) {
      item.detCantidad = this.utilService.convertirNDecimale(this.conversion, 6);
      item.detCantidad = this.utilService.convertirNDecimale((this.utilService.convertirDecimaleFloat(item.detCantidad) * this.utilService.convertirDecimaleFloat(item.conversion)), 6);
      this.calcularTotales(item);
      let event = { colDef: { field: 'detCantidad' }, data: item };
      this.contexto.alCambiarValorDeCelda(event);
      this.activeModal.close();
    }
  }

  //DETALLE
  calcularParcialInput(item: InvVentasDetalleTO) {
    item.parcial = this.utilService.convertirNDecimale(item.parcial, 6);
    item.detPrecio = this.utilService.convertirNDecimale(item.detCantidad, 6);
    this.calcularTotales(item);
  };

  calculoValoresDescuentoRecargo(item: InvVentasDetalleTO) {
    let total = this.utilService.convertirDecimaleFloat(JSON.parse(JSON.stringify(item.total)));// Total incial antes de ACEPTAR
    item.detPorcentajeRecargo = this.utilService.convertirNDecimale(item.detPorcentajeRecargo, 6);
    item.detPorcentajeDescuento = this.utilService.convertirNDecimale(item.detPorcentajeDescuento, 6);
    if (this.utilService.convertirDecimaleFloat(item.detPorcentajeRecargo) > total) {
      this.toastr.warning(LS.MSJ_SUPERO_RECARGO_100_PORCIENTO, LS.TOAST_ADVERTENCIA);
      item.detPorcentajeRecargo = this.utilService.convertirNDecimale(0, 6);
    }
    if (this.utilService.convertirDecimaleFloat(item.detPorcentajeDescuento) > total) {
      this.toastr.warning(LS.MSJ_SUPERO_DESCUENTO_100_PORCIENTO, LS.TOAST_ADVERTENCIA);
      item.detPorcentajeDescuento = this.utilService.convertirNDecimale(0, 6);
    }
    var recargo = this.utilService.convertirDecimaleFloat(item.parcial) * (this.utilService.convertirDecimaleFloat(item.detPorcentajeRecargo) / 100);
    var descuento = (this.utilService.convertirDecimaleFloat(item.parcial) + this.utilService.convertirDecimaleFloat(recargo)) * (this.utilService.convertirDecimaleFloat(item.detPorcentajeDescuento) / 100);
    item.total = this.utilService.convertirDecimaleFloat(item.parcial) + this.utilService.convertirDecimaleFloat(recargo) - this.utilService.convertirDecimaleFloat(descuento);
    this.calcularTotales(item);
  }

  validarDetalle(itemCopia: InvVentasDetalleTO) {
    this.item.pisNumero = itemCopia.pisNumero;
    this.item.detPorcentajeRecargo = itemCopia.detPorcentajeRecargo;
    this.item.detPorcentajeDescuento = itemCopia.detPorcentajeDescuento;
    this.item.parcial = itemCopia.parcial;
    this.item.total = itemCopia.total;
    this.contexto.gridApi.refreshCells();
    this.calcularTotales(this.item);
    this.activeModal.close();
  }
  //PARCIAL
  verDatosParcial() {
    this.vistaSoloParcial = true;
  }

  cancelarParcial() {
    this.vistaSoloParcial = false;
  }

  calcularParcialModal(item: InvVentasDetalleTO) {
    let iva: any = this.utilService.convertirNDecimale(this.venta.vtaIvaVigente, 6);
    this.valor = this.utilService.convertirNDecimale(this.valor, 6);
    if (item.proEstadoIva === 'GRAVA') {
      item.parcial = this.utilService.convertirDecimaleFloat((this.valor)) / ((this.utilService.convertirDecimaleFloat(iva) / 100) + 1);
    } else {
      item.parcial = this.utilService.convertirDecimaleFloat(this.valor);
    }
    item.parcial = this.utilService.convertirNDecimale(item.parcial, 6);
    item.detCantidad = this.utilService.convertirNDecimale(item.detCantidad, 6);
    item.detPrecio = this.utilService.convertirDecimaleFloat(item.parcial) / this.utilService.convertirDecimaleFloat(item.detCantidad);
    this.calcularTotales2(item);
    this.activeModal.close();
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  calcularCambio() {
    this.validarElectronico = false;
    this.montoTotalPagoValido = false;
    this.venta.vtaPagadoEfectivo = this.utilService.convertirNDecimale(this.venta.vtaPagadoEfectivo, 2);
    this.venta.vtaPagadoDineroElectronico = this.utilService.convertirNDecimale(this.venta.vtaPagadoDineroElectronico, 2);
    this.venta.vtaPagadoTarjetaCredito = this.utilService.convertirNDecimale(this.venta.vtaPagadoTarjetaCredito, 2);
    this.venta.vtaPagadoOtro = this.utilService.convertirNDecimale(this.venta.vtaPagadoOtro, 2);
    this.validarElectronico = this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoEfectivo) !== 0 && this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoEfectivo) < this.utilService.convertirDecimaleFloat(this.venta.vtaTotal);
    if (!this.validarElectronico) {
      this.venta.vtaPagadoDineroElectronico = this.utilService.convertirNDecimale(0, 2);
      this.venta.vtaPagadoTarjetaCredito = this.utilService.convertirNDecimale(0, 2);
    }
    var sumaTotal = this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoDineroElectronico) + this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoEfectivo) + this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoTarjetaCredito);
    if (this.validarElectronico) {
      //var diferencia = this.utilService.convertirDecimaleFloat(this.venta.vtaTotal) - sumaTotal;
      //this.venta.vtaPagadoOtro = this.utilService.convertirDecimale(diferencia < 0 ? 0 : diferencia);
    } else {
      this.venta.vtaPagadoOtro = this.utilService.convertirNDecimale(0, 2);
    }
    sumaTotal += this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoOtro);
    this.validarBotonGuardar(sumaTotal);
  };

  validarBotonGuardar(sumaTotal) {
    var total = this.venta.vtaTotal;
    this.cambio = sumaTotal - this.utilService.convertirDecimaleFloat(total);
    this.cambio = this.cambio < 0 ? 0 : this.cambio;
    this.montoTotalPagoValido = this.validarElectronico ? sumaTotal !== 0 && sumaTotal === this.utilService.convertirDecimaleFloat(total) : sumaTotal >= this.utilService.convertirDecimaleFloat(total);
  };

  calcularDiferenciaMontoTotal() {
    var sumaTotal = this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoDineroElectronico) + this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoEfectivo) + this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoTarjetaCredito);
    var diferencia = this.utilService.convertirDecimaleFloat(this.venta.vtaTotal) - sumaTotal;
    this.venta.vtaPagadoOtro = sumaTotal === 0 ? this.utilService.convertirNDecimale(this.venta.vtaTotal, 2) : this.utilService.convertirNDecimale((diferencia < 0 ? 0 : diferencia), 2);
    var sumatoriaTotal = sumaTotal + this.utilService.convertirDecimaleFloat(this.venta.vtaPagadoOtro);
    this.validarBotonGuardar(sumatoriaTotal);
  };

}
