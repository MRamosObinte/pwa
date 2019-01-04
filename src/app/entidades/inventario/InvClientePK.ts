export class InvClientePK {

    cliEmpresa: string = null;
    cliCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cliEmpresa = data.cliEmpresa ? data.cliEmpresa : this.cliEmpresa;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
    }

}