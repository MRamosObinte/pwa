export class InvComprasRecepcionTO {
    recep_secuencial: number = null;
    recepFecha: string = "";
    compEmpresa: string = "";
    compPeriodo: string = "";
    compMotivo: string = "";
    compNumero: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.recep_secuencial = data.recep_secuencial ? data.recep_secuencial : this.recep_secuencial;
        this.recepFecha = data.recepFecha ? data.recepFecha : this.recepFecha;
        this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
        this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
        this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}