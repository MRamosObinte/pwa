export class InvProductoPresentacionCajasTO {

    prescEmpresa: string = "";
    prescCodigo: string = "";
    prescDetalle: string = "";
    prescAbreviado: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prescEmpresa = data.prescEmpresa ? data.prescEmpresa : this.prescEmpresa;
        this.prescCodigo = data.prescCodigo ? data.prescCodigo : this.prescCodigo;
        this.prescDetalle = data.prescDetalle ? data.prescDetalle : this.prescDetalle;
        this.prescAbreviado = data.prescAbreviado ? data.prescAbreviado : this.prescAbreviado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}