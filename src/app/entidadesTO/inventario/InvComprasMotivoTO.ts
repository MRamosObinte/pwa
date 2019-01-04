export class InvComprasMotivoTO {
    public cmEmpresa: string = null;
    public cmCodigo: string = "";
    public cmDetalle: string = null;
    public cmFormaContabilizar: string = null;
    public cmFormaImprimir: string = null;
    public cmAjustesDeInventario: boolean = false;
    public cmInactivo: boolean = false;
    public tipCodigo: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cmEmpresa = data.cmEmpresa ? data.cmEmpresa : this.cmEmpresa;
        this.cmCodigo = data.cmCodigo ? data.cmCodigo : this.cmCodigo;
        this.cmDetalle = data.cmDetalle ? data.cmDetalle : this.cmDetalle;
        this.cmFormaContabilizar = data.cmFormaContabilizar ? data.cmFormaContabilizar : this.cmFormaContabilizar;
        this.cmFormaImprimir = data.cmFormaImprimir ? data.cmFormaImprimir : this.cmFormaImprimir;
        this.cmAjustesDeInventario = data.cmAjustesDeInventario ? data.cmAjustesDeInventario : this.cmAjustesDeInventario;
        this.cmInactivo = data.cmInactivo ? data.cmInactivo : this.cmInactivo;
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}