import { InvTransferenciasPK } from "../../entidades/inventario/InvTransferenciasPK";

export class InvTransferenciasTO {
    public invTransferenciasPK: InvTransferenciasPK = new InvTransferenciasPK();
    public transEmpresa:string = null
    public transPeriodo: string = null;
    public transMotivo: string = null;
    public transNumero: string = null;
    public transFecha: any = null;
    public transObservaciones: string = null;
    public transPendiente: boolean = false;
    public transRevisado: boolean = false;
    public transAnulado: boolean = false;
    public conEmpresa: string = null;
    public conPeriodo: string = null;
    public conTipo: string = null;
    public conNumero: string = null;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.transEmpresa = data.transEmpresa ? data.transEmpresa : this.transEmpresa;
        this.transPeriodo = data.transPeriodo ? data.transPeriodo : this.transPeriodo;
        this.transMotivo = data.transMotivo ? data.transMotivo : this.transMotivo;
        this.transNumero = data.transNumero ? data.transNumero : this.transNumero;
        this.transFecha = data.transFecha ? data.transFecha : this.transFecha;
        this.transObservaciones = data.transObservaciones ? data.transObservaciones : this.transObservaciones;
        this.transPendiente = data.transPendiente ? data.transPendiente : this.transPendiente;
        this.transRevisado = data.transRevisado ? data.transRevisado : this.transRevisado;
        this.transAnulado = data.transAnulado ? data.transAnulado : this.transAnulado;
        this.conEmpresa = data.conEmpresa ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data.conPeriodo ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}