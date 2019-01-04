export class PrdPresupuestoPescaPK {

    presuEmpresa: String = "";
    presuMotivo: String = "";
    presuNumero: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.presuEmpresa = data.presuEmpresa ? data.presuEmpresa : this.presuEmpresa;
        this.presuMotivo = data.presuMotivo ? data.presuMotivo : this.presuMotivo;
        this.presuNumero = data.presuNumero ? data.presuNumero : this.presuNumero;
    }

}