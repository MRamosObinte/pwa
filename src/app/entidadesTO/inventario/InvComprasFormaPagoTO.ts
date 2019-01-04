export class InvComprasFormaPagoTO {
    public fpSecuencial: number = null;
    public fpDetalle: string = null;
    public fpInactivo: boolean = false;
    public secCodigo: string = null;
    public ctaCodigo: string = null;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
        this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}