import { RhRolMotivoPK } from "./RhRolMotivoPK";
import { ConTipo } from "../contabilidad/ConTipo";

export class RhRolMotivo {

    rhRolMotivoPK: RhRolMotivoPK = new RhRolMotivoPK();
    motInactivo: boolean = false;
    conTipo: ConTipo = new ConTipo();
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rhRolMotivoPK = data ? data.rhRolMotivoPK : this.rhRolMotivoPK;
        this.motInactivo = data ? data.motInactivo : this.motInactivo;
        this.conTipo = data ? data.conTipo : this.conTipo;
        this.usrEmpresa = data ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data ? data.usrFechaInserta : this.usrFechaInserta;
    }
}