import { InvVentas } from "./InvVentas";
import { InvProducto } from "./InvProducto";
import { InvBodega } from "./InvBodega";

export class InvVentasDetalle {
    detSecuencial: Number = 0;
    detOrden: Number = 0;
    detPendiente: boolean = false;
    detCantidad: Number = 0;
    detPrecio: Number = 0;
    detPorcentajeRecargo: Number = 0;
    detPorcentajeDescuento: Number = 0;
    detValorPromedio: Number = 0;
    detValorUltimaCompra: Number = 0;
    detSaldo: Number = 0;
    proNombre: String = null;
    proCreditoTributario: boolean = false;
    secEmpresa: String = null;
    secCodigo: String = null;
    pisEmpresa: String = null;
    pisSector: String = null;
    pisNumero: String = null;
    invVentas: InvVentas = new InvVentas();
    invProducto: InvProducto = new InvProducto();
    invBodega: InvBodega = new InvBodega();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detPendiente = data.detPendiente ? data.detPendiente : this.detPendiente;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.detPorcentajeRecargo = data.detPorcentajeRecargo ? data.detPorcentajeRecargo : this.detPorcentajeRecargo;
        this.detPorcentajeDescuento = data.detPorcentajeDescuento ? data.detPorcentajeDescuento : this.detPorcentajeDescuento;
        this.detValorPromedio = data.detValorPromedio ? data.detValorPromedio : this.detValorPromedio;
        this.detValorUltimaCompra = data.detValorUltimaCompra ? data.detValorUltimaCompra : this.detValorUltimaCompra;
        this.detSaldo = data.detSaldo ? data.detSaldo : this.detSaldo;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.proCreditoTributario = data.proCreditoTributario ? data.proCreditoTributario : this.proCreditoTributario;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.invVentas = data.invVentas ? data.invVentas : this.invVentas;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;
    }
}