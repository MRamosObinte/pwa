export class BanCajaTO {
    empCodigo: string = "";
    cajaCodigo: string = "";
    cajaNombre: string = "";
    cajaCuenta: string = "";
    usrInsertaCaja: string = "";
    usrFechaInsertaCaja: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.cajaCodigo = data.cajaCodigo ? data.cajaCodigo : this.cajaCodigo;
        this.cajaNombre = data.cajaNombre ? data.cajaNombre : this.cajaNombre;
        this.cajaCuenta = data.cajaCuenta ? data.cajaCuenta : this.cajaCuenta;
        this.usrInsertaCaja = data.usrInsertaCaja ? data.usrInsertaCaja : this.usrInsertaCaja;
        this.usrFechaInsertaCaja = data.usrFechaInsertaCaja ? data.usrFechaInsertaCaja : this.usrFechaInsertaCaja;
    }
}