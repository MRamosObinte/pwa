export class RhListaSaldoIndividualAnticiposPrestamosTO {
    id: number = null;
    siapTipo: string = null;
    siapFecha: string = null;
    siapObservaciones: string = null;
    siapDebitos: number = 0;
    siapCreditos: number = 0;
    siapSaldo: number = 0;
    siapContable: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.siapTipo = data.siapTipo ? data.siapTipo : this.siapTipo;
        this.siapFecha = data.siapFecha ? data.siapFecha : this.siapFecha;
        this.siapObservaciones = data.siapObservaciones ? data.siapObservaciones : this.siapObservaciones;
        this.siapDebitos = data.siapDebitos ? data.siapDebitos : this.siapDebitos;
        this.siapCreditos = data.siapCreditos ? data.siapCreditos : this.siapCreditos;
        this.siapSaldo = data.siapSaldo ? data.siapSaldo : this.siapSaldo;
        this.siapContable = data.siapContable ? data.siapContable : this.siapContable;
    }
}