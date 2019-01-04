import { InvVentasMotivoPK } from "./InvVentasMotivoPK";

export class InvVentasMotivo {

    invVentasMotivoPK: InvVentasMotivoPK = new InvVentasMotivoPK();
    vmDetalle: String = null;
    vmFormaContabilizar: String = null;
    vmFormaImprimir: String = null;
    vmInactivo: boolean = false;
    tipEmpresa: String = null;
    tipCodigo: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invVentasMotivoPK = data.invVentasMotivoPK ? data.invVentasMotivoPK : this.invVentasMotivoPK;
        this.vmDetalle = data.vmDetalle ? data.vmDetalle : this.vmDetalle;
        this.vmFormaContabilizar = data.vmFormaContabilizar ? data.vmFormaContabilizar : this.vmFormaContabilizar;
        this.vmFormaImprimir = data.vmFormaImprimir ? data.vmFormaImprimir : this.vmFormaImprimir;
        this.vmInactivo = data.vmInactivo ? data.vmInactivo : this.vmInactivo;
        this.tipEmpresa = data.tipEmpresa ? data.tipEmpresa : this.tipEmpresa;
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}