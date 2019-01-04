export class ConFunBalanceResultadosNecTO {

    id: number = 0;
    brCuenta: String = "";
    brDetalle: String = "";
    brSaldo1: number = 0;
    brSaldo2: number = 0;
    brSaldo3: number = 0;
    brSaldo4: number = 0;
    brSaldo5: number = 0;
    brSaldo6: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.brCuenta = data.brCuenta ? data.brCuenta : this.brCuenta;
        this.brDetalle = data.brDetalle ? data.brDetalle : this.brDetalle;
        this.brSaldo1 = data.brSaldo1 ? data.brSaldo1 : this.brSaldo1;
        this.brSaldo2 = data.brSaldo2 ? data.brSaldo2 : this.brSaldo2;
        this.brSaldo3 = data.brSaldo3 ? data.brSaldo3 : this.brSaldo3;
        this.brSaldo4 = data.brSaldo4 ? data.brSaldo4 : this.brSaldo4;
        this.brSaldo5 = data.brSaldo5 ? data.brSaldo5 : this.brSaldo5;
        this.brSaldo6 = data.brSaldo6 ? data.brSaldo6 : this.brSaldo6;
    }
    
}