import { InvCliente } from "./InvCliente";
import { InvProformasPK } from "./InvProformasPK";
import { InvProformasDetalle } from "./InvProformasDetalle";

export class InvProformas {

    invProformasPK: InvProformasPK = new InvProformasPK();
    profFecha: Date = null;
    profIvaVigente: Number = 0;
    profObservaciones: String = null;
    profPendiente: boolean = false;
    profAnulado: boolean = false;
    profBase0: Number = 0;
    profBaseimponible: Number = 0;
    profDescuentoBase0: Number = 0;
    profDescuentoBaseimponible: Number = 0;
    profSubtotalBase0: Number = 0;
    profSubtotalBaseimponible: Number = 0;
    profMontoiva: Number = 0;
    profTotal: Number = 0;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invCliente: InvCliente = new InvCliente();
    invProformasDetalleList: Array<InvProformasDetalle> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invProformasPK = data.invProformasPK ? data.invProformasPK : this.invProformasPK;
        this.profFecha = data.profFecha ? data.profFecha : this.profFecha;
        this.profIvaVigente = data.profIvaVigente ? data.profIvaVigente : this.profIvaVigente;
        this.profObservaciones = data.profObservaciones ? data.profObservaciones : this.profObservaciones;
        this.profPendiente = data.profPendiente ? data.profPendiente : this.profPendiente;
        this.profAnulado = data.profAnulado ? data.profAnulado : this.profAnulado;
        this.profBase0 = data.profBase0 ? data.profBase0 : this.profBase0;
        this.profBaseimponible = data.profBaseimponible ? data.profBaseimponible : this.profBaseimponible;
        this.profDescuentoBase0 = data.profDescuentoBase0 ? data.profDescuentoBase0 : this.profDescuentoBase0;
        this.profDescuentoBaseimponible = data.profDescuentoBaseimponible ? data.profDescuentoBaseimponible : this.profDescuentoBaseimponible;
        this.profSubtotalBase0 = data.profSubtotalBase0 ? data.profSubtotalBase0 : this.profSubtotalBase0;
        this.profSubtotalBaseimponible = data.profSubtotalBaseimponible ? data.profSubtotalBaseimponible : this.profSubtotalBaseimponible;
        this.profMontoiva = data.profMontoiva ? data.profMontoiva : this.profMontoiva;
        this.profTotal = data.profTotal ? data.profTotal : this.profTotal;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invCliente = data.invCliente ? data.invCliente : this.invCliente;
        this.invProformasDetalleList = data.invProformasDetalleList ? data.invProformasDetalleList : this.invProformasDetalleList;
    }
}