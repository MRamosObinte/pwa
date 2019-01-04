import { InvTransferenciasNumeracionPK } from "./InvTransferenciasNumeracionPK";

export class InvTransferenciasNumeracion {

    invTransferenciasNumeracionPK: InvTransferenciasNumeracionPK = new InvTransferenciasNumeracionPK();
    numSecuencia: String = null;


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invTransferenciasNumeracionPK = data.invTransferenciasNumeracionPK ? data.invTransferenciasNumeracionPK : this.invTransferenciasNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}