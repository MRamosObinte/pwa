export class SisPcs {

    infMac: string = "";
    infIp: string = "";
    infNombre: string = "";
    infDescripcion: string = "";
    infReporteRutaDefault: string = "";
    infReporteFactura: string = "";
    infReporteNotaCredito: string = "";
    infReporteLiquidacion: string = "";
    infReporteRetencion: string = "";
    infReporteGuiaRemision: string = "";
    infEstado: boolean = false;
    usrCodigo: string = "";
    usrFechaInsertaPc: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.infMac = data.infMac ? data.infMac : this.infMac;
        this.infIp = data.infIp ? data.infIp : this.infIp;
        this.infNombre = data.infNombre ? data.infNombre : this.infNombre;
        this.infDescripcion = data.infDescripcion ? data.infDescripcion : this.infDescripcion;
        this.infReporteRutaDefault = data.infReporteRutaDefault ? data.infReporteRutaDefault : this.infReporteRutaDefault;
        this.infReporteFactura = data.infReporteFactura ? data.infReporteFactura : this.infReporteFactura;
        this.infReporteNotaCredito = data.infReporteNotaCredito ? data.infReporteNotaCredito : this.infReporteNotaCredito;
        this.infReporteLiquidacion = data.infReporteLiquidacion ? data.infReporteLiquidacion : this.infReporteLiquidacion;
        this.infReporteRetencion = data.infReporteRetencion ? data.infReporteRetencion : this.infReporteRetencion;
        this.infReporteGuiaRemision = data.infReporteGuiaRemision ? data.infReporteGuiaRemision : this.infReporteGuiaRemision;
        this.infEstado = data.infEstado ? data.infEstado : this.infEstado;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaPc = data.usrFechaInsertaPc ? data.usrFechaInsertaPc : this.usrFechaInsertaPc;
    }
}