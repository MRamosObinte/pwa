import { InvProformasMotivoPK } from "./InvProformasMotivoPK";

export class InvProformasMotivo {

    invProformasMotivoPK: InvProformasMotivoPK = new InvProformasMotivoPK();
    pmDetalle: String = null;
    pmInactivo: boolean = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProformasMotivoPK = data.invProformasMotivoPK ? data.invProformasMotivoPK : this.invProformasMotivoPK;
        this.pmDetalle = data.pmDetalle ? data.pmDetalle : this.pmDetalle;
        this.pmInactivo = data.pmInactivo ? data.pmInactivo : this.pmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}