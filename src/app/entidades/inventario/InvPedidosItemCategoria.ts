import { InvPedidosItemCategoriaPK } from "./InvPedidosItemCategoriaPK";

export class InvPedidosItemCategoria {

    invPedidosItemCategoriaPK:InvPedidosItemCategoriaPK=new InvPedidosItemCategoriaPK();
    icatDescripcion:string="";
    icatInactivo:boolean=false;
    usrCodigo:string="";
    usrFechaInserta:Date=new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    } 

    hydrate(data) {
        this.invPedidosItemCategoriaPK = data.invPedidosItemCategoriaPK ? data.invPedidosItemCategoriaPK : this.invPedidosItemCategoriaPK;
        this.icatDescripcion = data.icatDescripcion ? data.icatDescripcion : this.icatDescripcion;
        this.icatInactivo = data.icatInactivo ? data.icatInactivo : this.icatInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}