export class AnxTipotransaccion {

    ttCodigo: String = "";
    ttTransaccion: String = "";
    ttId: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ttCodigo = data.ttCodigo ? data.ttCodigo : this.ttCodigo;
        this.ttTransaccion = data.ttTransaccion ? data.ttTransaccion : this.ttTransaccion;
        this.ttId = data.ttId ? data.ttId : this.ttId;
    }
}