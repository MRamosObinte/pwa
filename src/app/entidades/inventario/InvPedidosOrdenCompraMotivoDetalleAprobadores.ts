import { InvPedidosOrdenCompraMotivo } from "./InvPedidosOrdenCompraMotivo";

export class InvPedidosOrdenCompraMotivoDetalleAprobadores {
    detSecuencial: Number = 0;
    invPedidosOrdenCompraMotivo: InvPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
    usrCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.invPedidosOrdenCompraMotivo = data.invPedidosOrdenCompraMotivo ? data.invPedidosOrdenCompraMotivo : this.invPedidosOrdenCompraMotivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
    }
}