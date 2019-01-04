export class InvProveedorCategoriaTO {
    public pcEmpresa: string = "";
    public pcCodigo: string = "";
    public pcDetalle: string = "";
    public pcAplicaRetencionIva: boolean = false;
    public usrEmpresa: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pcEmpresa = data.pcEmpresa ? data.pcEmpresa : this.pcEmpresa;
        this.pcCodigo = data.pcCodigo ? data.pcCodigo : this.pcCodigo;
        this.pcDetalle = data.pcDetalle ? data.pcDetalle : this.pcDetalle;
        this.pcAplicaRetencionIva = data.pcAplicaRetencionIva ? data.pcAplicaRetencionIva : this.pcAplicaRetencionIva;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}