export class AnxValidezComprobanteElectronico {

    tipoComprobante : string = "";
    ambiente : string = "";
    razonSocialEmisor : string = "";
	rucEmisor : string = "";
    estado : string = "";
	numeroDocumento : string = "";
    fechaEmision : string = "";
	fechaAutorizacion : string = "";
    totalComprobante : string = "";
	numeroAutorizacion : string = "";
    codigoDocumento : string = "";
    respuestaComprobante : string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tipoComprobante = data.tipoComprobante ? data.tipoComprobante : this.tipoComprobante;
        this.ambiente = data.ambiente ? data.ambiente : this.ambiente;
        this.razonSocialEmisor = data.razonSocialEmisor ? data.razonSocialEmisor : this.razonSocialEmisor;
        this.rucEmisor = data.rucEmisor ? data.rucEmisor : this.rucEmisor;
        this.estado = data.estado ? data.estado : this.estado;
        this.numeroDocumento = data.numeroDocumento ? data.numeroDocumento : this.numeroDocumento;
        this.fechaEmision = data.fechaEmision ? data.fechaEmision : this.fechaEmision;
        this.fechaAutorizacion = data.fechaAutorizacion ? data.fechaAutorizacion : this.fechaAutorizacion;
        this.totalComprobante = data.totalComprobante ? data.totalComprobante : this.totalComprobante;
        this.numeroAutorizacion = data.numeroAutorizacion ? data.numeroAutorizacion : this.numeroAutorizacion;
        this.codigoDocumento = data.codigoDocumento ? data.codigoDocumento : this.codigoDocumento;
        this.respuestaComprobante = data.respuestaComprobante ? data.respuestaComprobante : this.respuestaComprobante;
    }
}