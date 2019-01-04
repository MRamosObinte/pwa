import { InvPedidosItemMedidaPK } from "./InvPedidosItemMedidaPK";
import { InvPedidosItem } from "./InvPedidosItem";

export class InvPedidosItemMedida {

    medDescripcion: String = "";
    medInactivo: boolean = false;
    usrCodigo: String = "";
    usrFechaInserta: Date = null;
    invPedidosItemMedidaPK: InvPedidosItemMedidaPK = new InvPedidosItemMedidaPK();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.medDescripcion = data.medDescripcion ? data.medDescripcion : this.medDescripcion;
        this.medInactivo = data.medInactivo ? data.medInactivo : this.medInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invPedidosItemMedidaPK = data.invPedidosItemMedidaPK ? data.invPedidosItemMedidaPK : this.invPedidosItemMedidaPK;
    }
}