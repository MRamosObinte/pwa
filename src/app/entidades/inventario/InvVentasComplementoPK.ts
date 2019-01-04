export class InvVentasComplementoPK {
    comEmpresa: String = null;
    comPeriodo: String = null;
    comMotivo: String = null;
    comNumero: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.comEmpresa = data.comEmpresa ? data.comEmpresa : this.comEmpresa;
        this.comPeriodo = data.comPeriodo ? data.comPeriodo : this.comPeriodo;
        this.comMotivo = data.comMotivo ? data.comMotivo : this.comMotivo;
        this.comNumero = data.comNumero ? data.comNumero : this.comNumero;
    }
}