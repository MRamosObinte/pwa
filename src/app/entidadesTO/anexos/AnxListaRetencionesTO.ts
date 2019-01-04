export class AnxListaRetencionesTO {
    retSustentoTributario: string = "";
    retProveedorTipo: string = "";
    retProveedorId: string = "";
    retProveedorNombre: string = "";
    retProveedorDireccion: string = "";
    retProveedorCiudad: string = "";
    retProveedorRelacionado: string = "";
    retDocumentoTipo: string = "";
    retDocumentoNombre: string = "";
    retDocumentoAutorizacion: string = "";
    retDocumentoNumero: string = "";
    retCompraFecha: string = "";
    retCompraBase0: number = 0;
    retCompraBaseImponible: number = 0;
    retCompraBaseExenta: number = 0;
    retCompraMontoIce: number = 0;
    retIvavigente: number = 0;
    retCompraMontoIva: number = 0;
    retRetencionAutorizacion: number = 0;
    retRetencionNumero: number = 0;
    retRetencionFecha: number = 0;
    retValorRetenidoIr: number = 0;
    retValorBienes10: number = 0;
    retValorBienes30: number = 0;
    retValorServicios50: number = 0;
    retValorServicios70: number = 0;
    retValorServiciosProfesionales: number = 0;
    retValorRetenidoIva: number = 0;
    retTotalRetenido: number = 0;
    retModificadoDocumentoTipo: string = "";
    retModificadoDocumentonumero: string = "";
    retModificadoAutorizacion: string = "";
    retLlaveCompra: string = "";
    retLlaveContable: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.retSustentoTributario = data.retSustentoTributario ? data.retSustentoTributario : this.retSustentoTributario;
        this.retProveedorTipo = data.retProveedorTipo ? data.retProveedorTipo : this.retProveedorTipo;
        this.retProveedorId = data.retProveedorId ? data.retProveedorId : this.retProveedorId;
        this.retProveedorNombre = data.retProveedorNombre ? data.retProveedorNombre : this.retProveedorNombre;
        this.retProveedorDireccion = data.retProveedorDireccion ? data.retProveedorDireccion : this.retProveedorDireccion;
        this.retProveedorRelacionado = data.retProveedorRelacionado ? data.retProveedorRelacionado : this.retProveedorRelacionado;
        this.retDocumentoTipo = data.retDocumentoTipo ? data.retDocumentoTipo : this.retDocumentoTipo;
        this.retDocumentoNombre = data.retDocumentoNombre ? data.retDocumentoNombre : this.retDocumentoNombre;
        this.retDocumentoAutorizacion = data.retDocumentoAutorizacion ? data.retDocumentoAutorizacion : this.retDocumentoAutorizacion;
        this.retDocumentoNumero = data.retDocumentoNumero ? data.retDocumentoNumero : this.retDocumentoNumero;
        this.retCompraFecha = data.retCompraFecha ? data.retCompraFecha : this.retCompraFecha;
        this.retCompraBase0 = data.retCompraBase0 ? data.retCompraBase0 : this.retCompraBase0;
        this.retCompraBaseImponible = data.retCompraBaseImponible ? data.retCompraBaseImponible : this.retCompraBaseImponible;
        this.retRetencionAutorizacion = data.retRetencionAutorizacion ? data.retRetencionAutorizacion : this.retRetencionAutorizacion;
        this.retRetencionNumero = data.retRetencionNumero ? data.retRetencionNumero : this.retRetencionNumero;
        this.retRetencionFecha = data.retRetencionFecha ? data.retRetencionFecha : this.retRetencionFecha;
        this.retValorRetenidoIr = data.retValorRetenidoIr ? data.retValorRetenidoIr : this.retValorRetenidoIr;
        this.retLlaveCompra = data.retLlaveCompra ? data.retLlaveCompra : this.retLlaveCompra;
        this.retLlaveContable = data.retLlaveContable ? data.retLlaveContable : this.retLlaveContable;
    }

}