import { InvConsumosPK } from "./InvConsumosPK";
import { InvBodega } from "./InvBodega";
import { InvConsumosDetalle } from "./InvConsumosDetalle";
import { InvConsumosMotivoAnulacion } from "./InvConsumosMotivoAnulacion";

export class InvConsumos {
    invConsumosPK: InvConsumosPK = new InvConsumosPK();
    consReferencia: string = "";
    consFecha: any = null;
    consObservaciones: string = "";
    consPendiente: boolean = false;
    consRevisado: boolean = false;
    consAnulado: boolean = false;
    conEmpresa: string = "";
    conPeriodo: string = "";
    conTipo: string = "";
    conNumero: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    consCodigo: string = null;
    usrFechaInserta: Date = null;
    invBodega: InvBodega = new InvBodega();
    invConsumosDetalleList: InvConsumosDetalle[] = [];
    invConsumosMotivoAnulacionList: InvConsumosMotivoAnulacion[] = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invConsumosPK = data.invConsumosPK ? data.invConsumosPK : this.invConsumosPK;
        this.consReferencia = data.consReferencia ? data.consReferencia : this.consReferencia;
        this.consFecha = data.consFecha ? data.consFecha : this.consFecha;
        this.consObservaciones = data.consObservaciones ? data.consObservaciones : this.consObservaciones;
        this.consPendiente = data.consPendiente ? data.consPendiente : this.consPendiente;
        this.consRevisado = data.consRevisado ? data.consRevisado : this.consRevisado;
        this.consAnulado = data.consAnulado ? data.consAnulado : this.consAnulado;
        this.conEmpresa = data.conEmpresa ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data.conPeriodo ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.consCodigo = data.consCodigo ? data.consCodigo : this.consCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;
        this.invConsumosDetalleList = data.invConsumosDetalleList ? data.invConsumosDetalleList : this.invConsumosDetalleList;
        this.invConsumosMotivoAnulacionList = data.invConsumosMotivoAnulacionList ? data.invConsumosMotivoAnulacionList : this.invConsumosMotivoAnulacionList;
    }

}
