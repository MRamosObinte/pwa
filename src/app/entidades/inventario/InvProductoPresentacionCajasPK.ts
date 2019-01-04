export class InvProductoPresentacionCajasPK {

    prescEmpresa: String = null;
    prescCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prescEmpresa = data.prescEmpresa ? data.prescEmpresa : this.prescEmpresa;
        this.prescCodigo = data.prescCodigo ? data.prescCodigo : this.prescCodigo;
    }
}