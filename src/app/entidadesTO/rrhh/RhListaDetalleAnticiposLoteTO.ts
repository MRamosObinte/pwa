export class RhListaDetalleAnticiposLoteTO {
    id: number;
    dalFecha: string;
    dalId: string;
    dalNombres: string;
    dalValor: number;
    dalFormaPagoDetalle: string;
    dalDocumento: string;
    dalObservaciones: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.dalFecha = data.dalFecha ? data.dalFecha : this.dalFecha;
        this.dalFecha = data.dalFecha ? data.dalFecha : this.dalFecha;
        this.dalId = data.dalId ? data.dalId : this.dalId;
        this.dalNombres = data.dalNombres ? data.dalNombres : this.dalNombres;
        this.dalValor = data.dalValor ? data.dalValor : this.dalValor;
        this.dalFormaPagoDetalle = data.dalFormaPagoDetalle ? data.dalFormaPagoDetalle : this.dalFormaPagoDetalle;
        this.dalDocumento = data.dalDocumento ? data.dalDocumento : this.dalDocumento;
        this.dalObservaciones = data.dalObservaciones ? data.dalObservaciones : this.dalObservaciones;
    }
}