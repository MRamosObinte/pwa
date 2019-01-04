export class InvProductoPresentacionUnidadesTO {

    presuEmpresa: string = "";
    presuCodigo: string = "";
    presuDetalle: string = "";
    presuAbreviado: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.presuEmpresa = data.presuEmpresa ? data.presuEmpresa : this.presuEmpresa;
        this.presuCodigo = data.presuCodigo ? data.presuCodigo : this.presuCodigo;
        this.presuDetalle = data.presuDetalle ? data.presuDetalle : this.presuDetalle;
        this.presuAbreviado = data.presuAbreviado ? data.presuAbreviado : this.presuAbreviado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}