export class InvProductoCategoriaTO {

    catEmpresa: string = "";
    catCodigo: string = "";
    catDetalle: string = "";
    catPrecioFijo: boolean = false;
    catActiva: boolean = false;
    ctaEmpresa: string = "";
    ctaCodigo: string = "";
    scatEmpresa: string = "";
    scatCodigo: string = "";
    usrEmpresa: string = ""; 
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.catEmpresa = data.catEmpresa ? data.catEmpresa : this.catEmpresa;
        this.catCodigo = data.catCodigo ? data.catCodigo : this.catCodigo;
        this.catDetalle = data.catDetalle ? data.catDetalle : this.catDetalle;
        this.catPrecioFijo = data.catPrecioFijo ? data.catPrecioFijo : this.catPrecioFijo;
        this.catActiva = data.catActiva ? data.catActiva : this.catActiva;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.scatEmpresa = data.scatEmpresa ? data.scatEmpresa : this.scatEmpresa;
        this.scatCodigo = data.scatCodigo ? data.scatCodigo : this.scatCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
    
}