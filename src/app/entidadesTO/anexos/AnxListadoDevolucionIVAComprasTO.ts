export class AnxListadoDevolucionIVACompras {

    actSustentoTributario: string = "";
    actFecha: Date;
    actProveedorNombre: string = "";
    actProveedorIdTipo: string = "";
    actProveedorIdNumero: string = "";
    actDocumentoTipo: string = "";
    actDocumentoNumero: string = "";
    actAutorizacion: string = "";
    actAutorizacionElectronica: string = "";
    actBase0: number = 0;
    actBaseImponible: number = 0;
    actIva: number = 0;
    actTotal: number = 0;
    actClaveAccesoRetencion: string = "";
    actNecesitaSoporte: string = "";
    actSecuencia: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.actSustentoTributario = data.actSustentoTributario ? data.actSustentoTributario : this.actSustentoTributario;
        this.actFecha = data.actFecha ? data.actFecha : this.actFecha;
        this.actProveedorNombre = data.actProveedorNombre ? data.actProveedorNombre : this.actProveedorNombre;
        this.actProveedorIdTipo = data.actProveedorIdTipo ? data.actProveedorIdTipo : this.actProveedorIdTipo;
        this.actProveedorIdNumero = data.actProveedorIdNumero ? data.actProveedorIdNumero : this.actProveedorIdNumero;
        this.actDocumentoTipo = data.actDocumentoTipo ? data.actDocumentoTipo : this.actDocumentoTipo;
        this.actDocumentoNumero = data.actDocumentoNumero ? data.actDocumentoNumero : this.actDocumentoNumero;
        this.actAutorizacion = data.actAutorizacion ? data.actAutorizacion : this.actAutorizacion;
        this.actAutorizacionElectronica = data.actAutorizacionElectronica ? data.actAutorizacionElectronica : this.actAutorizacionElectronica;
        this.actBase0 = data.actBase0 ? data.actBase0 : this.actBase0;
        this.actBaseImponible = data.actBaseImponible ? data.actBaseImponible : this.actBaseImponible;
        this.actIva = data.actIva ? data.actIva : this.actIva;
        this.actTotal = data.actTotal ? data.actTotal : this.actTotal;
        this.actClaveAccesoRetencion = data.actClaveAccesoRetencion ? data.actClaveAccesoRetencion : this.actClaveAccesoRetencion;
        this.actNecesitaSoporte = data.actNecesitaSoporte ? data.actNecesitaSoporte : this.actNecesitaSoporte;
        this.actSecuencia = data.actSecuencia ? data.actSecuencia : this.actSecuencia;
    }
}