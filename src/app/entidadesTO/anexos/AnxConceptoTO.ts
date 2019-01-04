export class AnxConceptoTO {

    conCodigo: string = "";
    conConcepto: string = "";
    conPorcentaje: number = 0;
    conIngresaPorcentaje: string = "";
    fechaInicio: Date;
    fechaFin: Date;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.conCodigo = data.conCodigo ? data.conCodigo : this.conCodigo;
        this.conConcepto = data.conConcepto ? data.conConcepto : this.conConcepto;
        this.conPorcentaje = data.conPorcentaje ? data.conPorcentaje : this.conPorcentaje;
        this.conIngresaPorcentaje = data.conIngresaPorcentaje ? data.conIngresaPorcentaje : this.conIngresaPorcentaje;
        this.fechaInicio = data.fechaInicio ? data.fechaInicio : this.fechaInicio;
        this.fechaFin = data.fechaFin ? data.fechaFin : this.fechaFin;
    }
}