export class InvConsumosMotivoTO {
    public cmEmpresa: string = null;
    public cmCodigo: string = null;
    public cmDetalle: string = null;
    public cmInactivo: boolean = false;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;
    public cmFormaContabilizar: string = null;
    public cmSector: string = null;
    public cmBodega: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cmEmpresa = data.cmEmpresa ? data.cmEmpresa : this.cmEmpresa;
        this.cmCodigo = data.cmCodigo ? data.cmCodigo : this.cmCodigo;
        this.cmDetalle = data.cmDetalle ? data.cmDetalle : this.cmDetalle;
        this.cmInactivo = data.cmInactivo ? data.cmInactivo : this.cmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.cmFormaContabilizar = data.cmFormaContabilizar ? data.cmFormaContabilizar : this.cmFormaContabilizar;
        this.cmSector = data.cmSector ? data.cmSector : this.cmSector;
        this.cmBodega = data.cmBodega ? data.cmBodega : this.cmBodega;
    }

}