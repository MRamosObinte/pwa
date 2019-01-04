import { AnxCompra } from "./AnxCompra";

export class AnxCompraElectronica {

    eSecuencial: number = 0;
    eTipoAmbiente: String = "";
    eClaveAcceso: String = "";
    eEstado: String = "";
    eAutorizacionNumero: String = "";
    eAutorizacionFecha: Date = new Date();
    eXml: ArrayBuffer[] = null;//Byte[] en Java
    eEnviadoPorCorreo: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();
    anxCompra: AnxCompra = new AnxCompra();

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
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.anxCompra = data.anxCompra ? data.anxCompra : this.anxCompra;
    }
}