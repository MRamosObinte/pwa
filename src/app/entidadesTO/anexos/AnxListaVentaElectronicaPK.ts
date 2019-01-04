export class AnxListaVentaElectronicaPK {

    vtaPeriodo: string = "";
    vtaMotivo: string = "";
    vtaNumero: string = "";
    vtaDocumento_tipo: string = "";
    vtaFecha: string = "";
    vtaClienteRazonSocial: string = "";
    vtaAutorizacionFecha: string = "";
    vtaAutorizacionNumero: string = "";
    vtaDocumentoNumero: string = "";
    emailEnviado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vtaPeriodo = data.vtaPeriodo ? data.vtaPeriodo : this.vtaPeriodo;
        this.vtaMotivo = data.vtaMotivo ? data.vtaMotivo : this.vtaMotivo;
        this.vtaNumero = data.vtaNumero ? data.vtaNumero : this.vtaNumero;
        this.vtaClienteRazonSocial = data.vtaClienteRazonSocial ? data.vtaClienteRazonSocial : this.vtaClienteRazonSocial;
        this.vtaDocumento_tipo = data.vtaDocumento_tipo ? data.vtaDocumento_tipo : this.vtaDocumento_tipo;
        this.vtaDocumentoNumero = data.vtaDocumentoNumero ? data.vtaDocumentoNumero : this.vtaDocumentoNumero;
        this.vtaFecha = data.vtaFecha ? data.vtaFecha : this.vtaFecha;
        this.vtaAutorizacionFecha = data.vtaAutorizacionFecha ? data.vtaAutorizacionFecha : this.vtaAutorizacionFecha;
        this.vtaAutorizacionNumero = data.vtaAutorizacionNumero ? data.vtaAutorizacionNumero : this.vtaAutorizacionNumero;
        this.emailEnviado = data.emailEnviado ? data.emailEnviado : this.emailEnviado;
    }
}