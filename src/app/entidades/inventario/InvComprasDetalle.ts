import { InvProducto } from "./InvProducto";
import { InvCompras } from "./InvCompras";
import { InvBodega } from "./InvBodega";

export class InvComprasDetalle {

    detSecuencial: number = 0;
    detOrden: number = 0;
    detPendiente: boolean = false;
    detConfirmado: boolean = false;
    detCantidad: number = 0;
    detPrecio: number = 0;
    detPorcentajeDescuento: number = 0;
    detIce: number = 0;
    detOtrosImpuestos: number = 0;
    detValorPromedio: number = 0;
    detValorUltimaCompra: number = 0;
    detSaldo: number = 0;
    proCreditoTributario: boolean = false;
    proPrecio1: number = 0;
    proPrecio2: number = 0;
    proPrecio3: number = 0;
    proPrecio4: number = 0;
    proPrecio5: number = 0;
    secEmpresa: string = null;
    secCodigo: string = null;
    pisEmpresa: string = null;
    pisSector: string = null;
    pisNumero: string = null;
    invProducto: InvProducto = new InvProducto();
    invCompras: InvCompras = new InvCompras();
    invBodega: InvBodega = new InvBodega();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detPendiente = data.detPendiente ? data.detPendiente : this.detPendiente;
        this.detConfirmado = data.detConfirmado ? data.detConfirmado : this.detConfirmado;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.detPorcentajeDescuento = data.detPorcentajeDescuento ? data.detPorcentajeDescuento : this.detPorcentajeDescuento;
        this.detIce = data.detIce ? data.detIce : this.detIce;
        this.detOtrosImpuestos = data.detOtrosImpuestos ? data.detOtrosImpuestos : this.detOtrosImpuestos;
        this.detValorPromedio = data.detValorPromedio ? data.detValorPromedio : this.detValorPromedio;
        this.detValorUltimaCompra = data.detValorUltimaCompra ? data.detValorUltimaCompra : this.detValorUltimaCompra;
        this.detSaldo = data.detSaldo ? data.detSaldo : this.detSaldo;
        this.proCreditoTributario = data.proCreditoTributario ? data.proCreditoTributario : this.proCreditoTributario;
        this.proPrecio1 = data.proPrecio1 ? data.proPrecio1 : this.proPrecio1;
        this.proPrecio2 = data.proPrecio2 ? data.proPrecio2 : this.proPrecio2;
        this.proPrecio3 = data.proPrecio3 ? data.proPrecio3 : this.proPrecio3;
        this.proPrecio4 = data.proPrecio4 ? data.proPrecio4 : this.proPrecio4;
        this.proPrecio5 = data.proPrecio5 ? data.proPrecio5 : this.proPrecio5;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.invProducto = data.invProducto ? new InvProducto(data.invProducto) : this.invProducto;
        this.invCompras = data.invCompras ? new InvCompras(data.invCompras) : this.invCompras;
        this.invBodega = data.invBodega ? new InvBodega(data.invCompras) : this.invBodega;
    }

}