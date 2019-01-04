import { InvPedidosItemPK } from "./InvPedidosItemPK";
import { InvPedidosItemMedida } from "./InvPedidosItemMedida";
import { InvProducto } from "./InvProducto";
import { InvPedidosItemCategoria } from "./InvPedidosItemCategoria";

export class InvPedidosItem {
    invPedidosItemPK: InvPedidosItemPK = new InvPedidosItemPK();
    idescripcion: String = "";
    iprecioReferencial: number = 0;
    iinactivo: boolean = false; 
    usrCodigo: String = "";
    usrFechaInserta: Date = null;
    invPedidosItemMedida: InvPedidosItemMedida = new InvPedidosItemMedida();
    invProducto: InvProducto = new InvProducto();
    invPedidosItemCategoria: InvPedidosItemCategoria = new InvPedidosItemCategoria();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invPedidosItemPK = data ? data.invPedidosItemPK : this.invPedidosItemPK;
        this.idescripcion = data ? data.idescripcion : this.idescripcion;
        this.iprecioReferencial = data ? data.iprecioReferencial : this.iprecioReferencial;
        this.iinactivo = data ? data.iinactivo : this.iinactivo;
        this.usrCodigo = data ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data ? data.usrFechaInserta : this.usrFechaInserta;
        this.invPedidosItemMedida = data ? data.invPedidosItemMedida : this.invPedidosItemMedida;
        this.invProducto = data ? data.invProducto : this.invProducto;
        this.invPedidosItemCategoria = data ? data.invPedidosItemCategoria : this.invPedidosItemCategoria;
    }
}