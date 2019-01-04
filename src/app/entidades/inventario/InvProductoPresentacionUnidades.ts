import { InvProductoPresentacionUnidadesPK } from "./InvProductoPresentacionUnidadesPK";
import { InvProducto } from "./InvProducto";

export class InvProductoPresentacionUnidades {

    invProductoPresentacionUnidadesPK: InvProductoPresentacionUnidadesPK = new InvProductoPresentacionUnidadesPK();
    presuDetalle: String = null;
    presuAbreviado: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invProductoList: Array<InvProducto> = [];


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoPresentacionUnidadesPK = data.invProductoPresentacionUnidadesPK ? data.invProductoPresentacionUnidadesPK : this.invProductoPresentacionUnidadesPK;
        this.presuDetalle = data.presuDetalle ? data.presuDetalle : this.presuDetalle;
        this.presuAbreviado = data.presuAbreviado ? data.presuAbreviado : this.presuAbreviado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProductoList = data.invProductoList ? data.invProductoList : this.invProductoList;
    }
}