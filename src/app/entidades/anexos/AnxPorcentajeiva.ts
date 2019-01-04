export class AnxPorcentajeiva {

    piCodigo: String = "";
    piPorcentaje: number = 0;
    piMontoMaximoConsumidorFinal: number = 0;
    piFechaInicio: Date = new Date();
    piFechaFin: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.piCodigo = data.piCodigo ? data.piCodigo : this.piCodigo;
        this.piPorcentaje = data.piPorcentaje ? data.piPorcentaje : this.piPorcentaje;
        this.piMontoMaximoConsumidorFinal = data.piMontoMaximoConsumidorFinal ? data.piMontoMaximoConsumidorFinal : this.piMontoMaximoConsumidorFinal;
        this.piFechaInicio = data.piFechaInicio ? data.piFechaInicio : this.piFechaInicio;
        this.piFechaFin = data.piFechaFin ? data.piFechaFin : this.piFechaFin;
    }
}