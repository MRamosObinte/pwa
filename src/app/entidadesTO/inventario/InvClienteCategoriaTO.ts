export class InvClienteCategoriaTO {

    ccEmpresa: string = "";
    ccCodigo: string = "";
    ccDetalle: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ccEmpresa = data.ccEmpresa ? data.ccEmpresa : this.ccEmpresa;
        this.ccCodigo = data.ccCodigo ? data.ccCodigo : this.ccCodigo;
        this.ccDetalle = data.ccDetalle ? data.ccDetalle : this.ccDetalle;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}