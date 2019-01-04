export class AfUbicacionesTO {
    public ubiEmpresa: string = "";
    public ubiCodigo: string = "";
    public ubiDescripcion: string = "";
    public usrEmpresa: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ubiEmpresa = data.ubiEmpresa ? data.ubiEmpresa : this.ubiEmpresa;
        this.ubiCodigo = data.ubiCodigo ? data.ubiCodigo : this.ubiCodigo;
        this.ubiDescripcion = data.ubiDescripcion ? data.ubiDescripcion : this.ubiDescripcion;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}