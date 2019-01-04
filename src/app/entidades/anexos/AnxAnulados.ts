import { AnxTipocomprobante } from "./AnxTipocomprobante";

export class AnxAnulados {

    anuSecuencial: number = 0;
    anuComprobanteEstablecimiento: String = "";
    anuComprobantePuntoEmision: String = "";
    anuSecuencialInicio: String = "";
    anuSecuencialFin: String = "";
    anuAutorizacion: String = "";
    anuFecha: Date = new Date();
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();
    tcCodigo: AnxTipocomprobante = new AnxTipocomprobante();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anuSecuencial = data.anuSecuencial ? data.anuSecuencial : this.anuSecuencial;
        this.anuComprobanteEstablecimiento = data.anuComprobanteEstablecimiento ? data.anuComprobanteEstablecimiento : this.anuComprobanteEstablecimiento;
        this.anuComprobantePuntoEmision = data.anuComprobantePuntoEmision ? data.anuComprobantePuntoEmision : this.anuComprobantePuntoEmision;
        this.anuSecuencialInicio = data.anuSecuencialInicio ? data.anuSecuencialInicio : this.anuSecuencialInicio;
        this.anuSecuencialFin = data.anuSecuencialFin ? data.anuSecuencialFin : this.anuSecuencialFin;
        this.anuAutorizacion = data.anuAutorizacion ? data.anuAutorizacion : this.anuAutorizacion;
        this.anuFecha = data.anuFecha ? data.anuFecha : this.anuFecha;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.tcCodigo = data.tcCodigo ? data.tcCodigo : this.tcCodigo;
    }
}