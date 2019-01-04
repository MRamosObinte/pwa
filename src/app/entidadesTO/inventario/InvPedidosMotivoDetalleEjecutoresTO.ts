import { SisListaUsuarioTO } from '../sistema/SisListaUsuarioTO';
import { InvPedidosMotivoTO } from "./InvPedidosMotivoTO";
export class InvPedidosMotivoDetalleEjecutoresTO {

    detSecuencial: number;
    invPedidosMotivoTO: InvPedidosMotivoTO;
    usuario: SisListaUsuarioTO;
    activo: Boolean;

    constructor(data) {
        this.hydrate(data);
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.invPedidosMotivoTO = data.invPedidosMotivoTO ? new InvPedidosMotivoTO(data.invPedidosMotivoTO) : this.invPedidosMotivoTO;
        this.usuario = data.usuario ? new SisListaUsuarioTO(data.usuario) : this.usuario;
        this.activo = data.activo ? data.activo : this.activo;
    }
}