import { InvClienteCategoriaPK } from "./InvClienteCategoriaPK";
import { InvCliente } from "./InvCliente";

export class InvClienteCategoria {

    invClienteCategoriaPK: InvClienteCategoriaPK = new InvClienteCategoriaPK();
    ccDetalle: string = null;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: string = null;
    invClienteList: InvCliente[] = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invClienteCategoriaPK = data.invClienteCategoriaPK ? data.invClienteCategoriaPK : this.invClienteCategoriaPK;
        this.ccDetalle = data.ccDetalle ? data.ccDetalle : this.ccDetalle;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invClienteList = data.invClienteList ? data.invClienteList : this.invClienteList;
    }

}