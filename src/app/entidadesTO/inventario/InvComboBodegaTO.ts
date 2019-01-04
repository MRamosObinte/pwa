export class InvComboBodegaTO {

    bodCodigo: string = "";
    bodNombre: string = "";
    secCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bodCodigo = data.bodCodigo ? data.bodCodigo : this.bodCodigo;
        this.bodNombre = data.bodNombre ? data.bodNombre : this.bodNombre;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
    }
}