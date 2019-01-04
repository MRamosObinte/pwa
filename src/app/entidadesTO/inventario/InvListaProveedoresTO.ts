export class InvListaProveedoresTO {

    provCodigo: String = null;
    provId: String = null;
    provNombre: String = null;
    catDetalle: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.provId = data.provId ? data.provId : this.provId;
        this.provNombre = data.provNombre ? data.provNombre : this.provNombre;
        this.catDetalle = data.catDetalle ? data.catDetalle : this.catDetalle;
    }

}