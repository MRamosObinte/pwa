import { InvProformasNumeracionPK } from "./InvProformasNumeracionPK";

export class InvProformasNumeracion {

    invProformasNumeracionPK: InvProformasNumeracionPK = new InvProformasNumeracionPK();
    numSecuencia: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.invProformasNumeracionPK = data.invProformasNumeracionPK ? data.invProformasNumeracionPK : this.invProformasNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}