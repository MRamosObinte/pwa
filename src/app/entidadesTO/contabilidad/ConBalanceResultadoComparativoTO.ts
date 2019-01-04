export class ConBalanceResultadoComparativoTO {

    public id: number = 0;
    public brcCuenta: string = null;
    public brcDetalle: string = null;
    public brcSaldo: number = 0;
    public brcSaldo2: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.brcCuenta = data.brcCuenta ? data.brcCuenta : this.brcCuenta;
        this.brcDetalle = data.brcDetalle ? data.brcDetalle : this.brcDetalle;
        this.brcSaldo = data.brcSaldo ? data.brcSaldo : this.brcSaldo;
        this.brcSaldo2 = data.brcSaldo2 ? data.brcSaldo2 : this.brcSaldo2;
    }
}