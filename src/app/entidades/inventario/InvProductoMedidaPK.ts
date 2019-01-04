export class InvProductoMedidaPK {

    medEmpresa: string = null;
    medCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.medEmpresa = data.medEmpresa ? data.medEmpresa : this.medEmpresa;
        this.medCodigo = data.medCodigo ? data.medCodigo : this.medCodigo;
    }
}