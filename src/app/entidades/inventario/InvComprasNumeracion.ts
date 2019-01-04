import { InvComprasNumeracionPK } from "./InvComprasNumeracionPK";

export class InvComprasNumeracion {
    invComprasNumeracionPK: InvComprasNumeracionPK = new InvComprasNumeracionPK();
    numSecuencia: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.invComprasNumeracionPK = data.invComprasNumeracionPK ? data.invComprasNumeracionPK : this.invComprasNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}