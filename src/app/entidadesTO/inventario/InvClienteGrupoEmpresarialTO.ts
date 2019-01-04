export class InvClienteGrupoEmpresarialTO {
    public geEmpresa: string = "";
    public geCodigo: string = "";
    public geNombre: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.geEmpresa = data.geEmpresa ? data.geEmpresa : this.geEmpresa;
        this.geCodigo = data.geCodigo ? data.geCodigo : this.geCodigo;
        this.geNombre = data.geNombre ? data.geNombre : this.geNombre;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}