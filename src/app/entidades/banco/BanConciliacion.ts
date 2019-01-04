import { BanConciliacionPK } from "./BanConciliacionPK";

export class BanConciliacion {

    banConciliacionPK: BanConciliacionPK = new BanConciliacionPK();
    concHasta: Date = new Date();
    concSaldoEstadoCuenta: number = 0;
    concChequesGiradosYNoCobrados: number = 0;
    concDepositosEnTransito: number = 0;
    concPendiente: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.banConciliacionPK = data.banConciliacionPK ? new BanConciliacionPK(data.banConciliacionPK) : this.banConciliacionPK;
        this.concHasta = data.concHasta ? data.concHasta : this.concHasta;
        this.concSaldoEstadoCuenta = data.concSaldoEstadoCuenta ? data.concSaldoEstadoCuenta : this.concSaldoEstadoCuenta;
        this.concChequesGiradosYNoCobrados = data.concChequesGiradosYNoCobrados ? data.concChequesGiradosYNoCobrados : this.concChequesGiradosYNoCobrados;
        this.concDepositosEnTransito = data.concDepositosEnTransito ? data.concDepositosEnTransito : this.concDepositosEnTransito;
        this.concPendiente = data.concPendiente ? data.concPendiente : this.concPendiente;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}