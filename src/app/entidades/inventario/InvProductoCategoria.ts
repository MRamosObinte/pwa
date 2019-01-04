import { InvProducto } from "./InvProducto";
import { InvProductoCategoriaPK } from "./InvProductoCategoriaPK";
import { InvProductoSubCategoria } from "./InvProductoSubCategoria";

export class InvProductoCategoria {

    catPrecioFijo: boolean = false;
    catActiva: boolean = false;
    invProductoSubcategoria: InvProductoSubCategoria = new InvProductoSubCategoria();
    invProductoCategoriaPK: InvProductoCategoriaPK = new InvProductoCategoriaPK();
    catDetalle: string = "";
    ctaEmpresa: string = "";
    ctaCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = null;
    invProductoList: Array<InvProducto>;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.catPrecioFijo = data.catPrecioFijo ? data.catPrecioFijo : this.catPrecioFijo;
        this.catActiva = data.catActiva ? data.catActiva : this.catActiva;
        this.invProductoSubcategoria = data.invProductoSubcategoria ? data.invProductoSubcategoria : this.invProductoSubcategoria;
        this.invProductoCategoriaPK = data.invProductoCategoriaPK ? data.invProductoCategoriaPK : this.invProductoCategoriaPK;
        this.catDetalle = data.catDetalle ? data.catDetalle : this.catDetalle;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProductoList = data.invProductoList ? data.invProductoList : this.invProductoList;

    }
}