export class AnxFormaPagoTO {
    fpCodigo:string = null;
    fpDetalle:string = null;
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fpCodigo = data.fpCodigo ? data.fpCodigo : this.fpCodigo;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
    }

}