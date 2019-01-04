export class BanChequeNumeracion {

    banSecuencial: number = 0;
    banDesde: number = 0;
    banHasta: number = 0;
    banCtaEmpresa: string = "";
    banCtaContable: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.banSecuencial = data.banSecuencial ? data.banSecuencial : this.banSecuencial;
        this.banDesde = data.banDesde ? data.banDesde : this.banDesde;
        this.banHasta = data.banHasta ? data.banHasta : this.banHasta;
        this.banCtaEmpresa = data.banCtaEmpresa ? data.banCtaEmpresa : this.banCtaEmpresa;
        this.banCtaContable = data.banCtaContable ? data.banCtaContable : this.banCtaContable;
    }

}