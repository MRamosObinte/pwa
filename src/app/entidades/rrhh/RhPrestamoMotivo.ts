import { ConTipo } from "../contabilidad/ConTipo";
import { RhEmpleadoDescuentosFijos } from "./RhEmpleadoDescuentosFijos";
import { RhPrestamoMotivoPK } from "./RhPrestamoMotivoPK";

export class RhPrestamoMotivo {

    rhPrestamoMotivoPK: RhPrestamoMotivoPK = new RhPrestamoMotivoPK();
    motInactivo: boolean = false;
    conTipo: ConTipo = new ConTipo();
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date;
    rhEmpleadoDescuentosFijosList: Array<RhEmpleadoDescuentosFijos> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.rhPrestamoMotivoPK = data ? data.rhPrestamoMotivoPK : this.rhPrestamoMotivoPK;
        this.motInactivo = data ? data.motInactivo : this.motInactivo;
        this.conTipo = data ? data.conTipo : this.conTipo;
        this.usrEmpresa = data ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data ? data.usrFechaInserta : this.usrFechaInserta;
        this.rhEmpleadoDescuentosFijosList = data ? data.rhEmpleadoDescuentosFijosList : this.rhEmpleadoDescuentosFijosList;
    }
}