import { PrdPresupuestoPescaMotivoPK } from "./PrdPresupuestoPescaMotivoPK";

export class PrdPresupuestoPescaMotivo {

    prdPresupuestoPescaMotivoPK: PrdPresupuestoPescaMotivoPK = new PrdPresupuestoPescaMotivoPK();
    presuDetalle: String = "";
    presuInactivo: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdPresupuestoPescaMotivoPK = data.prdPresupuestoPescaMotivoPK ? new PrdPresupuestoPescaMotivoPK(data.prdPresupuestoPescaMotivoPK) : this.prdPresupuestoPescaMotivoPK;
        this.presuDetalle = data.presuDetalle ? data.presuDetalle : this.presuDetalle;
        this.presuInactivo = data.presuInactivo ? data.presuInactivo : this.presuInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}