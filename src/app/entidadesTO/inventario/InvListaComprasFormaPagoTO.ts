export class InvListaComprasFormaPagoTO {
    public fpSecuencial: number = null;
    public fpDetalle: string = null;
    public fpInactivo: boolean = false;
    public secCodigo: string = null;
    public ctaCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
        this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
    }

}