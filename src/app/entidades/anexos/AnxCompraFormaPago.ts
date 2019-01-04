import { AnxFormaPago } from "./AnxFormaPago";
import { AnxCompra } from "./AnxCompra";

export class AnxCompraFormaPago {

    detSecuencial: number = 0;
    fpCodigo: AnxFormaPago = new AnxFormaPago();
    anxCompra: AnxCompra = new AnxCompra();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.fpCodigo = data.fpCodigo ? data.fpCodigo : this.fpCodigo;
        this.anxCompra = data.anxCompra ? data.anxCompra : this.anxCompra;
    }
}