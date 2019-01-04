import { InvProductoMarcaPK } from "./InvProductoMarcaPK";
import { InvProducto } from "./InvProducto";

export class InvProductoMarca {

    invProductoMarcaPK: InvProductoMarcaPK = new InvProductoMarcaPK();
    marDetalle: String = null;
    marAbreviado: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invProductoList: Array<InvProducto> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoMarcaPK = data.invProductoMarcaPK ? data.invProductoMarcaPK : this.invProductoMarcaPK
        this.marDetalle = data.marDetalle ? data.marDetalle : this.marDetalle
        this.marAbreviado = data.marAbreviado ? data.marAbreviado : this.marAbreviado
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta
        this.invProductoList = data.invProductoList ? data.invProductoList : this.invProductoList

    }
}