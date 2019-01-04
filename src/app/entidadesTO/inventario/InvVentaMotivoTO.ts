export class InvVentaMotivoTO {
    public vmEmpresa: string = null;
    public vmCodigo: string = null;
    public vmDetalle: string = null;
    public vmFormaContabilizar: string = null;
    public vmFormaImprimir: string = null;
    public vmInactivo: boolean = false;
    public tipCodigo: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vmEmpresa = data.vmEmpresa ? data.vmEmpresa : this.vmEmpresa;
        this.vmCodigo = data.vmCodigo ? data.vmCodigo : this.vmCodigo;
        this.vmDetalle = data.vmDetalle ? data.vmDetalle : this.vmDetalle;
        this.vmFormaContabilizar = data.vmFormaContabilizar ? data.vmFormaContabilizar : this.vmFormaContabilizar;
        this.vmFormaImprimir = data.vmFormaImprimir ? data.vmFormaImprimir : this.vmFormaImprimir;
        this.vmInactivo = data.vmInactivo ? data.vmInactivo : this.vmInactivo;
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}