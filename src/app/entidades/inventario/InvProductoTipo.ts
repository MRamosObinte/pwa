import { InvProducto } from "./InvProducto";
import { InvProductoTipoDetalleCuentas } from "./InvProductoTipoDetalleCuentas";
import { InvProductoTipoPK } from "./InvProductoTipoPK";

export class InvProductoTipo {

    invProductoTipoPK: InvProductoTipoPK = new InvProductoTipoPK();
    tipDetalle: String = null;
    tipTipo: String = null;
    tipActivo: boolean = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invProductoTipoDetalleCuentasList: Array<InvProductoTipoDetalleCuentas> = [];
    invProductoList: Array<InvProducto> = [];


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoTipoPK = data.invProductoTipoPK ? data.invProductoTipoPK : this.invProductoTipoPK;
        this.tipDetalle = data.tipDetalle ? data.tipDetalle : this.tipDetalle;
        this.tipTipo = data.tipTipo ? data.tipTipo : this.tipTipo;
        this.tipActivo = data.tipActivo ? data.tipActivo : this.tipActivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProductoTipoDetalleCuentasList = data.invProductoTipoDetalleCuentasList ? data.invProductoTipoDetalleCuentasList : this.invProductoTipoDetalleCuentasList;
        this.invProductoList = data.invProductoList ? data.invProductoList : this.invProductoList;
    }
}