export class ListaConContableTO {
    public id: string = null;
    public empCodigo: string = null;
    public perCodigo: string = null;
    public tipCodigo: string = null;
    public conNumero: string = null;
    public conFecha: string = null;
    public conPendiente: string = null;
    public conAnulado: string = null;
    public conReversado: string = null;
    public conBloqueado: string = null;
    public conConcepto: string = null;
    public conDetalle: string = null;
    public conObservaciones: string = null;
    public conReferencia: string = null;
    public seleccionado: boolean = false;
    public conStatus: string = null;
    constructor(data?) {
        this.hydrate(data);
    }
    hydrate(data) {
        this.id = data ? data.id : this.id;
        this.empCodigo = data ? data.empCodigo : this.empCodigo;
        this.perCodigo = data ? data.perCodigo : this.perCodigo;
        this.tipCodigo = data ? data.tipCodigo : this.tipCodigo;
        this.conPendiente = data ? data.conPendiente : this.conPendiente;
        this.conAnulado = data ? data.conAnulado : this.perCodigo;
        this.conReversado = data ? data.conReversado : this.conReversado;
        this.conBloqueado = data ? data.conBloqueado : this.conBloqueado;
        this.conConcepto = data ? data.conConcepto : this.conConcepto;
        this.conDetalle = data ? data.conDetalle : this.conDetalle;
        this.conObservaciones = data ? data.conObservaciones : this.conObservaciones;
        this.conReferencia = data ? data.conReferencia : this.conReferencia;
        this.conStatus = data ? data.conStatus : this.conStatus;
    }
}