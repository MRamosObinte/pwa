export class InvPedidosMotivoTO {

    pmEmpresa: String = "";
    pmCodigo: String = "";
    pmSector: String = "";
    pmDetalle: String = "";
    pmLunes: boolean = false;
    pmMartes: boolean = false;
    pmMiercoles: boolean = false;
    pmJueves: boolean = false;
    pmViernes: boolean = false;
    pmSabado: boolean = false;
    pmDomingo: boolean = false;
    pmHoraInicio: string = null;
    pmHoraFin: string = null;
    pmInactivo: boolean = false;
    usrCodigo: string = "";
    usrFechaInserta: Date = null;
    pmAprobacionAutomatica: boolean = false;
    pmExigirCliente: boolean = false;
    pmNotificarAprobador: boolean = false;
    pmNotificarRegistrador: boolean = false;
    pmNotificarEjecutor: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pmEmpresa = data.pmEmpresa ? data.pmEmpresa : this.pmEmpresa;
        this.pmCodigo = data.pmCodigo ? data.pmCodigo : this.pmCodigo;
        this.pmSector = data.pmSector ? data.pmSector : this.pmSector;
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
        this.pmInactivo = data.pmInactivo ? data.pmInactivo : this.pmInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.pmAprobacionAutomatica = data.pmAprobacionAutomatica ? data.pmAprobacionAutomatica : this.pmAprobacionAutomatica;
        this.pmExigirCliente = data.pmExigirCliente ? data.pmExigirCliente : this.pmExigirCliente;
        this.pmNotificarAprobador = data.pmNotificarAprobador ? data.pmNotificarAprobador : this.pmNotificarAprobador;
        this.pmNotificarRegistrador = data.pmNotificarRegistrador ? data.pmNotificarRegistrador : this.pmNotificarRegistrador;
        this.pmNotificarEjecutor = data.pmNotificarEjecutor ? data.pmNotificarEjecutor : this.pmNotificarEjecutor;
    }
}