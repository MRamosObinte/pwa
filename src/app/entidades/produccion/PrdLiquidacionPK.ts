export class PrdLiquidacionPK {

    liqEmpresa: string = null;
    liqMotivo: string = null;
    liqNumero: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.liqEmpresa = data.liqEmpresa ? data.liqEmpresa : this.liqEmpresa;
        this.liqMotivo = data.liqMotivo ? data.liqMotivo : this.liqMotivo;
        this.liqNumero = data.liqNumero ? data.liqNumero : this.liqNumero;
    }
}