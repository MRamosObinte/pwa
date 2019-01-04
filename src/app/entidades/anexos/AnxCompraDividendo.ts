import { AnxConcepto } from "./AnxConcepto";
import { AnxCompra } from "./AnxCompra";

export class AnxCompraDividendo {

    divSecuencial: number = 0;
    divFechaPago: Date = new Date();
    divIrAsociado: number = 0;
    divAnioUtilidades: String = "";
    conCodigo: AnxConcepto = new AnxConcepto();
    anxCompra: AnxCompra = new AnxCompra();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.divSecuencial = data.divSecuencial ? data.divSecuencial : this.divSecuencial;
        this.divFechaPago = data.divFechaPago ? data.divFechaPago : this.divFechaPago;
        this.divIrAsociado = data.divIrAsociado ? data.divIrAsociado : this.divIrAsociado;
        this.divAnioUtilidades = data.divAnioUtilidades ? data.divAnioUtilidades : this.divAnioUtilidades;
        this.conCodigo = data.conCodigo ? data.conCodigo : this.conCodigo;
        this.anxCompra = data.anxCompra ? data.anxCompra : this.anxCompra;
    }
}