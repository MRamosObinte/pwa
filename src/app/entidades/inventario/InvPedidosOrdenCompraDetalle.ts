import { InvPedidosDetalle } from "./InvPedidosDetalle";
import { InvPedidosOrdenCompra } from "./InvPedidosOrdenCompra";

export class InvPedidosOrdenCompraDetalle {
    
    detSecuencialOrdenCompra: number = 0;
    detOrden: number = 0;
    detCantidad: number = 0;
    detPrecioReferencial: number = 0;
    detPrecioReal: number = 0;
    detObservaciones: string = "";
    invPedidosDetalle: InvPedidosDetalle = new InvPedidosDetalle();
    invPedidosOrdenCompra: InvPedidosOrdenCompra = new InvPedidosOrdenCompra();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencialOrdenCompra = data.detSecuencialOrdenCompra ? data.detSecuencialOrdenCompra : this.detSecuencialOrdenCompra;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecioReferencial = data.detPrecioReferencial ? data.detPrecioReferencial : this.detPrecioReferencial;
        this.detPrecioReal = data.detPrecioReal ? data.detPrecioReal : this.detPrecioReal;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.invPedidosDetalle = data.invPedidosDetalle ? data.invPedidosDetalle : this.invPedidosDetalle;
        this.invPedidosOrdenCompra = data.invPedidosOrdenCompra ? data.invPedidosOrdenCompra : this.invPedidosOrdenCompra;
    }
}