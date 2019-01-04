import { InvProductoSubCategoriaPK } from "./InvProductoSubCategoriaPK";

export class InvProductoSubCategoria {

    scatDetalle: string = "";
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = null;
    invProductoSubcategoriaPK: InvProductoSubCategoriaPK = new InvProductoSubCategoriaPK();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoSubcategoriaPK = data.invProductoCategoriaPK ? data.invProductoCategoriaPK : this.invProductoSubcategoriaPK;
        this.scatDetalle = data.scatDetalle ? data.scatDetalle : this.scatDetalle;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}