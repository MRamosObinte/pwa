import { InvCompras } from "./InvCompras";

export class InvComprasRecepcion {
    recep_secuencial: number = 0;
    recepFecha: Date = null;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: Date = null;
    invCompras: InvCompras = new InvCompras();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.recep_secuencial = data.recep_secuencial ? data.recep_secuencial : this.recep_secuencial;
        this.recepFecha = data.recepFecha ? data.recepFecha : this.recepFecha;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invCompras = data.invCompras ? data.invCompras : this.invCompras;
    }

}