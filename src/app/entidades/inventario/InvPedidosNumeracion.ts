import { InvPedidosNumeracionPK } from "./InvPedidosNumeracionPK";

export class InvPedidosNumeracion {

    invPedidosNumeracionPK: InvPedidosNumeracionPK = new InvPedidosNumeracionPK(null);
    numSecuencia: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invPedidosNumeracionPK = data.invPedidosNumeracionPK ? data.invPedidosNumeracionPK : this.invPedidosNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}