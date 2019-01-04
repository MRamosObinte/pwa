export class InvVentasFormaCobroTO {
    public fcSecuencial: number = null;
    public fcDetalle: string = null;
    public fcTipoPrincipal: string = null;
    public fcInactivo: boolean = false;
    public secEmpresa: string = null;
    public secCodigo: string = null;
    public ctaEmpresa: string = null; 
    public ctaCodigo: string = null;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fcSecuencial = data.fcSecuencial ? data.fcSecuencial : this.fcSecuencial;
        this.fcDetalle = data.fcDetalle ? data.fcDetalle : this.fcDetalle;
        this.fcTipoPrincipal = data.fcTipoPrincipal ? data.fcTipoPrincipal : this.fcTipoPrincipal;
        this.fcInactivo = data.fcInactivo ? data.fcInactivo : this.fcInactivo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}