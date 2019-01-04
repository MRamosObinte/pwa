import { InvTransferenciasMotivoPK } from "./InvTransferenciasMotivoPK";

export class InvTransferenciasMotivo {

    invTransferenciasMotivoPK: InvTransferenciasMotivoPK = new InvTransferenciasMotivoPK();
    tmDetalle: String = null;
    tmInactivo: boolean = false;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invTransferenciasMotivoPK = data.invTransferenciasMotivoPK ? data.invTransferenciasMotivoPK : this.invTransferenciasMotivoPK;
        this.tmDetalle = data.tmDetalle ? data.tmDetalle : this.tmDetalle;
        this.tmInactivo = data.tmInactivo ? data.tmInactivo : this.tmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}