export class AnxProvinciasPK {

    provinciaCodigo: String = "";
    cantonCodigo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.provinciaCodigo = data.provinciaCodigo ? data.provinciaCodigo : this.provinciaCodigo;
        this.cantonCodigo = data.cantonCodigo ? data.cantonCodigo : this.cantonCodigo;
    }
}