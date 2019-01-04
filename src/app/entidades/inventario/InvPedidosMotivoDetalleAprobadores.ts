import { InvPedidosMotivo } from "./InvPedidosMotivo";
import { SisUsuario } from "../sistema/SisUsuario";

export class InvPedidosMotivoDetalleAprobadores {

    detSecuencial: Number = 0;
    invPedidosMotivo: InvPedidosMotivo = new InvPedidosMotivo();
    sisUsuario: SisUsuario = new SisUsuario();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.invPedidosMotivo = data.invPedidosMotivo ? data.invPedidosMotivo : this.invPedidosMotivo;
        this.sisUsuario = data.sisUsuario ? data.sisUsuario : this.sisUsuario;
    }
}