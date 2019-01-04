export class AnexoTalonResumenVentasTO{

    venComprobante: string = "";
    venEstablecimiento: string = "";
    venPuntoEmision: string = "";
    venBaseNoObjetoIva: number = 0;
    venBase0: number = 0;
    venBaseImponible: number = 0;
    venMotoIva: number = 0;
    venValorRetenidoIva: number = 0;
    venValorRetenidoRenta: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.venComprobante = data.venComprobante ? data.venComprobante : this.venComprobante;
        this.venEstablecimiento = data.venEstablecimiento ? data.venEstablecimiento : this.venEstablecimiento;
        this.venPuntoEmision = data.venPuntoEmision ? data.venPuntoEmision : this.venPuntoEmision;
        this.venBaseNoObjetoIva = data.venBaseNoObjetoIva ? data.venBaseNoObjetoIva : this.venBaseNoObjetoIva;
        this.venBase0 = data.venBase0 ? data.venBase0 : this.venBase0;
        this.venBaseImponible = data.venBaseImponible ? data.venBaseImponible : this.venBaseImponible;
        this.venMotoIva = data.venMotoIva ? data.venMotoIva : this.venMotoIva;
        this.venValorRetenidoIva = data.venValorRetenidoIva ? data.venValorRetenidoIva : this.venValorRetenidoIva;
        this.venValorRetenidoRenta = data.venValorRetenidoRenta ? data.venValorRetenidoRenta : this.venValorRetenidoRenta;
    }
}