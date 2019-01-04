import { InvVentasRecepcionPK } from "./InvVentasRecepcionPK";
import { InvVentas } from "./InvVentas";

export class InvVentasRecepcion {

    invVentasRecepcionPK: InvVentasRecepcionPK = new InvVentasRecepcionPK();
    recepFecha: Date = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invVentas: InvVentas = new InvVentas();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invVentasRecepcionPK = data.invVentasRecepcionPK ? data.invVentasRecepcionPK : this.invVentasRecepcionPK;
        this.recepFecha = data.recepFecha ? data.recepFecha : this.recepFecha;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invVentas = data.invVentas ? data.invVentas : this.invVentas;
    }
}