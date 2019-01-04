export class InvFunComprasTO {
    id: number = null;
    compNumeroSistema: string = null;
    compFecha: string = null;
    compProveedorRuc: string = null;
    compProveedorNombre: string = null;
    compDocumentoTipo: string = null;
    compDocumentoNumero: string = null;
    compDocumentoAutorizacion: string = null;
    compFormaPago: string = null;
    compObservaciones: string = null;
    compBase0: number = null;
    compBaseImponible: number = null;
    compMontoIva: number = null;
    compTotal: number = null;
    compPendiente: boolean = false;
    compAnulado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.compNumeroSistema = data.compNumeroSistema ? data.compNumeroSistema : this.compNumeroSistema;
        this.compFecha = data.compFecha ? data.compFecha : this.compFecha;
        this.compProveedorRuc = data.compProveedorRuc ? data.compProveedorRuc : this.compProveedorRuc;
        this.compProveedorNombre = data.compProveedorNombre ? data.compProveedorNombre : this.compProveedorNombre;
        this.compDocumentoTipo = data.compDocumentoTipo ? data.compDocumentoTipo : this.compDocumentoTipo;
        this.compDocumentoNumero = data.compDocumentoNumero ? data.compDocumentoNumero : this.compDocumentoNumero;
        this.compDocumentoAutorizacion = data.compDocumentoAutorizacion ? data.compDocumentoAutorizacion : this.compDocumentoAutorizacion;
        this.compFormaPago = data.compFormaPago ? data.compFormaPago : this.compFormaPago;
        this.compObservaciones = data.compObservaciones ? data.compObservaciones : this.compObservaciones;
        this.compBase0 = data.compBase0 ? data.compBase0 : this.compBase0;
        this.compBaseImponible = data.compBaseImponible ? data.compBaseImponible : this.compBaseImponible;
        this.compMontoIva = data.compMontoIva ? data.compMontoIva : this.compMontoIva;
        this.compTotal = data.compTotal ? data.compTotal : this.compTotal;
        this.compPendiente = data.compPendiente ? data.compPendiente : this.compPendiente;
        this.compAnulado = data.compAnulado ? data.compAnulado : this.compAnulado;
    }

}