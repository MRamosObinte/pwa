export class InvClienteCategoriaPK {

    ccEmpresa: string = null;
    ccCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ccEmpresa = data.ccEmpresa ? data.ccEmpresa : this.ccEmpresa;
        this.ccCodigo = data.ccCodigo ? data.ccCodigo : this.ccCodigo;
    }

}