export class InvProformasMotivoPK {

    pmEmpresa: String = null;
    pmCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.pmEmpresa = data.pmEmpresa ? data.pmEmpresa : this.pmEmpresa;
        this.pmCodigo = data.pmCodigo ? data.pmCodigo : this.pmCodigo;
    }
}