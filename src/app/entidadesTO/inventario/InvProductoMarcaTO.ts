export class InvProductoMarcaTO {

    marEmpresa: string = "";
    marCodigo: string = "";
    marDetalle: string = "";
    marAbreviado: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.marEmpresa = data.marEmpresa ? data.marEmpresa : this.marEmpresa;
        this.marCodigo = data.marCodigo ? data.marCodigo : this.marCodigo;
        this.marDetalle = data.marDetalle ? data.marDetalle : this.marDetalle;
        this.marAbreviado = data.marAbreviado ? data.marAbreviado : this.marAbreviado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}