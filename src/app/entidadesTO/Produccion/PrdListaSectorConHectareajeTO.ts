
export class PrdListaSectorConHectareajeTO {
    bodCodigo: string = null;
    bodNombre: string = null;
    secCodigo: string = null;
    secHectareaje: number = null;
    secNombre: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bodCodigo = data.bodCodigo ? data.bodCodigo : this.bodCodigo;
        this.bodNombre = data.bodNombre ? data.bodNombre : this.bodNombre;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.secHectareaje = data.secHectareaje ? data.secHectareaje : this.secHectareaje;
        this.secNombre = data.secNombre ? data.secNombre : this.secNombre;
    }
}