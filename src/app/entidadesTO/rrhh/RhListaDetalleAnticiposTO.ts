export class RhListaDetalleAnticiposTO {
    id: number;
    daCategoria: string = "";
    daFecha: string = "";
    daId: string = "";
    daNombres: string = "";
    daValor: number = 0;
    daReverso: boolean = false;
    daFormaPago: string = "";
    daDocumento: string = "";
    daContable: string = "";
    daAnulado: boolean = false;
    daPendiente: boolean = false;
    daObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.daCategoria = data.daCategoria ? data.daCategoria : this.daCategoria;
        this.daFecha = data.daFecha ? data.daFecha : this.daFecha;
        this.daId = data.daId ? data.daId : this.daId;
        this.daNombres = data.daNombres ? data.daNombres : this.daNombres;
        this.daValor = data.daValor ? data.daValor : this.daValor;
        this.daReverso = data.daReverso ? data.daReverso : this.daReverso;
        this.daFormaPago = data.daFormaPago ? data.daFormaPago : this.daFormaPago;
        this.daDocumento = data.daDocumento ? data.daDocumento : this.daDocumento;
        this.daContable = data.daContable ? data.daContable : this.daContable;
        this.daAnulado = data.daAnulado ? data.daAnulado : this.daAnulado;
        this.daPendiente = data.daPendiente ? data.daPendiente : this.daPendiente;
        this.daObservaciones = data.daObservaciones ? data.daObservaciones : this.daObservaciones;
    }
}