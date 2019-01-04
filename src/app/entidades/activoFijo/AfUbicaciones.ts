import { AfUbicacionesPK } from "./AfUbicacionesPK";
import { AfActivos } from "./AfActivos";
import { AfDepreciacionesMotivos } from "./AfDepreciacionesMotivos";

export class AfUbicaciones {

    afUbicacionesPK: AfUbicacionesPK = new AfUbicacionesPK();
    ubiDescripcion: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date ();
    afActivosList: Array<AfActivos> = [];
    afDepreciacionesMotivos: AfDepreciacionesMotivos = new AfDepreciacionesMotivos();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.afUbicacionesPK = data.afUbicacionesPK ? new AfUbicacionesPK(data.afUbicacionesPK) : this.afUbicacionesPK;
        this.ubiDescripcion = data.ubiDescripcion ? data.ubiDescripcion : this.ubiDescripcion;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.afActivosList = data.afActivosList ? data.afActivosList : this.afActivosList;
        this.afDepreciacionesMotivos = data.afDepreciacionesMotivos ? new AfDepreciacionesMotivos(data.afDepreciacionesMotivos) : this.afDepreciacionesMotivos;







    }
}