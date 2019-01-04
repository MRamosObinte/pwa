export class AnxTipoComprobanteComboTO {

    tcCodigo : string = "";
	tcDescripcion : string = "";
	tcRutaReporte : string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tcCodigo = data.tcCodigo ? data.tcCodigo : this.tcCodigo;
        this.tcDescripcion = data.tcDescripcion ? data.tcDescripcion : this.tcDescripcion;
        this.tcRutaReporte = data.tcRutaReporte ? data.tcRutaReporte : this.tcRutaReporte;
    }

}