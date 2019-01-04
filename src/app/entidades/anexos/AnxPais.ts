export class AnxPais {

    paisCodigo: String = "";
    paisNombre: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.paisCodigo = data.paisCodigo ? data.paisCodigo : this.paisCodigo;
        this.paisNombre = data.paisNombre ? data.paisNombre : this.paisNombre;
    }
}