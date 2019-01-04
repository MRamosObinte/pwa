export class PrdPresupuestoPescaMotivoPK {

    presuEmpresa: String = "";
    presuCodigo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.presuEmpresa = data.presuEmpresa ? data.presuEmpresa : this.presuEmpresa;
        this.presuCodigo = data.presuCodigo ? data.presuCodigo : this.presuCodigo;
    }
    
}