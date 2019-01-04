import { PrdPreLiquidacionNumeracionPK } from "./PrdPreLiquidacionNumeracionPK";

export class PrdPreLiquidacionNumeracion {

    prdPreLiquidacionNumeracionPK: PrdPreLiquidacionNumeracionPK = new PrdPreLiquidacionNumeracionPK();
    numSecuencia: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdPreLiquidacionNumeracionPK = data.PrdPreLiquidacionNumeracionPK ? new PrdPreLiquidacionNumeracionPK(data.PrdPreLiquidacionNumeracionPK) : this.prdPreLiquidacionNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }
}