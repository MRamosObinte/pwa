import { InvPedidosMotivoPK } from "./InvPedidosMotivoPK";
import { PrdSector } from "../produccion/PrdSector";
import { InvProductoCategoria } from "./InvProductoCategoria";

export class InvPedidosMotivo {

    invPedidosMotivoPK: InvPedidosMotivoPK = new InvPedidosMotivoPK();
    pmDetalle: String = "";
    pmAprobacionAutomatica: boolean = false;
    pmExigirCliente: boolean = false;
    pmLunes: boolean = false;
    pmMartes: boolean = false;
    pmMiercoles: boolean = false;
    pmJueves: boolean = false;
    pmViernes: boolean = false;
    pmSabado: boolean = false;
    pmDomingo: boolean = false;
    pmHoraInicio: string = null;
    pmHoraFin: string = null;
    pmPlazoPredeterminado: number = 0;
    pmNotificarProveedor: boolean = false;
    pmNotificarAprobador: boolean = true;
    pmNotificarRegistrador: boolean = true;
    pmNotificarEjecutor: boolean = true;
    pmInactivo: boolean = false;
    usrCodigo: string = "";
    usrFechaInserta: Date = null;
    prdSector: PrdSector = new PrdSector();
    invProductoCategoria: InvProductoCategoria = new InvProductoCategoria();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invPedidosMotivoPK = data.invPedidosMotivoPK ? data.invPedidosMotivoPK : this.invPedidosMotivoPK;
        this.pmDetalle = data.pmDetalle ? data.pmDetalle : this.pmDetalle;
        this.pmLunes = data.pmLunes ? data.pmLunes : this.pmLunes;
        this.pmMartes = data.pmMartes ? data.pmMartes : this.pmMartes;
        this.pmMiercoles = data.pmMiercoles ? data.pmMiercoles : this.pmMiercoles;
        this.pmJueves = data.pmJueves ? data.pmJueves : this.pmJueves;
        this.pmViernes = data.pmViernes ? data.pmViernes : this.pmViernes;
        this.pmSabado = data.pmSabado ? data.pmSabado : this.pmSabado;
        this.pmDomingo = data.pmDomingo ? data.pmDomingo : this.pmDomingo;
        this.pmHoraInicio = data.pmHoraInicio ? data.pmHoraInicio : this.pmHoraInicio;
        this.pmHoraFin = data.pmHoraFin ? data.pmHoraFin : this.pmHoraFin;
        this.pmPlazoPredeterminado = data.pmPlazoPredeterminado ? data.pmPlazoPredeterminado : this.pmPlazoPredeterminado;
        this.pmInactivo = data.pmInactivo ? data.pmInactivo : this.pmInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.invProductoCategoria = data.invProductoCategoria ? data.invProductoCategoria : this.invProductoCategoria;
        this.pmAprobacionAutomatica = data.pmAprobacionAutomatica === true || data.pmAprobacionAutomatica === false ? data.pmAprobacionAutomatica : this.pmAprobacionAutomatica;
        this.pmNotificarAprobador = data.pmNotificarAprobador === true || data.pmNotificarAprobador === false ? data.pmNotificarAprobador : this.pmNotificarAprobador;
        this.pmNotificarRegistrador = data.pmNotificarRegistrador === true || data.pmNotificarRegistrador === false ? data.pmNotificarRegistrador : this.pmNotificarRegistrador;
        this.pmNotificarEjecutor = data.pmNotificarEjecutor ? data.pmNotificarEjecutor : this.pmNotificarEjecutor;
        this.pmNotificarProveedor = data.pmNotificarProveedor ? data.pmNotificarProveedor : this.pmNotificarProveedor;
        this.pmExigirCliente = data.pmExigirCliente ? data.pmExigirCliente : this.pmExigirCliente;
    }
}