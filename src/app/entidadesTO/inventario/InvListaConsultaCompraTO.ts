export class InvListaConsultaCompraTO {
    public id: number = null;
    public compStatus: string = null;
    public compDocumentoNumero: string = null;
    public compFecha: string = null;
    public provCodigo: string = null;
    public provRazonSocial: string = null;
    public compBase0: number = null;
    public compBaseImponible: number = null;
    public compMontoIva: number = null;
    public compTotal: number = null;
    public compFormaPago: string = null;
    public compObservaciones: string = null;
    public compNumero: string = null;
    public conContable: string = null;
    public compDatosAdjuntos: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.compStatus = data.compStatus ? data.compStatus : this.compStatus;
        this.compDocumentoNumero = data.compDocumentoNumero ? data.compDocumentoNumero : this.compDocumentoNumero;
        this.compFecha = data.compFecha ? data.compFecha : this.compFecha;
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.provRazonSocial = data.provRazonSocial ? data.provRazonSocial : this.provRazonSocial;
        this.compBase0 = data.compBase0 ? data.compBase0 : this.compBase0;
        this.compBaseImponible = data.compBaseImponible ? data.compBaseImponible : this.compBaseImponible;
        this.compMontoIva = data.compMontoIva ? data.compMontoIva : this.compMontoIva;
        this.compTotal = data.compTotal ? data.compTotal : this.compTotal;
        this.compFormaPago = data.compFormaPago ? data.compFormaPago : this.compFormaPago;
        this.compObservaciones = data.compObservaciones ? data.compObservaciones : this.compObservaciones;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.conContable = data.conContable ? data.conContable : this.conContable;
        this.compDatosAdjuntos = data.compDatosAdjuntos ? data.compDatosAdjuntos : this.compDatosAdjuntos;
    }
}