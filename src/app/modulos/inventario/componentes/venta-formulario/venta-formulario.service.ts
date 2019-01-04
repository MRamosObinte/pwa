import { Injectable } from '@angular/core';
import { InvVentasDetalleTO } from '../../../../entidadesTO/inventario/InvVentasDetalleTO';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { InvVentasTO } from '../../../../entidadesTO/inventario/InvVentasTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { AnxVentaTO } from '../../../../entidadesTO/anexos/AnxVentaTO';
import { ItemRetencionVenta } from '../../../../entidadesTO/inventario/ItemRetencionVenta';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { ClaveValor } from '../../../../enums/ClaveValor';
import { InvListaConsultaVentaTO } from '../../../../entidadesTO/inventario/InvListaConsultaVentaTO';

@Injectable({
  providedIn: 'root'
})
export class VentaFormularioService {

  constructor(
    private utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private auth: AuthService
  ) { }

  obtenerAutonumeric() {
    return {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '9999999999.999999',
      minimumValue: '0'
    }
  }

  definirAtajosDeTeclado(contexto): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      contexto.cancelar();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarVenta') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  agregarFila(ubicacion: string, listaInvVentasDetalleTO: Array<InvVentasDetalleTO>, detalleSeleccionado, gridApi): Array<InvVentasDetalleTO> {
    let index = listaInvVentasDetalleTO.indexOf(detalleSeleccionado);
    if (index >= 0) {
      index = ubicacion === 'up' ? index : index + 1;
      var nuevoItem = new InvVentasDetalleTO({ detCantidad: 1 });
      let listaTemporal = listaInvVentasDetalleTO.slice();
      listaTemporal.splice(index, 0, nuevoItem);
      listaInvVentasDetalleTO = listaTemporal;
      this.focusedProducto(index, gridApi);
    }
    return listaInvVentasDetalleTO;
  }

  agregarFilaAlFinal(params, listaInvVentasDetalleTO, detalleSeleccionado, accion, gridApi): Array<InvVentasDetalleTO> {
    let keyCode = params.event.keyCode;
    let index = listaInvVentasDetalleTO.indexOf(detalleSeleccionado);
    if (this.utilService.validarKeyBuscar(keyCode) && (accion === LS.ACCION_CREAR || accion === LS.ACCION_EDITAR) && index >= 0 && index === (listaInvVentasDetalleTO.length - 1)) {
      var nuevoItem = new InvVentasDetalleTO({ detCantidad: 1 });
      let listaTemporal = listaInvVentasDetalleTO.slice();
      listaTemporal.push(nuevoItem);
      listaInvVentasDetalleTO = listaTemporal;
      this.focusedProducto(index + 1, gridApi);
    }
    return listaInvVentasDetalleTO;
  }

  enfocarInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  focusCantidad(index) {
    this.enfocarInput('detCantidad_' + index);
  }

  refreshGrid(gridApi) {
    gridApi ? gridApi.refreshCells() : null;
    setTimeout(() => { gridApi ? this.actualizarFilas(gridApi) : null; }, 50);
  }

  actualizarFilas(gridApi) {
    let filasTiempo: FilasTiempo = new FilasTiempo();
    filasTiempo.filas = gridApi ? gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(filasTiempo.filas, filasTiempo.getTiempo());
  }

  focusedProducto(index, gridApi) {
    setTimeout(() => { this.productoFocusAndEditingCell(index, gridApi) }, 50);
  }

  productoFocusAndEditingCell(index, gridApi) {
    gridApi.setFocusedCell(index, 'proCodigoPrincipal')
    gridApi.startEditingCell({ rowIndex: index, colKey: "proCodigoPrincipal" });
  }

  cantidadFocusAndEditingCell(index, gridApi) {
    gridApi.setFocusedCell(index, "detCantidad");
    gridApi.startEditingCell({ rowIndex: index, colKey: "detCantidad" });
  }

  calcularValoresVenta(venta: InvVentasTO, listaInvVentasDetalleTO: Array<InvVentasDetalleTO>, gridApi): InvVentasTO {
    venta.vtaBaseImponible = 0;
    venta.vtaRecargoBaseImponible = 0;
    venta.vtaDescuentoBaseImponible = 0;
    venta.vtaSubtotalBaseImponible = 0;
    venta.vtaBase0 = 0;
    venta.vtaRecargoBase0 = 0;
    venta.vtaDescuentoBase0 = 0;
    venta.vtaSubtotalBase0 = 0;
    venta.vtaMontoIva = 0;
    venta.vtaTotal = 0;
    for (let detalle of listaInvVentasDetalleTO) {
      var rec = 0;
      var desc = 0;
      if (detalle.estadoProducto) {
        rec = this.utilService.convertirDecimaleFloat(detalle.parcial) * (this.utilService.convertirDecimaleFloat(detalle.detPorcentajeRecargo) / 100);
        desc = (this.utilService.convertirDecimaleFloat(detalle.parcial) + rec) * (this.utilService.convertirDecimaleFloat(detalle.detPorcentajeRecargo) / 100);
        if (detalle.proEstadoIva == 'GRAVA') {
          venta.vtaBaseImponible = this.utilService.convertirDecimaleFloat(venta.vtaBaseImponible) + this.utilService.convertirDecimaleFloat(detalle.parcial);
          venta.vtaRecargoBaseImponible = this.utilService.convertirDecimaleFloat(venta.vtaRecargoBaseImponible) + rec;
          venta.vtaDescuentoBaseImponible = this.utilService.convertirDecimaleFloat(venta.vtaDescuentoBaseImponible) + desc;
        } else {
          venta.vtaBase0 = this.utilService.convertirDecimaleFloat(venta.vtaBase0) + this.utilService.convertirDecimaleFloat(detalle.parcial);
          venta.vtaRecargoBase0 = this.utilService.convertirDecimaleFloat(venta.vtaRecargoBase0) + rec;
          venta.vtaDescuentoBase0 = this.utilService.convertirDecimaleFloat(venta.vtaDescuentoBase0) + desc;
        }
        venta.vtaMontoIva = this.utilService.convertirNDecimale((this.utilService.convertirDecimaleFloat(venta.vtaMontoIva) + this.utilService.convertirDecimaleFloat(detalle.vtIva)), 2);
      }
    }
    venta.vtaSubtotalBaseImponible = this.utilService.convertirDecimaleFloat(venta.vtaBaseImponible) + this.utilService.convertirDecimaleFloat(venta.vtaRecargoBaseImponible) - this.utilService.convertirDecimaleFloat(venta.vtaDescuentoBaseImponible);
    venta.vtaSubtotalBase0 = this.utilService.convertirDecimaleFloat(venta.vtaBase0) + this.utilService.convertirDecimaleFloat(venta.vtaRecargoBase0) - this.utilService.convertirDecimaleFloat(venta.vtaDescuentoBase0);
    venta.vtaTotal = this.utilService.convertirNDecimale((this.utilService.convertirDecimaleFloat(venta.vtaMontoIva) + this.utilService.convertirDecimaleFloat(venta.vtaSubtotalBaseImponible) + this.utilService.convertirDecimaleFloat(venta.vtaSubtotalBase0)), 2);
    this.refreshGrid(gridApi);
    return venta;
  }

  calcularValorItem(item: InvVentasDetalleTO, venta: InvVentasTO): InvVentasDetalleTO {
    item.detPorcentajeRecargo = this.utilService.convertirNDecimale(item.detPorcentajeRecargo, 6);
    item.detPorcentajeDescuento = this.utilService.convertirNDecimale(item.detPorcentajeDescuento, 6);
    item.detCantidad = this.utilService.convertirNDecimale(item.detCantidad, 6);
    item.detPrecio = this.utilService.convertirNDecimale(item.detPrecio, 6);
    item.parcial = this.utilService.convertirNDecimale((this.utilService.convertirDecimaleFloat(item.detPrecio) * this.utilService.convertirDecimaleFloat(item.detCantidad)), 6);
    var sumTotal = this.utilService.convertirDecimaleFloat(item.parcial) +
      this.utilService.convertirDecimaleFloat(item.parcial) * (this.utilService.convertirDecimaleFloat(item.detPorcentajeRecargo) / 100) -
      this.utilService.convertirDecimaleFloat(item.parcial) * (this.utilService.convertirDecimaleFloat(item.detPorcentajeDescuento) / 100);
    item.vtIva = item.proEstadoIva == 'GRAVA' ? this.utilService.convertirNDecimale(parseFloat(sumTotal * (parseFloat(venta.vtaIvaVigente + "") / 100) + ""), 6) : this.utilService.convertirNDecimale(0, 6);
    item.total = sumTotal + this.utilService.convertirDecimaleFloat(item.vtIva);
    return item;
  }

  formatearVentaDetalle(listaInvVentasDetalleTO: Array<InvVentasDetalleTO>, venta: InvVentasTO, bodegaSeleccionada: InvListaBodegasTO): Array<InvVentasDetalleTO> {
    let listaDetalle = [];
    for (let detalle of listaInvVentasDetalleTO) {
      detalle = new InvVentasDetalleTO(detalle);
      detalle.vtIva = true;
      detalle.detCantidad = this.utilService.quitarComasNumero(detalle.detCantidad);
      detalle.detPorcentajeDescuento = this.utilService.quitarComasNumero(detalle.detPorcentajeDescuento);
      detalle.detPorcentajeRecargo = this.utilService.quitarComasNumero(detalle.detPorcentajeRecargo);
      detalle.detPrecio = this.utilService.quitarComasNumero(detalle.detPrecio);
      detalle.detSaldo = this.utilService.quitarComasNumero(detalle.detSaldo);
      detalle.detValorPromedio = this.utilService.quitarComasNumero(detalle.detValorPromedio);
      detalle.detValorUltimaCompra = this.utilService.quitarComasNumero(detalle.detValorUltimaCompra);
      detalle.vtaEmpresa = LS.KEY_EMPRESA_SELECT;
      if (venta.bodCodigo) {
        detalle.bodCodigo = venta.bodCodigo;
        detalle.bodEmpresa = detalle.bodCodigo ? venta.bodEmpresa : null;
        detalle.pisSector = bodegaSeleccionada.codigoCP;
        detalle.pisEmpresa = detalle.pisSector ? LS.KEY_EMPRESA_SELECT : null;
        detalle.secCodigo = bodegaSeleccionada.codigoCP;
        detalle.secEmpresa = detalle.secCodigo ? LS.KEY_EMPRESA_SELECT : null;
      }
      delete detalle.catPrecioFijo;
      delete detalle.estadoProducto;
      delete detalle.estadoPrecio;
      delete detalle.proCodigoPrincipalCopia;
      delete detalle.conversion;
      delete detalle.total;
      delete detalle.parcial;
      listaDetalle.push(detalle);
    }
    return listaDetalle;
  }

  formatearVenta(venta: InvVentasTO, contexto): InvVentasTO {
    venta.vtaEmpresa = LS.KEY_EMPRESA_SELECT;
    venta.bodEmpresa = venta.bodCodigo ? LS.KEY_EMPRESA_SELECT : null;
    venta.conEmpresa = venta.conPeriodo ? LS.KEY_EMPRESA_SELECT : null;
    venta.cliEmpresa = LS.KEY_EMPRESA_SELECT;
    venta.ctaEmpresa = venta.ctaCodigo ? LS.KEY_EMPRESA_SELECT : null;
    venta.secCodigo = contexto.bodegaSeleccionada.codigoCP ? contexto.bodegaSeleccionada.codigoCP : null;
    venta.secEmpresa = venta.secCodigo ? LS.KEY_EMPRESA_SELECT : null;
    venta.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    venta.usrCodigo = this.auth.getCodigoUser();
    venta.vtaDocumentoTipo = contexto.tipoDocumento;
    venta.vtaListaDePrecios = contexto.etiquetaSeleccionada;
    let fecVencimiento = new Date(contexto.fechaEmision);
    fecVencimiento.setDate(fecVencimiento.getDate() + contexto.diasCredito);
    venta.vtaFechaVencimiento = this.utilService.formatearDateToStringYYYYMMDD(fecVencimiento);
    venta.vtaFecha = this.utilService.formatearDateToStringYYYYMMDD(new Date(contexto.fechaEmision));
    venta.vtaBase0 = this.utilService.quitarComasNumero(venta.vtaBase0);
    venta.vtaBaseExenta = this.utilService.quitarComasNumero(venta.vtaBaseExenta);
    venta.vtaBaseImponible = this.utilService.quitarComasNumero(venta.vtaBaseImponible);
    venta.vtaBaseNoObjeto = this.utilService.quitarComasNumero(venta.vtaBaseNoObjeto);
    venta.vtaDescuentoBase0 = this.utilService.quitarComasNumero(venta.vtaDescuentoBase0);
    venta.vtaDescuentoBaseExenta = this.utilService.quitarComasNumero(venta.vtaDescuentoBaseExenta);
    venta.vtaDescuentoBaseImponible = this.utilService.quitarComasNumero(venta.vtaDescuentoBaseImponible);
    venta.vtaDescuentoBaseNoObjeto = this.utilService.quitarComasNumero(venta.vtaDescuentoBaseNoObjeto);
    venta.vtaIvaVigente = this.utilService.quitarComasNumero(venta.vtaIvaVigente);
    venta.vtaMontoIva = this.utilService.quitarComasNumero(venta.vtaMontoIva);
    venta.vtaPagadoDineroElectronico = this.utilService.quitarComasNumero(venta.vtaPagadoDineroElectronico);
    venta.vtaPagadoEfectivo = this.utilService.quitarComasNumero(venta.vtaPagadoEfectivo);
    venta.vtaPagadoOtro = this.utilService.quitarComasNumero(venta.vtaPagadoOtro);
    venta.vtaPagadoTarjetaCredito = this.utilService.quitarComasNumero(venta.vtaPagadoTarjetaCredito);
    venta.vtaRecargoBase0 = this.utilService.quitarComasNumero(venta.vtaRecargoBase0);
    venta.vtaRecargoBaseImponible = this.utilService.quitarComasNumero(venta.vtaRecargoBaseImponible);
    venta.vtaSubtotalBase0 = this.utilService.quitarComasNumero(venta.vtaSubtotalBase0);
    venta.vtaSubtotalBaseExenta = this.utilService.quitarComasNumero(venta.vtaSubtotalBaseExenta);
    venta.vtaSubtotalBaseImponible = this.utilService.quitarComasNumero(venta.vtaSubtotalBaseImponible);
    venta.vtaSubtotalBaseNoObjeto = this.utilService.quitarComasNumero(venta.vtaSubtotalBaseNoObjeto);
    venta.vtaTotal = this.utilService.quitarComasNumero(venta.vtaTotal);
    return venta;
  }

  construirRetencion(anxVentasTO: AnxVentaTO, retencion: ItemRetencionVenta, venta: InvVentasTO): AnxVentaTO {
    if (retencion && retencion.retencionIR > 0 && retencion.retencionIVA > 0) {
      anxVentasTO.usrCodigo = this.auth.getCodigoUser();
      anxVentasTO.usrEmpresa = LS.KEY_EMPRESA_SELECT;
      anxVentasTO.venBase0 = venta.vtaBase0;
      anxVentasTO.venBaseImponible = venta.vtaBaseImponible;
      anxVentasTO.venBaseNoObjetoIva = venta.vtaBaseNoObjeto;
      anxVentasTO.venEmpresa = venta.vtaEmpresa;
      anxVentasTO.venMontoIva = venta.vtaMontoIva;
      anxVentasTO.venMotivo = venta.vtaMotivo;
      anxVentasTO.venNumero = venta.vtaNumero;
      anxVentasTO.venPeriodo = venta.vtaPeriodo;
      anxVentasTO.venRetencionAutorizacion = retencion.retencionAutorizacion;
      anxVentasTO.venRetencionFechaEmision = retencion.fecha;
      anxVentasTO.venRetencionNumero = retencion.retencionNumero;
      anxVentasTO.venValorRetenidoIva = retencion.retencionIVA;
      anxVentasTO.venValorRetenidoRenta = retencion.retencionIR;
    } else {
      anxVentasTO = null;
    }
    return anxVentasTO;
  }

  seleccionarBodega(listadoBodegas, caja): any {
    return listadoBodegas.find(item => item.bodCodigo == caja.permisoBodegaPermitida);
  }

  seleccionarFormaCobro(listadoFormaCobro, formaCobroSeleccionada): any {
    return listadoFormaCobro.find(item => item.fcSecuencial == formaCobroSeleccionada.fcSecuencial);
  }

  seleccionarFormaCobroPorFcSecuencial(listadoFormaCobro, fcSecuencial): any {
    return listadoFormaCobro.find(item => item.fcSecuencial == fcSecuencial);
  }

  seleccionarFormaCobroPorCtaCodigo(listadoFormaCobro, ctaCodigo): any {
    return listadoFormaCobro.find(item => item.ctaCodigo == ctaCodigo);
  }

  seleccionarMotivo(listadoMotivos, invVentasTO): any {
    return listadoMotivos.find(item => item.vmCodigo == invVentasTO.vtaMotivo);
  }

  formatearIformacionAdicional(lista: Array<ClaveValor>): string {
    let vtaInformacionAdicional = "";
    if (lista && lista.length > 0) {
      for (let i = 0; i < lista.length; i++) {
        vtaInformacionAdicional = vtaInformacionAdicional + lista[i].clave + "=" + lista[i].valor + "|"
      }
    }
    return vtaInformacionAdicional;
  }

  construirObjetoParaPonerloEnLaLista(invVentasTO, cliente): InvListaConsultaVentaTO {
    let objeto: InvListaConsultaVentaTO = new InvListaConsultaVentaTO();//Objeto seleccionado
    objeto.vtaNumero = invVentasTO.vtaPeriodo + '|' + invVentasTO.vtaMotivo + '|' + invVentasTO.vtaNumero;
    if (invVentasTO.vtaAnulado === true) {
      objeto.vtaStatus = "ANULADO";
    } else if (invVentasTO.vtaPendiente === true) {
      objeto.vtaStatus = "PENDIENTE";
    } else {
      objeto.vtaStatus = "";
    }
    if(invVentasTO && invVentasTO.conPeriodo && invVentasTO.conTipo && invVentasTO.conNumero){
      objeto.conNumero = invVentasTO.conPeriodo + "|" + invVentasTO.conTipo + "|" + invVentasTO.conNumero;
    }
    objeto.vtaDocumentoNumero = invVentasTO.vtaDocumentoNumero;
    objeto.vtaDocumentoTipo = invVentasTO.vtaDocumentoTipo;
    objeto.cliCodigo = invVentasTO.cliCodigo;
    objeto.cliNombre = cliente.cliRazonSocial;
    objeto.vtaFecha = invVentasTO.vtaFecha;
    objeto.vtaTotal = invVentasTO.vtaTotal;
    objeto.vtaFormaPago = invVentasTO.vtaFormaPago;
    objeto.vtaObservaciones = invVentasTO.vtaObservaciones;
    return objeto;
  }

  precioSeleccionado(caja): any {
    if (caja.permisoClientePrecioPermitido === 1) {
      return 'eprecio01';
    }
    if (caja.permisoClientePrecioPermitido === 2) {
      return 'eprecio02';
    }
    if (caja.permisoClientePrecioPermitido === 3) {
      return 'eprecio03';
    }
    if (caja.permisoClientePrecioPermitido === 4) {
      return 'eprecio04';
    }
    if (caja.permisoClientePrecioPermitido === 5) {
      return 'eprecio05';
    }
    if (caja.permisoClientePrecioPermitido === 6) {
      return 'eprecio06';
    }
    if (caja.permisoClientePrecioPermitido === 7) {
      return 'eprecio07';
    }
    if (caja.permisoClientePrecioPermitido === 8) {
      return 'eprecio08';
    }
    if (caja.permisoClientePrecioPermitido === 9) {
      return 'eprecio09';
    }
    if (caja.permisoClientePrecioPermitido === 10) {
      return 'eprecio10';
    }
    if (caja.permisoClientePrecioPermitido === 11) {
      return 'eprecio11';
    }
    if (caja.permisoClientePrecioPermitido === 12) {
      return 'eprecio12';
    }
    if (caja.permisoClientePrecioPermitido === 13) {
      return 'eprecio13';
    }
    if (caja.permisoClientePrecioPermitido === 14) {
      return 'eprecio14';
    }
    if (caja.permisoClientePrecioPermitido === 15) {
      return 'eprecio15';
    }
    if (caja.permisoClientePrecioPermitido === 16) {
      return 'eprecio16';
    }
    return 'proPorCantidad';
  }
}
