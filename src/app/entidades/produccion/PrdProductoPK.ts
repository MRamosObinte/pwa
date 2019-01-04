export class PrdProductoPK {

    prodEmpresa: string = "";
    prodCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.prodEmpresa = data.prodEmpresa ? data.prodEmpresa : this.prodEmpresa;
        this.prodCodigo = data.prodCodigo ? data.prodCodigo : this.prodCodigo;      
    }
}