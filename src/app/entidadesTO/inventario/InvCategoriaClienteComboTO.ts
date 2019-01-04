export class InvCategoriaClienteComboTO {

    ccCodigo : string = "";
	ccDetalle : string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ccCodigo = data.pcCodigo ? data.pcCodigo : this.ccCodigo;
        this.ccDetalle = data.pcDetalle ? data.pcDetalle : this.ccDetalle;
    }

}