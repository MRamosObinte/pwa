export class InvTransferenciasMotivoPK {

    tmEmpresa: string = null;
    tmCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tmEmpresa = data.tmEmpresa ? data.tmEmpresa : this.tmEmpresa;
        this.tmCodigo = data.tmCodigo ? data.tmCodigo : this.tmCodigo;
    }
}