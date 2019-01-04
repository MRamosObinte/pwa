export class AnxListadoDevolucionIVAVentasTO{

    venIdentificacion: string = "";
    venNombre: Date;
    venComprobanteTipo: string = "";
    venComprobanteSerie: string = "";
    venComprobanteSecuencia: string = "";
    venAutorizacionFisica: string = "";
    venAutorizacionElectronica: string = "";
    venTotal: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.venIdentificacion = data.venIdentificacion ? data.venIdentificacion : this.venIdentificacion;
        this.venNombre = data.venNombre ? data.venNombre : this.venNombre;
        this.venComprobanteTipo = data.venComprobanteTipo ? data.venComprobanteTipo : this.venComprobanteTipo;
        this.venComprobanteSerie = data.venComprobanteSerie ? data.venComprobanteSerie : this.venComprobanteSerie;
        this.venComprobanteSecuencia = data.venComprobanteSecuencia ? data.venComprobanteSecuencia : this.venComprobanteSecuencia;
        this.venAutorizacionFisica = data.venAutorizacionFisica ? data.venAutorizacionFisica : this.venAutorizacionFisica;
        this.venAutorizacionElectronica = data.venAutorizacionElectronica ? data.venAutorizacionElectronica : this.venAutorizacionElectronica;
        this.venTotal = data.venTotal ? data.venTotal : this.venTotal;
    }
}