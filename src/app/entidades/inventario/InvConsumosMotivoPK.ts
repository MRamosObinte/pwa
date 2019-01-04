export class InvConsumosMotivoPK {
    cmEmpresa: String = null;
    cmCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cmEmpresa = data.cmEmpresa ? data.cmEmpresa : this.cmEmpresa;
        this.cmCodigo = data.cmCodigo ? data.cmCodigo : this.cmCodigo;
    }
}