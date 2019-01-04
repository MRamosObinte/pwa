export class InvFunConsumosTO {
    id: number = null;
    compNumeroSistema: string = "";
    compFecha: string = "";
    compObservaciones: string = "";
    compPendiente: boolean = false;
    compAnulado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.compNumeroSistema = data.compNumeroSistema ? data.compNumeroSistema : this.compNumeroSistema;
        this.compFecha = data.compFecha ? data.compFecha : this.compFecha;
        this.compObservaciones = data.compObservaciones ? data.compObservaciones : this.compObservaciones;
        this.compPendiente = data.compPendiente ? data.compPendiente : this.compPendiente;
        this.compAnulado = data.compAnulado ? data.compAnulado : this.compAnulado;
    }
}