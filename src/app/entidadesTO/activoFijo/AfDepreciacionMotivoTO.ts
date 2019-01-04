import { ConTipoTO } from "../contabilidad/ConTipoTO";
import { AfUbicacionesTO } from "./AfUbicacionesTO";

export class AfDepreciacionMotivoTO {

    public motSecuencial: number = 0;
    public conTipo: ConTipoTO = new ConTipoTO;
    public usrEmpresa: string = "";
    public conTipoDescripcion: string = "";
    public afUbicacionDescripcion: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: Date = new Date();
    public afUbicaciones: AfUbicacionesTO = new AfUbicacionesTO();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.motSecuencial = data.motSecuencial ? data.motSecuencial : this.motSecuencial;
        this.conTipo = data.conTipo ? new ConTipoTO(data.conTipo) : this.conTipo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.conTipoDescripcion = data.conTipoDescripcion ? data.conTipoDescripcion : this.conTipoDescripcion;
        this.afUbicacionDescripcion = data.afUbicacionDescripcion ? data.afUbicacionDescripcion : this.afUbicacionDescripcion;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.afUbicaciones = data.afUbicaciones ? new AfUbicacionesTO(data.afUbicaciones) : this.afUbicaciones;
    }

}