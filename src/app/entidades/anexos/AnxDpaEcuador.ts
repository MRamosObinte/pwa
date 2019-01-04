import { AnxDpaEcuadorPK } from "./AnxDpaEcuadorPK";

export class AnxDpaEcuador {

    anxDpaEcuadorPK: AnxDpaEcuadorPK = new AnxDpaEcuadorPK();
    nombreProvincia: String = "";
    nombreCanton: String = "";
    nombreParroquia: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anxDpaEcuadorPK = data.anxDpaEcuadorPK ? data.anxDpaEcuadorPK : this.anxDpaEcuadorPK;
        this.nombreProvincia = data.nombreProvincia ? data.nombreProvincia : this.nombreProvincia;
        this.nombreCanton = data.nombreCanton ? data.nombreCanton : this.nombreCanton;
        this.nombreParroquia = data.nombreParroquia ? data.nombreParroquia : this.nombreParroquia;
    }
}