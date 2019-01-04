export class InvComprasPK {
    compEmpresa: string = null;
    compPeriodo: string = null;
    compMotivo: string = null;
    compNumero: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
        this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
        this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
    }

}