import { AnxCompraFormaPago } from "./AnxCompraFormaPago";

export class AnxFormaPago {

    fpCodigo: String = "";
    fpDetalle: String = "";
    fpDesde: Date = new Date();
    fpHasta: Date = new Date();
    anxCompraFormaPagoList: Array<AnxCompraFormaPago> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fpCodigo = data.fpCodigo ? data.fpCodigo : this.fpCodigo;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
        this.fpDesde = data.fpDesde ? data.fpDesde : this.fpDesde;
        this.fpHasta = data.fpHasta ? data.fpHasta : this.fpHasta;
        this.anxCompraFormaPagoList = data.anxCompraFormaPagoList ? data.anxCompraFormaPagoList : this.anxCompraFormaPagoList;
    }
}