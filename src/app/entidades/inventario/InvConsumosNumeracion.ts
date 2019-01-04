import { InvConsumosNumeracionPK } from "./InvConsumosNumeracionPK";

export class InvConsumosNumeracion {

    invConsumosNumeracionPK: InvConsumosNumeracionPK = new InvConsumosNumeracionPK();
    numSecuencia: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invConsumosNumeracionPK = data.invConsumosNumeracionPK ? data.invConsumosNumeracionPK : this.invConsumosNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}