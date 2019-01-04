export class RhListaDetalleBonosLoteTO {
    id: number;
    dblFecha: string = "";
    dblId: string = "";
    dblNombres: string = "";
    dblValor: number = 0;
    dblFormaPagoDetalle: string ="";
    dblDocumento: string = "";
    dblObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.dblFecha = data.dblFecha ? data.dblFecha : this.dblFecha;
        this.dblId = data.dblId ? data.dblId : this.dblId;
        this.dblNombres = data.dblNombres ? data.dblNombres : this.dblNombres;
        this.dblValor = data.dblValor ? data.dblValor : this.dblValor;
        this.dblFormaPagoDetalle = data.dblFormaPagoDetalle ? data.dblFormaPagoDetalle : this.dblFormaPagoDetalle;
        this.dblDocumento = data.dblDocumento ? data.dblDocumento : this.dblDocumento;
        this.dblObservaciones = data.dblObservaciones ? data.dblObservaciones : this.dblObservaciones;
    }
}