export class PrdSectorPK {

    secEmpresa: string = "";
    secCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }


    hydrate(data) {
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
    }
    
}