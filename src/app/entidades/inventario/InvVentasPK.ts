export class InvVentasPK {

    vtaEmpresa: String = null;
    vtaPeriodo: String = null;
    vtaMotivo: String = null;
    vtaNumero: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vtaEmpresa = data.vtaEmpresa ? data.vtaEmpresa : this.vtaEmpresa;
        this.vtaPeriodo = data.vtaPeriodo ? data.vtaPeriodo : this.vtaPeriodo;
        this.vtaMotivo = data.vtaMotivo ? data.vtaMotivo : this.vtaMotivo;
        this.vtaNumero = data.vtaNumero ? data.vtaNumero : this.vtaNumero;
    }
}