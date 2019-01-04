export class InvVendedorPK {

    vendEmpresa: String = null;
    vendCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.vendEmpresa = data.vendEmpresa ? data.vendEmpresa : this.vendEmpresa;
        this.vendCodigo = data.vendCodigo ? data.vendCodigo : this.vendCodigo;
    }
}