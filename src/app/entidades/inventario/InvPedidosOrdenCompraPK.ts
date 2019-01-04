export class InvPedidosOrdenCompraPK {

    ocEmpresa: string = "";
    ocSector: string = "";
    ocMotivo: string = "";
    ocNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ocEmpresa = data.ocEmpresa ? data.ocEmpresa : this.ocEmpresa;
        this.ocSector = data.ocSector ? data.ocSector : this.ocSector;
        this.ocMotivo = data.ocMotivo ? data.ocMotivo : this.ocMotivo;
        this.ocNumero = data.ocNumero ? data.ocNumero : this.ocNumero;
    }

    toString(): string {
        return this.ocEmpresa + "|" + this.ocSector + "|" + this.ocMotivo + "|" + this.ocNumero;
    }

}