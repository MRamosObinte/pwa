import { InvProductoMedidaPK } from "./InvProductoMedidaPK";
import { InvProducto } from "./InvProducto";

export class InvProductoMedida {

    invProductoMedidaPK: InvProductoMedidaPK = new InvProductoMedidaPK();
    medDetalle: string = null;
    medConversionLibras: Number = 0;
    medConversionKilos: Number = 0;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: Date = null;
    invProductoList: Array<InvProducto> = [];


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProductoMedidaPK = data.invProductoMedidaPK ? data.invProductoMedidaPK : this.invProductoMedidaPK;
        this.medDetalle = data.medDetalle ? data.medDetalle : this.medDetalle;
        this.medConversionLibras = data.medConversionLibras ? data.medConversionLibras : this.medConversionLibras;
        this.medConversionKilos = data.medConversionKilos ? data.medConversionKilos : this.medConversionKilos;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProductoList = data.invProductoList ? data.invProductoList : this.invProductoList;
    }
}