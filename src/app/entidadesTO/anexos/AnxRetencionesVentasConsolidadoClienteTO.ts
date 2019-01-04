export class AnxRetencionesVentasConsolidadoClienteTO{

    rvcTransaccion: string = "";
    rvcIdentificacion: string = "";
    rvcComprobanteTipo: string = "";
    rvcNumeroRetenciones: number = 0;
    rvcBaseNoObjetoIva: number = 0;
    rvcBase0: number = 0;
    venBaseImponible: number = 0;
    venMontoIva: number = 0;
    venValorRetenidoIva: number = 0;
    venValorRetenidoRenta: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rvcTransaccion = data.rvcTransaccion ? data.rvcTransaccion : this.rvcTransaccion;
        this.rvcIdentificacion = data.rvcIdentificacion ? data.rvcIdentificacion : this.rvcIdentificacion;
        this.rvcComprobanteTipo = data.rvcComprobanteTipo ? data.rvcComprobanteTipo : this.rvcComprobanteTipo;
        this.rvcNumeroRetenciones = data.rvcNumeroRetenciones ? data.rvcNumeroRetenciones : this.rvcNumeroRetenciones;
        this.rvcBaseNoObjetoIva = data.rvcBaseNoObjetoIva ? data.rvcBaseNoObjetoIva : this.rvcBaseNoObjetoIva;
        this.rvcBase0 = data.rvcBase0 ? data.rvcBase0 : this.rvcBase0;
        this.venBaseImponible = data.venBaseImponible ? data.venBaseImponible : this.venBaseImponible;
        this.venMontoIva = data.venMontoIva ? data.venMontoIva : this.venMontoIva;
        this.venValorRetenidoIva = data.venValorRetenidoIva ? data.venValorRetenidoIva : this.venValorRetenidoIva;
        this.venValorRetenidoRenta = data.venValorRetenidoRenta ? data.venValorRetenidoRenta : this.venValorRetenidoRenta;
    }
}