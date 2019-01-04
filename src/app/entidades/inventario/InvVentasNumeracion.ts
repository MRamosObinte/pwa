import { InvVentasNumeracionPK } from "./InvVentasNumeracionPK";

export class InvVentasNumeracion {

     invVentasNumeracionPK: InvVentasNumeracionPK = new InvVentasNumeracionPK();
     numSecuencia: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.invVentasNumeracionPK = data.invVentasNumeracionPK ? data.invVentasNumeracionPK : this.invVentasNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}