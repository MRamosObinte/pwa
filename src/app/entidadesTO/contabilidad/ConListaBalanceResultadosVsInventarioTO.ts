export class ConListaBalanceResultadosVsInventarioTO {

    public id: number = 0;
    public vriCuentaContable: string = null;
    public vriNombre: string = null;
    public vriSaldoContable: number = 0;
    public vriInventarioInicial: number = 0;
    public vriDiferencia: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vriCuentaContable = data.vriCuentaContable ? data.vriCuentaContable : this.vriCuentaContable;
        this.vriNombre = data.vriNombre ? data.vriNombre : this.vriNombre;
        this.vriSaldoContable = data.vriSaldoContable ? data.vriSaldoContable : this.vriSaldoContable;
        this.vriInventarioInicial = data.vriInventarioInicial ? data.vriInventarioInicial : this.vriInventarioInicial;
        this.vriDiferencia = data.vriDiferencia ? data.vriDiferencia : this.vriDiferencia;
    }
}