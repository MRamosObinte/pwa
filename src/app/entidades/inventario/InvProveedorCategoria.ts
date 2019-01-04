import { InvProveedorCategoriaPK } from "./InvProveedorCategoriaPK";
import { InvProveedor } from "./InvProveedor";

export class InvProveedorCategoria {

    pcAplicaRetencionIva: boolean = false;
    invProveedorCategoriaPK: InvProveedorCategoriaPK = new InvProveedorCategoriaPK();
    pcDetalle: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invProveedorList: Array<InvProveedor> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pcAplicaRetencionIva = data.pcAplicaRetencionIva ? data.pcAplicaRetencionIva : this.pcAplicaRetencionIva;
        this.invProveedorCategoriaPK = data.invProveedorCategoriaPK ? data.invProveedorCategoriaPK : this.invProveedorCategoriaPK;
        this.pcDetalle = data.pcDetalle ? data.pcDetalle : this.pcDetalle;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProveedorList = data.invProveedorList ? data.invProveedorList : this.invProveedorList;
    }
}