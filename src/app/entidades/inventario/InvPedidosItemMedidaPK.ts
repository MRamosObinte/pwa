export class InvPedidosItemMedidaPK {
    public medEmpresa: String = "";
    public medCodigo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.medEmpresa = data ? data.medEmpresa : this.medEmpresa;
        this.medCodigo = data ? data.medCodigo : this.medCodigo;
    }
}