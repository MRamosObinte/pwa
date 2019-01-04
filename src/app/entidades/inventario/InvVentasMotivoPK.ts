export class InvVentasMotivoPK {

    vmEmpresa: String = null;
    vmCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vmEmpresa = data.vmEmpresa ? data.vmEmpresa : this.vmEmpresa;
        this.vmCodigo = data.vmCodigo ? data.vmCodigo : this.vmCodigo;
    }
}