export class AnxConceptoComboTO {

    conCodigo: string = null;
    conConcepto: string = null;
    conPorcentaje: number = 0;
    conIngresaPorcentaje: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.conCodigo = data.conCodigo ? data.conCodigo : this.conCodigo;
        this.conConcepto = data.conConcepto ? data.conConcepto : this.conConcepto;
        this.conPorcentaje = data.conPorcentaje ? data.conPorcentaje : this.conPorcentaje;
        this.conIngresaPorcentaje = data.conIngresaPorcentaje ? data.conIngresaPorcentaje : this.conIngresaPorcentaje;
    }
}