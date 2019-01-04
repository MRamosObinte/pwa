export class InvPedidosPK {

    pedEmpresa: String = "";
    pedMotivo: String = "";
    pedNumero: String = null;
    pedSector: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pedEmpresa = data.pedEmpresa ? data.pedEmpresa : this.pedEmpresa;
        this.pedMotivo = data.pedMotivo ? data.pedMotivo : this.pedMotivo;
        this.pedNumero = data.pedNumero ? data.pedNumero : this.pedNumero;
        this.pedSector = data.pedSector ? data.pedSector : this.pedSector;
    }
}