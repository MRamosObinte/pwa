import { UtilService } from './../../../../serviciosgenerales/util.service';
import { InvListaDetalleComprasTO } from './../../../../entidadesTO/inventario/InvListaDetalleComprasTO';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { InvComprasDetalleTO } from '../../../../entidadesTO/inventario/InvComprasDetalleTO';

@Injectable({
  providedIn: 'root'
})
export class ComprasFormularioService {

  constructor(
    private utilService: UtilService,
    public api: ApiRequestService,
    public toastr: ToastrService
  ) { }

  obtenerUltimaAutorizacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxUltimaAutorizacionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerUltimaAutorizacion(respuesta.extraInfo);
        } else {
          contexto.despuesDeObtenerUltimaAutorizacion(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  validarDocumentoRepetido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarNumeroFacturaCompraProveedor", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarDocumentoRepetido(false);
        } else {
          contexto.despuesDeValidarDocumentoRepetido(true);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  validarChequeRepetido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/isExisteChequeAimprimir", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeValidarChequeRepetido(respuesta.extraInfo);//Si esta repetido y viene con mensaje
        } else {
          contexto.despuesDeValidarChequeRepetido(respuesta.extraInfo);// no esta repetido
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  contabilizarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/contabilizarComprasTrans", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeContabilizarCompra(respuesta);
        } else {
          contexto.despuesDeContabilizarCompra(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  recontabilizarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/recontabilizarComprasTrans", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeRecontabilizarCompra(respuesta);
        } else {
          contexto.despuesDeRecontabilizarCompra(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  buscarComprobanteElectronico(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/buscarComprobanteElectronico", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeBuscarComprobanteElectronico(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  bodegaFocusAndEditingCell(index, gridApi) {
    gridApi.setFocusedCell(index, 'bodCodigo')
    gridApi.startEditingCell({ rowIndex: index, colKey: "bodCodigo" });
  }

  productoFocusAndEditingCell(index, gridApi) {
    gridApi.setFocusedCell(index, 'proCodigoPrincipal')
    gridApi.startEditingCell({ rowIndex: index, colKey: "proCodigoPrincipal" });
  }

  cantidadFocusAndEditingCell(index, gridApi) {
    gridApi.setFocusedCell(index, "detCantidad");
    gridApi.startEditingCell({ rowIndex: index, colKey: "detCantidad" });
  }

  fpPorPagar(): any {
    return {
      ctaCodigo: "000000000000",
      fpDetalle: "POR PAGAR",
      validar: false
    }
  }

  focus(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  focusedProducto(index, gridApi) {
    setTimeout(() => { this.productoFocusAndEditingCell(index, gridApi) }, 50);
  }

  focusedBodega(index, gridApi) {
    setTimeout(() => { this.bodegaFocusAndEditingCell(index, gridApi) }, 50);
  }


  convertirInvListaDetalleComprasTOAInvComprasDetalleTO(lista: Array<InvListaDetalleComprasTO>): Array<InvComprasDetalleTO> {
    let listaInvListaDetalleComprasTO: Array<InvComprasDetalleTO> = [];

    lista.forEach(element => {
      let detalle = new InvComprasDetalleTO();
      detalle.detSecuencia = element.secuencial;
      detalle.proCodigoPrincipal = element.codigoProducto;
      detalle.proCodigoPrincipalCopia = element.codigoProducto;//Temporal
      detalle.bodCodigo = element.codigoBodega;
      detalle.bodCodigoCopia = element.codigoBodega;//Temporal
      detalle.detCantidad = element.cantidadProducto;
      detalle.detPrecio = element.precioProducto;
      detalle.detIce = element.detIce;
      detalle.pisNumero = element.codigoCC;
      detalle.secCodigo = element.codigoCP;
      detalle.parcialProducto = element.cantidadProducto * element.precioProducto;//Temporal
      detalle.medidaDetalle = element.medidaDetalle;//Temporal
      detalle.nombreProducto = element.nombreProducto;//Temporal
      detalle.proEstadoIva = element.gravaIva;
      detalle.detPendiente = element.pendiente;
      listaInvListaDetalleComprasTO.push(detalle);
    });


    return listaInvListaDetalleComprasTO;

  }

  formatearListaQuitarTemporales(lista: Array<InvComprasDetalleTO>) {
    lista.forEach(element => {
      this.eliminarCamposTemportales(element);
    });

    return lista;
  }

  eliminarCamposTemportales(element: InvComprasDetalleTO) {
    delete element.bodCodigoCopia;
    delete element.proCodigoPrincipalCopia;
    delete element.parcialProducto;
    delete element.medidaDetalle;
    delete element.nombreProducto;
    delete element.listadoPiscinaTO;
  }

  validarDetalle(lista: Array<InvComprasDetalleTO>): boolean {
    for (let i = 0; i < lista.length; i++) {
      let element = lista[i];
      if (!element.bodCodigoCopia || !element.proCodigoPrincipalCopia || !element.parcialProducto || element.parcialProducto <= 0 || !element.detCantidad || element.detCantidad <= 0) {
        return false;
      } else {
        this.eliminarCamposTemportales(element);
      }

    }
    return true;
  }

}
