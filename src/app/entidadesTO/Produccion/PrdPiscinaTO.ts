
export class PrdPiscinaTO {
    pisEmpresa: string = "";
    pisSector: string = "";
    pisNumero: string = "";
    pisNombre: string = "";
    pisHectareaje: number = 0;
    pisActiva: boolean = true;
    secEmpresa: string = "";
    secCodigo: string = "";
    ctaCostoDirecto: string = "";
    ctaCostoIndirecto: string = "";
    ctaCostoTransferencia: string = "";
    ctaCostoProductoTerminado: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInsertaPiscina: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.pisNombre = data.pisNombre ? data.pisNombre : this.pisNombre;
        this.pisHectareaje = data.pisHectareaje ? data.pisHectareaje : this.pisHectareaje;
        this.pisActiva = data.pisActiva == true || data.pisActiva == false ? data.pisActiva : this.pisActiva;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaCostoDirecto = data.ctaCostoDirecto ? data.ctaCostoDirecto : this.ctaCostoDirecto;
        this.ctaCostoIndirecto = data.ctaCostoIndirecto ? data.ctaCostoIndirecto : this.ctaCostoIndirecto;
        this.ctaCostoTransferencia = data.ctaCostoTransferencia ? data.ctaCostoTransferencia : this.ctaCostoTransferencia;
        this.ctaCostoProductoTerminado = data.ctaCostoProductoTerminado ? data.ctaCostoProductoTerminado : this.ctaCostoProductoTerminado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaPiscina = data.usrFechaInsertaPiscina ? data.usrFechaInsertaPiscina : this.usrFechaInsertaPiscina;
    }
}