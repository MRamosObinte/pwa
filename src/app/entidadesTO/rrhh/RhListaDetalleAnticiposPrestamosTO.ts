export class RhListaDetalleAnticiposPrestamosTO {
    id: number;
    dapTipo: string = "";
    dapCategoria: string = "";
    dapFecha: string = "";
    dapId: string = "";
    dapNombres: string = "";
    dapValor: number = 0;
    dapReverso: boolean = false;
    dapFormaPago: string = "";
    dapDocumento: string = "";
    dapContable: string = "";
    dapAnulado: boolean = false;
    dapPendiente: boolean = false;
    dapObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.dapTipo = data.dapTipo ? data.dapTipo : this.dapTipo;
        this.dapCategoria = data.dapCategoria ? data.dapCategoria : this.dapCategoria;
        this.dapFecha = data.dapFecha ? data.dapFecha : this.dapFecha;
        this.dapId = data.dapId ? data.dapId : this.dapId;
        this.dapNombres = data.dapNombres ? data.dapNombres : this.dapNombres;
        this.dapValor = data.dapValor ? data.dapValor : this.dapValor;
        this.dapReverso = data.dapReverso ? data.dapReverso : this.dapReverso;
        this.dapFormaPago = data.dapFormaPago ? data.dapFormaPago : this.dapFormaPago;
        this.dapDocumento = data.dapDocumento ? data.dapDocumento : this.dapDocumento;
        this.dapContable = data.dapContable ? data.dapContable : this.dapContable;
        this.dapAnulado = data.dapAnulado ? data.dapAnulado : this.dapAnulado;
        this.dapPendiente = data.dapPendiente ? data.dapPendiente : this.dapPendiente;
        this.dapObservaciones = data.dapObservaciones ? data.dapObservaciones : this.dapObservaciones;
    }
}