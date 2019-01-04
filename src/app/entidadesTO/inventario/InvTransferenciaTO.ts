export class InvTransferenciaTO {
    public id: number = 0;
    public transStatus: string = null;
    public transFecha: string = null;
    public transObservaciones: string = null;
    public transNumero: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.transStatus = data.transStatus ? data.transStatus : this.transStatus;
        this.transFecha = data.transFecha ? data.transFecha : this.transFecha;
        this.transObservaciones = data.transObservaciones ? data.transObservaciones : this.transObservaciones;
        this.transNumero = data.transNumero ? data.transNumero : this.transNumero;
    }
}