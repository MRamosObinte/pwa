export class AnxRetencionesRentaComprasTO {

    retSustentotributario: string = "";
    retConcepto: string = "";
    retProveedorId: string = "";
    retProveedorNombre: string = "";
    retDocumentoNombre: string = "";
    retDocumentoAutorizacion: string = "";
    retDocumentoNumero: string = "";
    retCompraFecha: string = "";
    retCompraBase0: number = 0;
    retComprabaseImponible: number = 0;
    retRetencionAutorizacion: string = "";
    retRetencionNumero: string = "";
    retRetencionFecha: string = "";
    retValorRetenidoIr: string = "";
    retLlaveCompra: string = "";
    retLlavecontable: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.retSustentotributario = data.retSustentotributario ? data.retSustentotributario : this.retSustentotributario;
        this.retConcepto = data.retConcepto ? data.retConcepto : this.retConcepto;
        this.retProveedorId = data.retProveedorId ? data.retProveedorId : this.retProveedorId;
        this.retProveedorNombre = data.retProveedorNombre ? data.retProveedorNombre : this.retProveedorNombre;
        this.retDocumentoNombre = data.retDocumentoNombre ? data.retDocumentoNombre : this.retDocumentoNombre;
        this.retDocumentoAutorizacion = data.retDocumentoAutorizacion ? data.retDocumentoAutorizacion : this.retDocumentoAutorizacion;
        this.retDocumentoNumero = data.retDocumentoNumero ? data.retDocumentoNumero : this.retDocumentoNumero;
        this.retCompraFecha = data.retCompraFecha ? data.retCompraFecha : this.retCompraFecha;
        this.retCompraBase0 = data.retCompraBase0 ? data.retCompraBase0 : this.retCompraBase0;
        this.retComprabaseImponible = data.retComprabaseImponible ? data.retComprabaseImponible : this.retComprabaseImponible;
        this.retRetencionAutorizacion = data.retRetencionAutorizacion ? data.retRetencionAutorizacion : this.retRetencionAutorizacion;
        this.retRetencionNumero = data.retRetencionNumero ? data.retRetencionNumero : this.retRetencionNumero;
        this.retRetencionFecha = data.retRetencionFecha ? data.retRetencionFecha : this.retRetencionFecha;
        this.retValorRetenidoIr = data.retValorRetenidoIr ? data.retValorRetenidoIr : this.retValorRetenidoIr;
        this.retLlaveCompra = data.retLlaveCompra ? data.retLlaveCompra : this.retLlaveCompra;
        this.retLlavecontable = data.retLlavecontable ? data.retLlavecontable : this.retLlavecontable;
    }

}