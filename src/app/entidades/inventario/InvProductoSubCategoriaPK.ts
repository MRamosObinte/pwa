export class InvProductoSubCategoriaPK {

    scatEmpresa: string = "";
    scatCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.scatEmpresa = data.scatEmpresa ? data.scatEmpresa : this.scatEmpresa;
        this.scatCodigo = data.scatCodigo ? data.scatCodigo : this.scatCodigo;
    }
}