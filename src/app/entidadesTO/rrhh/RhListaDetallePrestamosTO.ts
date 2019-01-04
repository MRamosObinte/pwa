export class RhListaDetallePrestamosTO {
    id: number;
    dpCategoria: string = "";
    dpFecha: string = "";
    dpId: string = "";
    dpNombres: string = "";
    dpValor: number = 0;
    dpFormaPago: string = "";
    dpDocumento: string = "";
    dpContable: string = "";
    dpObservaciones: string = "";
    dpPendiente: boolean = false;
    dpReversado: boolean = false;
    dpAnulado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.dpCategoria = data.dpCategoria ? data.dpCategoria : this.dpCategoria;
        this.dpFecha = data.dpFecha ? data.dpFecha : this.dpFecha;
        this.dpId = data.dpId ? data.dpId : this.dpId;
        this.dpNombres = data.dpNombres ? data.dpNombres : this.dpNombres;
        this.dpValor = data.dpValor ? data.dpValor : this.dpValor;
        this.dpFormaPago = data.dpFormaPago ? data.dpFormaPago : this.dpFormaPago;
        this.dpDocumento = data.dpDocumento ? data.dpDocumento : this.dpDocumento;
        this.dpContable = data.dpContable ? data.dpContable : this.dpContable;
        this.dpObservaciones = data.dpObservaciones ? data.dpObservaciones : this.dpObservaciones;
        this.dpPendiente = data.dpPendiente ? data.dpPendiente : this.dpPendiente;
        this.dpReversado = data.dpReversado ? data.dpReversado : this.dpReversado;
        this.dpAnulado = data.dpAnulado ? data.dpAnulado : this.dpAnulado;
    }
}