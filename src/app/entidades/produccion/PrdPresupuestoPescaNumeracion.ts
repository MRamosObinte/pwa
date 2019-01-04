import { PrdPresupuestoPescaNumeracionPK } from "./PrdPresupuestoPescaNumeracionPK";

export class PrdPresupuestoPescaNumeracion {

    prdPresupuestoPescaNumeracionPK: PrdPresupuestoPescaNumeracionPK = new PrdPresupuestoPescaNumeracionPK();
    numSecuencia: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdPresupuestoPescaNumeracionPK = data.prdPresupuestoPescaNumeracionPK ? new PrdPresupuestoPescaNumeracionPK(data.prdPresupuestoPescaNumeracionPK) : this.prdPresupuestoPescaNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
    
}