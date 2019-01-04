import { ConTipo } from "../contabilidad/ConTipo";
import { AfUbicaciones } from "./AfUbicaciones";

export class AfDepreciacionesMotivos {

    motSecuencial: number = 0;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    conTipo: ConTipo = new ConTipo();
    afUbicaciones: AfUbicaciones = new AfUbicaciones();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        data.motSecuencial = data.motSecuencial ? data.motSecuencial : this.motSecuencial;
        data.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        data.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        data.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        data.conTipo = data.conTipo ? new ConTipo(data.conTipo) : this.conTipo;
        data.afUbicaciones = data.afUbicaciones ? new AfUbicaciones(data.afUbicaciones) : this.afUbicaciones;
    }

}