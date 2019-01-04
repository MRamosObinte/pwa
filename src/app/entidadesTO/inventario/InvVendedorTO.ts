export class InvVendedorTO {

    vendEmpresa: string = "";
    vendCodigo: string = "";
    vendNombre: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";
 
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vendEmpresa = data.vendEmpresa ? data.vendEmpresa : this.vendEmpresa;
        this.vendCodigo = data.vendCodigo ? data.vendCodigo : this.vendCodigo;
        this.vendNombre = data.vendNombre ? data.vendNombre : this.vendNombre;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}