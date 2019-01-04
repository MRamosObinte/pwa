export class InvPedidosOrdenCompraMotivoPK {

    ocmEmpresa: string = "";
    ocmSector: string = "";
    ocmCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ocmEmpresa = data.ocmEmpresa ? data.ocmEmpresa : this.ocmEmpresa;
        this.ocmSector = data.ocmSector ? data.ocmSector : this.ocmSector;
        this.ocmCodigo = data.ocmCodigo ? data.ocmCodigo : this.ocmCodigo;
    }
}