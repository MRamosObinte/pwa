export class InvTransferenciasPK {

    transEmpresa: String = null;
    transPeriodo: String = null;
    transMotivo: String = null;
    transNumero: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.transEmpresa = data.transEmpresa ? data.transEmpresa : this.transEmpresa;
        this.transPeriodo = data.transPeriodo ? data.transPeriodo : this.transPeriodo;
        this.transMotivo = data.transMotivo ? data.transMotivo : this.transMotivo;
        this.transNumero = data.transNumero ? data.transNumero : this.transNumero;
    }

}