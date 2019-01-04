export class AnxNumeracion {

    numSecuencial: number = 0;
    numEmpresa: String = "";
    numComprobante: String = "";
    numDesde: String = "";
    numHasta: String = "";
    numAutorizacion: String = "";
    numCaduca: String = "";
    numLineas: number = 0;
    numFormatoPos: boolean = false;
    numDocumentoElectronico: boolean = false;
    numAmbienteProduccion: boolean = false;
    numAutorizacionAutomatica: boolean = false;
    numMostrarDialogoImpresion: boolean = false;
    secEmpresa: String = "";
    secCodigo: String = "";
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.numSecuencial = data.numSecuencial ? data.numSecuencial : this.numSecuencial;
        this.numEmpresa = data.numEmpresa ? data.numEmpresa : this.numEmpresa;
        this.numComprobante = data.numComprobante ? data.numComprobante : this.numComprobante;
        this.numDesde = data.numDesde ? data.numDesde : this.numDesde;
        this.numHasta = data.numHasta ? data.numHasta : this.numHasta;
        this.numAutorizacion = data.numAutorizacion ? data.numAutorizacion : this.numAutorizacion;
        this.numCaduca = data.numCaduca ? data.numCaduca : this.numCaduca;
        this.numLineas = data.numLineas ? data.numLineas : this.numLineas;
        this.numFormatoPos = data.numFormatoPos ? data.numFormatoPos : this.numFormatoPos;
        this.numDocumentoElectronico = data.numDocumentoElectronico ? data.numDocumentoElectronico : this.numDocumentoElectronico;
        this.numAmbienteProduccion = data.numAmbienteProduccion ? data.numAmbienteProduccion : this.numAmbienteProduccion;
        this.numAutorizacionAutomatica = data.numAutorizacionAutomatica ? data.numAutorizacionAutomatica : this.numAutorizacionAutomatica;
        this.numMostrarDialogoImpresion = data.numMostrarDialogoImpresion ? data.numMostrarDialogoImpresion : this.numMostrarDialogoImpresion;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}