export class InvConsumosPK {
    consEmpresa: string = null;
    consPeriodo: string = null;
    consMotivo: string = null;
    consNumero: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.consEmpresa = data.consEmpresa ? data.consEmpresa : this.consEmpresa;
        this.consPeriodo = data.consPeriodo ? data.consPeriodo : this.consPeriodo;
        this.consMotivo = data.consMotivo ? data.consMotivo : this.consMotivo;
        this.consNumero = data.consNumero ? data.consNumero : this.consNumero;
    }

}