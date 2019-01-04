import { InvPedidosMotivoDetalleRegistradoresTO } from "./InvPedidosMotivoDetalleRegistradoresTO";
import { InvPedidosMotivoDetalleAprobadoresTO } from "./InvPedidosMotivoDetalleAprobadoresTO";
import { InvPedidosMotivoDetalleEjecutoresTO } from "./InvPedidosMotivoDetalleEjecutoresTO";

export class InvPedidosConfiguracionTO {

    listRegistradores: Array<InvPedidosMotivoDetalleRegistradoresTO> = [];
    listAprobadores: Array<InvPedidosMotivoDetalleAprobadoresTO> = [];
    listEjecutores: Array<InvPedidosMotivoDetalleEjecutoresTO> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.listRegistradores = data.listRegistradores ? data.listRegistradores : this.listRegistradores;
        this.listAprobadores = data.listAprobadores ? data.listAprobadores : this.listRegistradores;
        this.listEjecutores = data.listEjecutores ? data.listEjecutores : this.listEjecutores;
    }

}