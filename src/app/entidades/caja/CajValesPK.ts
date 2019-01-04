export class CajValesPK {

    valeEmpresa: String = "";
    valePeriodo: String = "";
    valeMotivo: String = "";
    valeNumero: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.valeEmpresa = data.valeEmpresa ? data.valeEmpresa : this.valeEmpresa;
        this.valePeriodo = data.valePeriodo ? data.valePeriodo : this.valePeriodo;
        this.valeMotivo = data.valeMotivo ? data.valeMotivo : this.valeMotivo;
        this.valeNumero = data.valeNumero ? data.valeNumero : this.valeNumero;
    }

}