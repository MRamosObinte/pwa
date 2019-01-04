export class SisGrupoPK {

    gruEmpresa: string = "";
    gruCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.gruEmpresa = data.gruEmpresa ? data.gruEmpresa : this.gruEmpresa;
        this.gruCodigo = data.gruCodigo ? data.gruCodigo : this.gruCodigo;
    }
    
}