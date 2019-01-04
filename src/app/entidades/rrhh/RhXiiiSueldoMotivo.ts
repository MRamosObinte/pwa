import { RhXiiiSueldoMotivoPK } from "./RhXiiiSueldoMotivoPK";
import { ConTipo } from "../contabilidad/ConTipo";

export class RhXiiiSueldoMotivo {
    rhXiiiSueldoMotivoPK: RhXiiiSueldoMotivoPK = new RhXiiiSueldoMotivoPK();
    motInactivo: boolean = false;
    conTipo: ConTipo = new ConTipo();
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.rhXiiiSueldoMotivoPK = data ? data.rhXiiiSueldoMotivoPK : this.rhXiiiSueldoMotivoPK;
        this.motInactivo = data ? data.motInactivo : this.motInactivo;
        this.conTipo = data ? data.conTipo : this.conTipo;
        this.usrEmpresa = data ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data ? data.usrFechaInserta : this.usrFechaInserta;
    }
}