import { PrdPresupuestoPescaMotivoTOPK } from "./PrdPresupuestoPescaMotivoTOPK";

export class PrdPresupuestoPescaMotivoTO {

    prdPresupuestoPescaMotivoPK: PrdPresupuestoPescaMotivoTOPK = new PrdPresupuestoPescaMotivoTOPK();
    presuDetalle: string = "";
    presuInactivo: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {

        this.prdPresupuestoPescaMotivoPK = data.prdPresupuestoPescaMotivoPK ? data.prdPresupuestoPescaMotivoPK : this.prdPresupuestoPescaMotivoPK;
        this.presuDetalle = data.presuDetalle ? data.presuDetalle : this.presuDetalle;
        this.presuInactivo = data.presuInactivo ? data.presuInactivo : this.presuInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}