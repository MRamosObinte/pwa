
export class PrdLiquidacionMotivoTOPK {

    lmEmpresa: string = "";
    lmCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        
        this.lmEmpresa = data.lmEmpresa ? data.lmEmpresa : this.lmEmpresa;
        this.lmCodigo = data.lmCodigo ? data.lmCodigo : this.lmCodigo;
    }
}