
export class ConMayorGeneralTO {
    public bgCuenta: String = null;
    public bgDetalle: String = null;
    public bgSaldo6: number = null;
    public bgSaldo5: number = null;
    public bgSaldo4: number = null;
    public bgSaldo3: number = null;
    public bgSaldo2: number = null;
    public bgSaldo1: number = null;
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bgCuenta = data ? data.bgCuenta : this.bgCuenta;
        this.bgDetalle = data ? data.bgDetalle : this.bgDetalle;
        this.bgSaldo6 = data ? data.bgSaldo6 : this.bgSaldo6;
        this.bgSaldo5 = data ? data.bgSaldo5 : this.bgSaldo5;
        this.bgSaldo4 = data ? data.bgSaldo4 : this.bgSaldo4;
        this.bgSaldo3 = data ? data.bgSaldo3 : this.bgSaldo3;
        this.bgSaldo2 = data ? data.bgSaldo2 : this.bgSaldo2;
        this.bgSaldo1 = data ? data.bgSaldo1 : this.bgSaldo1;
    }
}