export class ConTipoPK {
    public tipCodigo: string = "";
    public tipEmpresa: string = "";
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tipCodigo = data ? data.tipCodigo : this.tipCodigo;
        this.tipEmpresa = data ? data.tipEmpresa : this.tipEmpresa;
    }
}