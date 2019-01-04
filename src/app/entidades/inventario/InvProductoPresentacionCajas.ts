import { InvProducto } from "./InvProducto";
import { InvProductoPresentacionCajasPK } from "./InvProductoPresentacionCajasPK";

export class InvProductoPresentacionCajas {

    invProductoPresentacionCajasPK: InvProductoPresentacionCajasPK = new InvProductoPresentacionCajasPK();
    prescDetalle: String = null;
    prescAbreviado: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invProductoList: Array<InvProducto> = [];


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoPresentacionCajasPK = data.invProductoPresentacionCajasPK ? data.invProductoPresentacionCajasPK : this.invProductoPresentacionCajasPK;
        this.prescDetalle = data.prescDetalle ? data.prescDetalle : this.prescDetalle;
        this.prescAbreviado = data.prescAbreviado ? data.prescAbreviado : this.prescAbreviado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProductoList = data.invProductoList ? data.invProductoList : this.invProductoList;
    }
}