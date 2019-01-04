export class InvListaConsultaVentaTO {

    id: number = 0;
    vtaStatus: string = "";
    vtaDocumentoNumero: string = "";
    vtaDocumentoTipo: string = "";
    vtaFecha: string = "";
    cliCodigo: string = "";
    cliId: string = "";
    cliNombre: string = "";
    vtaBase0: number = 0;
    vtaBaseImponible: number = 0;
    vtaMontoIva: number = 0;
    vtaTotal: number = 0;
    vtaFormaPago: string = "";
    vtaObservaciones: string = "";
    vtaNumero: string = "";
    conNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vtaStatus = data.vtaStatus ? data.vtaStatus : this.vtaStatus;
        this.vtaDocumentoNumero = data.vtaDocumentoNumero ? data.vtaDocumentoNumero : this.vtaDocumentoNumero;
        this.vtaDocumentoTipo = data.vtaDocumentoTipo ? data.vtaDocumentoTipo : this.vtaDocumentoTipo;
        this.vtaFecha = data.vtaFecha ? data.vtaFecha : this.vtaFecha;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
        this.cliId = data.cliId ? data.cliId : this.cliId;
        this.cliNombre = data.cliNombre ? data.cliNombre : this.cliNombre;
        this.vtaBase0 = data.vtaBase0 ? data.vtaBase0 : this.vtaBase0;
        this.vtaBaseImponible = data.vtaBaseImponible ? data.vtaBaseImponible : this.vtaBaseImponible;
        this.vtaMontoIva = data.vtaMontoIva ? data.vtaMontoIva : this.vtaMontoIva;
        this.vtaTotal = data.vtaTotal ? data.vtaTotal : this.vtaTotal;
        this.vtaFormaPago = data.vtaFormaPago ? data.vtaFormaPago : this.vtaFormaPago;
        this.vtaObservaciones = data.vtaObservaciones ? data.vtaObservaciones : this.vtaObservaciones;
        this.vtaNumero = data.vtaNumero ? data.vtaNumero : this.vtaNumero;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
    }

}