import { RhAnticipoMotivoPK } from "./RhAnticipoMotivoPK";
import { RhEmpleadoDescuentosFijos } from "./RhEmpleadoDescuentosFijos";
import { ConTipo } from "../contabilidad/ConTipo";

export class RhAnticipoMotivo {
    rhAnticipoMotivoPK: RhAnticipoMotivoPK = new RhAnticipoMotivoPK();
    motInactivo: boolean = false;
    conTipo: ConTipo = new ConTipo();
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    rhEmpleadoDescuentosFijosList: Array<RhEmpleadoDescuentosFijos> = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.rhAnticipoMotivoPK = data.rhAnticipoMotivoPK ? data.rhAnticipoMotivoPK : this.rhAnticipoMotivoPK;
        this.motInactivo = data.motInactivo ? data.motInactivo : this.motInactivo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.rhEmpleadoDescuentosFijosList = data.rhEmpleadoDescuentosFijosList ? data.rhEmpleadoDescuentosFijosList : this.rhEmpleadoDescuentosFijosList;

    }
}