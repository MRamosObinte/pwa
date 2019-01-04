export class InvProformaMotivoTO {

    public pmEmpresa: string = "";
    public pmCodigo: string = "";
    public pmDetalle: string = "";
    public pmInactivo: boolean = false;
    public usrCodigo: string = "";
    public usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pmEmpresa = data.pmEmpresa ? data.pmEmpresa : this.pmEmpresa;
        this.pmCodigo = data.pmCodigo ? data.pmCodigo : this.pmCodigo;
        this.pmDetalle = data.pmDetalle ? data.pmDetalle : this.pmDetalle;
        this.pmInactivo = data.pmInactivo ? data.pmInactivo : this.pmInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}