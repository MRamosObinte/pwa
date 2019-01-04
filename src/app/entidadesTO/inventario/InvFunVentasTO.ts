export class InvFunVentasTO {
    id: number = null;
    vtaNumeroSistema: string = null;
    vtaFecha: string = null;
    vtaIdentificacion: string = null;
    vtaIdNumero: string = null;
    vtaCliente: string = null;
    vtaDocumentoNumero: string = null;
    vtaDocumentoTipo: string = null;
    vtaFormaPago: string = null;
    vtaObservaciones: string = null;
    vtaCantidad: number = null;
    vtaBase0: number = null;
    vtaBaseImponible: number = null;
    vtaMontoIva: number = null;
    vtaTotal: number = null;
    vtaPendiente: boolean = false;
    vtaAnulado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vtaNumeroSistema = data.vtaNumeroSistema ? data.vtaNumeroSistema : this.vtaNumeroSistema;
        this.vtaFecha = data.vtaFecha ? data.vtaFecha : this.vtaFecha;
        this.vtaIdentificacion = data.vtaIdentificacion ? data.vtaIdentificacion : this.vtaIdentificacion;
        this.vtaCliente = data.vtaCliente ? data.vtaCliente : this.vtaCliente;
        this.vtaDocumentoNumero = data.vtaDocumentoNumero ? data.vtaDocumentoNumero : this.vtaDocumentoNumero;
        this.vtaFormaPago = data.vtaFormaPago ? data.vtaFormaPago : this.vtaFormaPago;
        this.vtaObservaciones = data.vtaObservaciones ? data.vtaObservaciones : this.vtaObservaciones;
        this.vtaCantidad = data.vtaCantidad ? data.vtaCantidad : this.vtaCantidad;
        this.vtaBase0 = data.vtaBase0 ? data.vtaBase0 : this.vtaBase0;
        this.vtaBaseImponible = data.vtaBaseImponible ? data.vtaBaseImponible : this.vtaBaseImponible;
        this.vtaMontoIva = data.vtaMontoIva ? data.vtaMontoIva : this.vtaMontoIva;
        this.vtaTotal = data.vtaTotal ? data.vtaTotal : this.vtaTotal;
        this.vtaPendiente = data.vtaPendiente ? data.vtaPendiente : this.vtaPendiente;
        this.vtaAnulado = data.vtaAnulado ? data.vtaAnulado : this.vtaAnulado;
        this.vtaIdNumero = data.vtaIdNumero ? data.vtaIdNumero : this.vtaIdNumero;
        this.vtaDocumentoTipo = data.vtaDocumentoTipo ? data.vtaDocumentoTipo : this.vtaDocumentoTipo;
    }

}