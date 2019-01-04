export class AnxDpaEcuadorPK {

    codigoProvincia: String = "";
    codigoCanton: String = "";
    codigoParroquia: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.codigoProvincia = data.codigoProvincia ? data.codigoProvincia : this.codigoProvincia;
        this.codigoCanton = data.codigoCanton ? data.codigoCanton : this.codigoCanton;
        this.codigoParroquia = data.codigoParroquia ? data.codigoParroquia : this.codigoParroquia;
    }
}