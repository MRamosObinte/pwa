export class SaldoBodegaComprobacionTO {
    public id: number = 0;
    public sbcProductoNombre: string = "";
    public sbcProductoCodigo: string = "";
    public sbcMedida: string = "";
    public sbcInicial: number = 0;
    public sbcCompra: number = 0;
    public sbcVenta: number = 0;
    public sbcConsumo: number = 0;
    public sbcTransferenciaI: number = 0;
    public sbcTransferenciaE: number = 0;
    public sbcDevolucionC: number = 0;
    public sbcDevolucionV: number = 0;
    public sbcFinal: number = 0;
    public sbcDiferencia: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.sbcProductoNombre = data.sbcProductoNombre ? data.sbcProductoNombre : this.sbcProductoNombre;
        this.sbcProductoCodigo = data.sbcProductoCodigo ? data.sbcProductoCodigo : this.sbcProductoCodigo;
        this.sbcMedida = data.sbcMedida ? data.sbcMedida : this.sbcMedida;
        this.sbcInicial = data.sbcInicial ? data.sbcInicial : this.sbcInicial;
        this.sbcCompra = data.sbcCompra ? data.sbcCompra : this.sbcCompra;
        this.sbcVenta = data.sbcVenta ? data.sbcVenta : this.sbcVenta;
        this.sbcConsumo = data.sbcConsumo ? data.sbcConsumo : this.sbcConsumo;
        this.sbcTransferenciaI = data.sbcTransferenciaI ? data.sbcTransferenciaI : this.sbcTransferenciaI;
        this.sbcTransferenciaE = data.sbcTransferenciaE ? data.sbcTransferenciaE : this.sbcTransferenciaE;
        this.sbcDevolucionC = data.sbcDevolucionC ? data.sbcDevolucionC : this.sbcDevolucionC;
        this.sbcDevolucionV = data.sbcDevolucionV ? data.sbcDevolucionV : this.sbcDevolucionV;
        this.sbcFinal = data.sbcFinal ? data.sbcFinal : this.sbcFinal;
        this.sbcDiferencia = data.sbcDiferencia ? data.sbcDiferencia : this.sbcDiferencia;
    }

}