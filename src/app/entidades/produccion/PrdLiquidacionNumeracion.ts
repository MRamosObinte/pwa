import { PrdLiquidacionNumeracionPK } from "./PrdLiquidacionNumeracionPK";

export class PrdLiquidacionNumeracion {

    prdLiquidacionNumeracionPK: PrdLiquidacionNumeracionPK = new PrdLiquidacionNumeracionPK();
    numSecuencia: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdLiquidacionNumeracionPK = data.prdLiquidacionNumeracionPK ? new PrdLiquidacionNumeracionPK(data.prdLiquidacionNumeracionPK) : this.prdLiquidacionNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }

}