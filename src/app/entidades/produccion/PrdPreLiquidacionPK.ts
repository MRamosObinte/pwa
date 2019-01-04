export class PrdPreLiquidacionPK {

    plEmpresa: string = "";
    plMotivo: string = "";
    plNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.plEmpresa = data.plEmpresa ? data.plEmpresa : this.plEmpresa;
        this.plMotivo = data.plMotivo ? data.plMotivo : this.plMotivo;
        this.plNumero = data.plNumero ? data.plNumero : this.plNumero;
    }
    
}