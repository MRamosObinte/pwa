import { InvPedidosOrdenCompraMotivo } from "../../entidades/inventario/InvPedidosOrdenCompraMotivo";
import { SisListaUsuarioTO } from "../sistema/SisListaUsuarioTO";

export class InvOrdenCompraMotivoDetalleAprobadoresTO {
    detSecuencial: number;
    invPedidosOrdenCompraMotivo: InvPedidosOrdenCompraMotivo;
    usuario: SisListaUsuarioTO;
    activo: boolean;

    constructor(data) {
        this.hydrate(data);
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.invPedidosOrdenCompraMotivo = data.invPedidosOrdenCompraMotivo ? new InvPedidosOrdenCompraMotivo(data.invPedidosOrdenCompraMotivo) : this.invPedidosOrdenCompraMotivo;
        this.usuario = data.usuario ? new SisListaUsuarioTO(data.usuario) : this.usuario;
        this.activo = data.activo ? data.activo : this.activo;
    }
}