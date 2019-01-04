export class InvProductoMedidaTO {
    medEmpresa: string = "";
    medCodigo: string = "";
    medDetalle: string = "";
    medConvLibras: Number = 0.0000;
    medConvKilos: Number = 0.0000;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.medEmpresa = data.medEmpresa ? data.medEmpresa : this.medEmpresa;
        this.medCodigo = data.medCodigo ? data.medCodigo : this.medCodigo;
        this.medDetalle = data.medDetalle ? data.medDetalle : this.medDetalle;
        this.medConvLibras = data.medConvLibras ? data.medConvLibras : this.medConvLibras;
        this.medConvKilos = data.medConvKilos ? data.medConvKilos : this.medConvKilos;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}