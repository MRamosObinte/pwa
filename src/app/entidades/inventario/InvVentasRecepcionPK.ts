export class InvVentasRecepcionPK {

    recepEmpresa: String = null;
    recepPeriodo: String = null;
    recepMotivo: String = null;
    recepNumero: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.recepEmpresa = data.recepEmpresa ? data.recepEmpresa : this.recepEmpresa;
        this.recepPeriodo = data.recepPeriodo ? data.recepPeriodo : this.recepPeriodo;
        this.recepMotivo = data.recepMotivo ? data.recepMotivo : this.recepMotivo;
        this.recepNumero = data.recepNumero ? data.recepNumero : this.recepNumero;
    }
}