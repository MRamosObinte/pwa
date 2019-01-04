import { InvTransferenciasDetalle } from "./InvTransferenciasDetalle";
import { InvTransferenciasMotivoAnulacion } from "./InvTransferenciasMotivoAnulacion";
import { InvBodega } from "./InvBodega";
import { InvTransferenciasPK } from "./InvTransferenciasPK";

export class InvTransferencias {

    invTransferenciasPK: InvTransferenciasPK = new InvTransferenciasPK();
    transFecha: Date = null;
    transObservaciones: String = null;
    transPendiente: boolean = false;
    transRevisado: boolean = false;
    transAnulado: boolean = false;
    conEmpresa: String = null;
    conPeriodo: String = null;
    conTipo: String = null;
    conNumero: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invBodega: InvBodega = new InvBodega();
    invBodega1: InvBodega = new InvBodega();
    invTransferenciasDetalleList: Array<InvTransferenciasDetalle> = [];
    invTransferenciasMotivoAnulacionList: Array<InvTransferenciasMotivoAnulacion> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invTransferenciasPK = data.invTransferenciasPK ? data.invTransferenciasPK : this.invTransferenciasPK;
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
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;
        this.invBodega1 = data.invBodega1 ? data.invBodega1 : this.invBodega1;
        this.invTransferenciasDetalleList = data.invTransferenciasDetalleList ? data.invTransferenciasDetalleList : this.invTransferenciasDetalleList;
        this.invTransferenciasMotivoAnulacionList = data.invTransferenciasMotivoAnulacionList ? data.invTransferenciasMotivoAnulacionList : this.invTransferenciasMotivoAnulacionList;
    }

}