import { ConTipo } from "../contabilidad/ConTipo";
import { RhUtilidadMotivoPK } from "./RhUtilidadMotivoPK";

export class RhUtilidadMotivo {
    rhUtilidadMotivoPK: RhUtilidadMotivoPK = new RhUtilidadMotivoPK();
    conTipo: ConTipo = null;
    motInactivo: boolean = false;
    usrCodigo: string = null;
    usrEmpresa: string = null;
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rhUtilidadMotivoPK = data.rhUtilidadMotivoPK ? data.rhUtilidadMotivoPK : this.rhUtilidadMotivoPK;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.motInactivo = data.motInactivo ? data.motInactivo : this.motInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}