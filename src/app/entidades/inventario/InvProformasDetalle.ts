import { InvProformas } from "./InvProformas";
import { InvProducto } from "./InvProducto";

export class InvProformasDetalle {

    detSecuencial: Number = 0;
    detOrden: Number = 0;
    detCantidad: Number = 0;
    detPrecio: Number = 0;
    detPorcentajeRecargo: Number = 0;
    detPorcentajeDescuento: Number = 0;
    proNombre: String = null;
    invProformas: InvProformas = new InvProformas();
    invProducto: InvProducto = new InvProducto();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.detPorcentajeRecargo = data.detPorcentajeRecargo ? data.detPorcentajeRecargo : this.detPorcentajeRecargo;
        this.detPorcentajeDescuento = data.detPorcentajeDescuento ? data.detPorcentajeDescuento : this.detPorcentajeDescuento;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.invProformas = data.invProformas ? data.invProformas : this.invProformas;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
    }
}