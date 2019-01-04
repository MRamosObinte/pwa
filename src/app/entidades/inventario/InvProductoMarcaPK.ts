export class InvProductoMarcaPK {

    marEmpresa: String = null;
    marCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.marEmpresa = data.marEmpresa ? data.marEmpresa : this.marEmpresa;
        this.marCodigo = data.marCodigo ? data.marCodigo : this.marCodigo;
    }
}