export class InvPedidosItemPK {
    iempresa: String = "";
    icodigo: String = "";
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.iempresa = data ? data.iempresa : this.iempresa;
        this.icodigo = data ? data.icodigo : this.icodigo;
    }
}