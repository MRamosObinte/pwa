import { PrdListaPiscinaTO } from "../Produccion/PrdListaPiscinaTO";

export class InvListaDetalleComprasTO {
    id: number = 0;
    secuencial: number = 0;
    codigoBodega: string = null;
    pendiente: boolean = false;
    codigoProducto: string = null;
    nombreProducto: string = null;
    cantidadProducto: number = 0;
    medidaDetalle: string = null;
    precioProducto: number = 0;
    parcialProducto: number = 0;
    porcentajeDescuento: number = 0;
    detalleDescuento: number = 0;
    detalleSubtotal: number = 0;
    codigoCP: string = null;
    codigoCC: string = null;
    gravaIva: string = null;
    valorUltimaCompra: number = 0;
    detCantidadCaja: number = 0;
    detEmpaque: string = null;
    detPresentacionUnidad: string = null;
    detPresentacionCaja: string = null;
    detOtrosImpuestos: number = 0;
    detIce: number = 0;
    detPrecio1: number = 0;
    detPrecio2: number = 0;
    detPrecio3: number = 0;
    detPrecio4: number = 0;
    detPrecio5: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.secuencial = data.secuencial ? data.secuencial : this.secuencial;
        this.codigoBodega = data.codigoBodega ? data.codigoBodega : this.codigoBodega;
        this.pendiente = data.pendiente ? data.pendiente : this.pendiente;
        this.codigoProducto = data.codigoProducto ? data.codigoProducto : this.codigoProducto;
        this.nombreProducto = data.nombreProducto ? data.nombreProducto : this.nombreProducto;
        this.cantidadProducto = data.cantidadProducto ? data.cantidadProducto : this.cantidadProducto;
        this.medidaDetalle = data.medidaDetalle ? data.medidaDetalle : this.medidaDetalle;
        this.precioProducto = data.precioProducto ? data.precioProducto : this.precioProducto;
        this.parcialProducto = data.parcialProducto ? data.parcialProducto : this.parcialProducto;
        this.porcentajeDescuento = data.porcentajeDescuento ? data.porcentajeDescuento : this.porcentajeDescuento;
        this.detalleDescuento = data.detalleDescuento ? data.detalleDescuento : this.detalleDescuento;
        this.detalleSubtotal = data.detalleSubtotal ? data.detalleSubtotal : this.detalleSubtotal;
        this.codigoCP = data.codigoCP ? data.codigoCP : this.codigoCP;
        this.codigoCC = data.codigoCC ? data.codigoCC : this.codigoCC;
        this.gravaIva = data.gravaIva ? data.gravaIva : this.gravaIva;
        this.valorUltimaCompra = data.valorUltimaCompra ? data.valorUltimaCompra : this.valorUltimaCompra;
        this.detCantidadCaja = data.detCantidadCaja ? data.detCantidadCaja : this.detCantidadCaja;
        this.detEmpaque = data.detEmpaque ? data.detEmpaque : this.detEmpaque;
        this.detPresentacionUnidad = data.detPresentacionUnidad ? this.detPresentacionUnidad : this.detPresentacionUnidad;
        this.detPresentacionCaja = data.detPresentacionCaja ? data.detPresentacionCaja : this.detPresentacionCaja;
        this.detOtrosImpuestos = data.detOtrosImpuestos ? data.detOtrosImpuestos : this.detOtrosImpuestos;
        this.detIce = data.detIce ? data.detIce : this.detIce;
        this.detPrecio1 = data.detPrecio1 ? data.detPrecio1 : this.detPrecio1;
        this.detPrecio2 = data.detPrecio2 ? data.detPrecio2 : this.detPrecio2;
        this.detPrecio3 = data.detPrecio3 ? data.detPrecio3 : this.detPrecio3;
        this.detPrecio4 = data.detPrecio4 ? data.detPrecio4 : this.detPrecio4;
        this.detPrecio5 = data.detPrecio5 ? data.detPrecio5 : this.detPrecio5;
    }

}