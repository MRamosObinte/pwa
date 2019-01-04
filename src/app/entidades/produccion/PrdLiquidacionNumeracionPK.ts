export class PrdLiquidacionNumeracionPK {

    numEmpresa: String = "";
    numMotivo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.numEmpresa = data.numEmpresa ? data.numEmpresa : this.numEmpresa;
        this.numMotivo = data.numMotivo ? data.numMotivo : this.numMotivo;

    }
}