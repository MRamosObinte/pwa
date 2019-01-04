export class RhListaRolSaldoEmpleadoDetalladoTO {
    id: number = 0;
    sedConcepto: string = null;
    sedDetalle: string = null;
    sedCp: string = null;
    sedCc: string = null;
    sedFecha: string = null;
    sedValor: number = null;
    sedObservaciones: string = null;
    sedContable: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.sedConcepto = data.sedConcepto ? data.sedConcepto : this.sedConcepto;
        this.sedDetalle = data.sedDetalle ? data.sedDetalle : this.sedDetalle;
        this.sedCp = data.sedCp ? data.sedCp : this.sedCp;
        this.sedCc = data.sedCc ? data.sedCc : this.sedCc;
        this.sedFecha = data.sedFecha ? data.sedFecha : this.sedFecha;
        this.sedValor = data.sedValor ? data.sedValor : this.sedValor;
        this.sedObservaciones = data.sedObservaciones ? data.sedObservaciones : this.sedObservaciones;
        this.sedContable = data.sedContable ? data.sedContable : this.sedContable;
    }

}