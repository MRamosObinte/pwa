export class InvListaConsultaConsumosTO {
    id: number = 0;
    consStatus: string = "";
    consNumero: string = "";
    consObservaciones: string = "";
    consFecha: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.consStatus = data.consStatus ? data.consStatus : this.consStatus;
        this.consNumero = data.consNumero ? data.consNumero : this.consNumero;
        this.consObservaciones = data.consObservaciones ? data.consObservaciones : this.consObservaciones;
        this.consFecha = data.consFecha ? data.consFecha : this.consFecha;
    }
}