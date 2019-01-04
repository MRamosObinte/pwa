export class InvTransferenciaMotivoTO {
    public tmEmpresa: string = null;
    public tmCodigo: string = null;
    public tmDetalle: string = null;
    public tmInactivo: boolean = false;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tmEmpresa = data.tmEmpresa ? data.tmEmpresa : this.tmEmpresa;
        this.tmCodigo = data.tmCodigo ? data.tmCodigo : this.tmCodigo;
        this.tmDetalle = data.tmDetalle ? data.tmDetalle : this.tmDetalle;
        this.tmInactivo = data.tmInactivo ? data.tmInactivo : this.tmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}