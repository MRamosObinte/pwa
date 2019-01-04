export class PrdLiquidacionMotivoPK {

    lmEmpresa: String = "";
    lmCodigo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.lmCodigo = data.lmCodigo ? data.lmCodigo : this.lmCodigo;
        this.lmEmpresa = data.lmEmpresa ? data.lmEmpresa : this.lmEmpresa;
    }

}