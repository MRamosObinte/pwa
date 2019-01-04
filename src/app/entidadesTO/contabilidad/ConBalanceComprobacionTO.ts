export class ConBalanceComprobacionTO {

    public id: number = 0;
    public bcCuenta: string = null;
    public bcDetalle: string = null;
    public bcSaldoAnterior: number = 0;
    public bcTotalDebito: number = 0;
    public bcTotalCredito: number = 0;
    public bcSaldoFinal: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.bcCuenta = data.bcCuenta ? data.bcCuenta : this.bcCuenta;
        this.bcDetalle = data.bcDetalle ? data.bcDetalle : this.bcDetalle;
        this.bcSaldoAnterior = data.bcSaldoAnterior ? data.bcSaldoAnterior : this.bcSaldoAnterior;
        this.bcTotalDebito = data.bcTotalDebito ? data.bcTotalDebito : this.bcTotalDebito;
        this.bcTotalCredito = data.bcTotalCredito ? data.bcTotalCredito : this.bcTotalCredito;
        this.bcSaldoFinal = data.bcSaldoFinal ? data.bcSaldoFinal : this.bcSaldoFinal;
    }
}