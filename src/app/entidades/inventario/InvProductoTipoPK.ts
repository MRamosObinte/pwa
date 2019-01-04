export class InvProductoTipoPK {

    tipEmpresa: String = null;
    tipCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tipEmpresa = data.tipEmpresa ? data.tipEmpresa : this.tipEmpresa;
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;


    }
}