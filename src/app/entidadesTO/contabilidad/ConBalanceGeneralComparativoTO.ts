export class ConBalanceGeneralComparativoTO {

    public id: number = 0;
    public bgCuenta: string = null;
    public bgDetalle: string = null;
    public bgSaldoAnterior: number = 0;
    public bgSaldoActual: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.bgCuenta = data.bgCuenta ? data.bgCuenta : this.bgCuenta;
        this.bgDetalle = data.bgDetalle ? data.bgDetalle : this.bgDetalle;
        this.bgSaldoAnterior = data.bgSaldoAnterior ? data.bgSaldoAnterior : this.bgSaldoAnterior;
        this.bgSaldoActual = data.bgSaldoActual ? data.bgSaldoActual : this.bgSaldoActual;
    }

}
