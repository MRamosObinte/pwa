export class InvMedidaComboTO {

    medidaCodigo: string = "";
    medidaDetalle: string = "";
    conversionLibras: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.medidaCodigo = data.medidaCodigo ? data.medidaCodigo : this.medidaCodigo;
        this.medidaDetalle = data.medidaDetalle ? data.medidaDetalle : this.medidaDetalle;
        this.conversionLibras = data.conversionLibras ? data.conversionLibras : this.conversionLibras;
    }

}