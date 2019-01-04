import { InvVendedorPK } from "./InvVendedorPK";
import { InvCliente } from "./InvCliente";

export class InvVendedor {

    invVendedorPK: InvVendedorPK = new InvVendedorPK();
    vendNombre: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invClienteList: Array<InvCliente> = [];


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invVendedorPK = data.invVendedorPK ? data.invVendedorPK : this.invVendedorPK;
        this.vendNombre = data.vendNombre ? data.vendNombre : this.vendNombre;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invClienteList = data.invClienteList ? data.invClienteList : this.invClienteList;
    }
}