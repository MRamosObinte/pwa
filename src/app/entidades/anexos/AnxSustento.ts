import { AnxCompra } from "./AnxCompra";

export class AnxSustento {

    susCodigo: String = "";
    susDescripcion: String = "";
    susComprobante: String = "";
    anxCompraList: Array<AnxCompra> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.susCodigo = data.susCodigo ? data.susCodigo : this.susCodigo;
        this.susDescripcion = data.susDescripcion ? data.susDescripcion : this.susDescripcion;
        this.susComprobante = data.susComprobante ? data.susComprobante : this.susComprobante;
        this.anxCompraList = data.anxCompraList ? data.anxCompraList : this.anxCompraList;
    }
}