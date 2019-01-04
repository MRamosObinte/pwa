export class InvConsumosTO {
    public consEmpresa: string = null;
    public consPeriodo: string = null;
    public consMotivo: string = null;
    public consNumero: string = null;
    public consReferencia: string = null;
    public consFecha: string = null;
    public consObservaciones: string = null;
    public consPendiente: boolean = false;
    public consRevisado: boolean = false;
    public consAnulado: boolean = false;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.consEmpresa = data.consEmpresa ? data.consEmpresa : this.consEmpresa;
        this.consPeriodo = data.consPeriodo ? data.consPeriodo : this.consPeriodo;
        this.consMotivo = data.consMotivo ? data.consMotivo : this.consMotivo;
        this.consNumero = data.consNumero ? data.consNumero : this.consNumero;
        this.consReferencia = data.consReferencia ? data.consReferencia : this.consReferencia;
        this.consFecha = data.consFecha ? data.consFecha : this.consFecha;
        this.consObservaciones = data.consObservaciones ? data.consObservaciones : this.consObservaciones;
        this.consPendiente = data.consPendiente ? data.consPendiente : this.consPendiente;
        this.consRevisado = data.consRevisado ? data.consRevisado : this.consRevisado;
        this.consAnulado = data.consAnulado ? data.consAnulado : this.consAnulado;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}