
export class PrdPreLiquidacionMotivoPKTO {

    plmEmpresa: string = "";
    plmCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {

        this.plmEmpresa = data.plmEmpresa ? data.plmEmpresa : this.plmEmpresa;
        this.plmCodigo = data.plmCodigo ? data.plmCodigo : this.plmCodigo;
    }
}