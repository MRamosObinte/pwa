export class InvPedidosMotivoPK {
    
    pmEmpresa: String = "";
    pmCodigo: String = "";
    pmSector: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pmEmpresa = data.pmEmpresa ? data.pmEmpresa : this.pmEmpresa;
        this.pmCodigo = data.pmCodigo ? data.pmCodigo : this.pmCodigo;
        this.pmSector = data.pmSector ? data.pmSector : this.pmSector;
    }
}