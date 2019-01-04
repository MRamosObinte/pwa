export class AnxUrlWebServicesTO {

    urlSecuencial: number = 1;
    urlAmbienteProduccion: String = "";
    urlAmbientePruebas: String = "";
    usrCodigo: String = null;
    usrEmpresa: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.urlSecuencial = data.urlSecuencial ? data.urlSecuencial : this.urlSecuencial;
        this.urlAmbienteProduccion = data.urlAmbienteProduccion ? data.urlAmbienteProduccion : this.urlAmbienteProduccion;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
    }
}