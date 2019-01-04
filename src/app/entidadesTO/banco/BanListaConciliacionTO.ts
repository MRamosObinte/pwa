export class BanListaConciliacionTO {

    concCuentaContable: string = ""
    conCtaDetalle: string = "";
    concCodigo: string = "";
    concHasta: string = "";
    concSaldoEstadoCuenta: number = 0;
    concChequesGiradosYNoCobrados: number = 0;
    concDepositosEnTransito: number = 0;
    concPendiente: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.concCuentaContable = data.concCuentaContable ? data.concCuentaContable : this.concCuentaContable;
        this.conCtaDetalle = data.conCtaDetalle ? data.conCtaDetalle : this.conCtaDetalle;
        this.concCodigo = data.concCodigo ? data.concCodigo : this.concCodigo;
        this.concHasta = data.concHasta ? data.concHasta : this.concHasta;
        this.concSaldoEstadoCuenta = data.concSaldoEstadoCuenta ? data.concSaldoEstadoCuenta : this.concSaldoEstadoCuenta;
        this.concChequesGiradosYNoCobrados = data.concChequesGiradosYNoCobrados ? data.concChequesGiradosYNoCobrados : this.concChequesGiradosYNoCobrados;
        this.concDepositosEnTransito = data.concDepositosEnTransito ? data.concDepositosEnTransito : this.concDepositosEnTransito;
        this.concPendiente = data.concPendiente ? data.concPendiente : this.concPendiente;
    }
}