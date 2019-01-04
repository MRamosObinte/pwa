export class ConContableTO {
    
    public conNumero: String = null;
    public empCodigo: String = null;
    public perCodigo: String = null;
    public tipCodigo: String = null;
    public conFecha: String = null;
    public conPendiente: boolean = false;
    public conBloqueado: boolean = false;
    public conAnulado: boolean = false;
    public conReversado: boolean = false;
    public conGenerado: boolean = false;
    public conConcepto: String = null;
    public conDetalle: String = null;
    public conObservaciones: String = null;
    public usrInsertaContable: String = null;
    public usrFechaInsertaContable: String = null;
    public conCodigo: String = null;
    public conReferencia: String = null;

    constructor(data?) {
        this.hydrate(data);
    }

    hydrate(data) {
        this.conNumero = data ? data.conNumero : this.conNumero;
        this.empCodigo = data ? data.empCodigo : this.empCodigo;
        this.perCodigo = data ? data.perCodigo : this.perCodigo;
        this.tipCodigo = data ? data.tipCodigo : this.tipCodigo;
        this.conFecha = data ? data.conFecha : this.conFecha;
        this.conPendiente = data ? data.conPendiente : this.conPendiente;
        this.conBloqueado = data ? data.conBloqueado : this.conBloqueado;
        this.conAnulado = data ? data.conAnulado : this.conAnulado;
        this.conReversado = data ? data.conReversado : this.conReversado;
        this.conGenerado = data ? data.conGenerado : this.conGenerado;
        this.conConcepto = data ? data.conConcepto : this.conConcepto;
        this.conDetalle = data ? data.conDetalle : this.conDetalle;
        this.conObservaciones = data ? data.conObservaciones : this.conObservaciones;
        this.usrInsertaContable = data ? data.usrInsertaContable : this.usrInsertaContable;
        this.usrFechaInsertaContable = data ? data.usrFechaInsertaContable : this.usrFechaInsertaContable;
        this.conCodigo = data ? data.conCodigo : this.conCodigo;
        this.conReferencia = data ? data.conReferencia : this.conReferencia;
    }
}