export class AnxRetencionesVentasListadoSimpleTO {

    venFecha: string = "";
    venIdentificacion: string = "";
    venNombre: string = "";
    venComprobanteTipo: string = "";
    venComprobanteNumero: string = "";
    venAutorizacion: string = "";
    venBaseNoObjetoIva: number = 0;
    venBase0: number = 0;
    venBaseImponible: number = 0;
    venMontoIva: number = 0;
    venValorRetenidoIva: number = 0;
    venValorRetenidoRenta: number = 0;
    venRetencion: number = 0;
    venRetencionAutorizacion: number = 0;
    venRetencionFechaEmision: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.venFecha = data.venFecha ? data.venFecha : this.venFecha;
        this.venIdentificacion = data.venIdentificacion ? data.venIdentificacion : this.venIdentificacion;
        this.venNombre = data.venNombre ? data.venNombre : this.venNombre;
        this.venComprobanteTipo = data.venComprobanteTipo ? data.venComprobanteTipo : this.venComprobanteTipo;
        this.venComprobanteNumero = data.venComprobanteNumero ? data.venComprobanteNumero : this.venComprobanteNumero;
        this.venAutorizacion = data.venAutorizacion ? data.venAutorizacion : this.venAutorizacion;
        this.venBaseNoObjetoIva = data.venBaseNoObjetoIva ? data.venBaseNoObjetoIva : this.venBaseNoObjetoIva;
        this.venBase0 = data.venBase0 ? data.venBase0 : this.venBase0;
        this.venBaseImponible = data.venBaseImponible ? data.venBaseImponible : this.venBaseImponible;
        this.venMontoIva = data.venMontoIva ? data.venMontoIva : this.venMontoIva;
        this.venValorRetenidoIva = data.venValorRetenidoIva ? data.venValorRetenidoIva : this.venValorRetenidoIva;
        this.venValorRetenidoRenta = data.venValorRetenidoRenta ? data.venValorRetenidoRenta : this.venValorRetenidoRenta;
        this.venRetencion = data.venRetencion ? data.venRetencion : this.venRetencion;
        this.venRetencionAutorizacion = data.venRetencionAutorizacion ? data.venRetencionAutorizacion : this.venRetencionAutorizacion;
        this.venRetencionFechaEmision = data.venRetencionFechaEmision ? data.venRetencionFechaEmision : this.venRetencionFechaEmision;
    }
}