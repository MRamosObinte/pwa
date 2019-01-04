export class AnxVentaElectronica {

    eSecuencial: Number = 0;
    eTipoAmbiente: String = "";
    eClaveAcceso: String = "";
    eEstado: String = "";
    eAutorizacionNumero: String = "";
    eAutorizacionFecha: Date = new Date ();
    eXml: ArrayBuffer[] = []; //Byte[] en Java
    eEnviadoPorCorreo: boolean = false;
    vtaEmpresa: String = "";
    vtaPeriodo: String = "";
    vtaMotivo: String = "";
    vtaNumero: String = "";
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date ();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.eSecuencial = data.eSecuencial ? data.eSecuencial : this.eSecuencial;
        this.eTipoAmbiente = data.eTipoAmbiente ? data.eTipoAmbiente : this.eTipoAmbiente;
        this.eClaveAcceso = data.eClaveAcceso ? data.eClaveAcceso : this.eClaveAcceso;
        this.eEstado = data.eEstado ? data.eEstado : this.eEstado;
        this.eAutorizacionNumero = data.eAutorizacionNumero ? data.eAutorizacionNumero : this.eAutorizacionNumero;
        this.eAutorizacionFecha = data.eAutorizacionFecha ? data.eAutorizacionFecha : this.eAutorizacionFecha;
        this.eXml = data.eXml ? data.eXml : this.eXml;
        this.eEnviadoPorCorreo = data.eEnviadoPorCorreo ? data.eEnviadoPorCorreo : this.eEnviadoPorCorreo;
        this.vtaEmpresa = data.vtaEmpresa ? data.vtaEmpresa : this.vtaEmpresa;
        this.vtaPeriodo = data.vtaPeriodo ? data.vtaPeriodo : this.vtaPeriodo;
        this.vtaMotivo = data.vtaMotivo ? data.vtaMotivo : this.vtaMotivo;
        this.vtaNumero = data.vtaNumero ? data.vtaNumero : this.vtaNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}