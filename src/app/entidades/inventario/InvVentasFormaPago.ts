export class InvVentasFormaPago {

    fpSecuencial: Number = null;
    fpDetalle: String = null;
    fpInactivo: boolean = null;
    secEmpresa: String = null;
    secCodigo: String = null;
    ctaEmpresa: String = null;
    ctaCodigo: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
        this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}