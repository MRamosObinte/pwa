export class RhComboFormaPagoBeneficioSocialTO {
    ctaCodigo: string = "";
    fpDetalle: string = "";
    secCodigo: string = "";
    fpCodigoMinisterial: number = 0;
    validar: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.fpCodigoMinisterial = data.fpCodigoMinisterial ? data.fpCodigoMinisterial : this.fpCodigoMinisterial;
        this.validar = data.validar ? data.validar : this.validar;
    }
}