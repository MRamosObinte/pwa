import { RhBonoMotivoPK } from "./RhBonoMotivoPK";
import { ConTipo } from "../contabilidad/ConTipo";

export class RhBonoMotivo {

    rhBonoMotivoPK: RhBonoMotivoPK = new RhBonoMotivoPK();
    motInactivo: boolean = false;
    conTipo: ConTipo = new ConTipo();
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.rhBonoMotivoPK = data.rhBonoMotivoPK ? data.rhBonoMotivoPK : this.rhBonoMotivoPK;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.motInactivo = data.motInactivo ? data.motInactivo : this.motInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}