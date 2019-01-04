export class AnxUrlWebServices {

    urlSecuencial: number = 0;
    urlAmbienteProduccion: String = "";
    urlAmbientePruebas: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.urlSecuencial = data.urlSecuencial ? data.urlSecuencial : this.urlSecuencial;
        this.urlAmbienteProduccion = data.urlAmbienteProduccion ? data.urlAmbienteProduccion : this.urlAmbienteProduccion;
        this.urlAmbientePruebas = data.urlAmbientePruebas ? data.urlAmbientePruebas : this.urlAmbientePruebas;
    }
}