import { PrdCorrida } from "./PrdCorrida";

export class PrdCorridaDetalle {

    detSecuencia: number = 0;
    prdCorridaDestino: PrdCorrida = new PrdCorrida();
    prdCorridaOrigen: PrdCorrida = new PrdCorrida();
    detPorcentaje: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencia = data.detSecuencia ? data.detSecuencia : this.detSecuencia;
        this.prdCorridaDestino = data.prdCorridaDestino ? new PrdCorrida(data.prdCorridaDestino) : this.prdCorridaDestino;
        this.prdCorridaOrigen = data.prdCorridaOrigen ? new PrdCorrida(data.prdCorridaOrigen) : this.prdCorridaOrigen;
        this.detPorcentaje = data.detPorcentaje ? data.detPorcentaje : this.detPorcentaje;
    }

}