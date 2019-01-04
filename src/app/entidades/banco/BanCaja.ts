import { BanCajaPK } from "./BanCajaPK";

export class BanCaja {

    banCajaPK: BanCajaPK = new BanCajaPK();
    cajaNombre: string = "";
    ctaEmpresa: string = "";
    ctaCuentaContable: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.banCajaPK = data.banCajaPK ? new BanCajaPK(data.banCajaPK) : this.banCajaPK;
        this.cajaNombre = data.cajaNombre ? data.cajaNombre : this.cajaNombre;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCuentaContable = data.ctaCuentaContable ? data.ctaCuentaContable : this.ctaCuentaContable;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}