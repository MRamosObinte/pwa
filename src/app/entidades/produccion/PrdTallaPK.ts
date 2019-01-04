export class PrdTallaPK {
    
    tallaEmpresa: String = "";
    tallaCodigo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tallaEmpresa = data.tallaEmpresa ? data.tallaEmpresa : this.tallaEmpresa;
        this.tallaCodigo = data.tallaCodigo ? data.tallaCodigo : this.tallaCodigo;
    }

}