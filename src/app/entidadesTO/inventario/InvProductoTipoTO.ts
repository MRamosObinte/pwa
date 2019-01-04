export class InvProductoTipoTO {
    tipEmpresa: string = "";
    tipCodigo: string = "";
    tipDetalle: string = "";
    tipTipo: string = "";
    tipActivo: boolean = false;
    usrEmpresa: string = ""; 
    usrCodigo: string = "";
    usrFechaInserta: string = ""; 

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tipEmpresa = data.tipEmpresa ? data.tipEmpresa : this.tipEmpresa;
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;
        this.tipDetalle = data.tipDetalle ? data.tipDetalle : this.tipDetalle;
        this.tipTipo = data.tipTipo ? data.tipTipo : this.tipTipo;
        this.tipActivo = data.tipActivo ? data.tipActivo : this.tipActivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}