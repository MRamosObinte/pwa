import { InvProductoTipoDetalleCuentasPK } from "./InvProductoTipoDetalleCuentasPK";
import { InvProductoTipo } from "./InvProductoTipo";

export class InvProductoTipoDetalleCuentas {

    invProductoTipoDetalleCuentasPK: InvProductoTipoDetalleCuentasPK = new InvProductoTipoDetalleCuentasPK();
    pisEmpresa: String = null;
    pisSector: String = null;
    pisNumero: String = null;
    ctaEmpresa: String = null;
    ctaCodigo: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invProductoTipo: InvProductoTipo = new InvProductoTipo();


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoTipoDetalleCuentasPK = data.invProductoTipoDetalleCuentasPK ? data.invProductoTipoDetalleCuentasPK : this.invProductoTipoDetalleCuentasPK;
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProductoTipo = data.invProductoTipo ? data.invProductoTipo : this.invProductoTipo;
    }
}