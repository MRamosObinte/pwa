export class RhXiiiSueldoPeriodoTO {
    xiiiDescripcion: string = "";
    xiiiDesde: string = null;
    xiiiHasta: string = null;
    xiiiFechaMaximaPago: string = null;
    periodoSecuencial: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.xiiiDescripcion = data.xiiiDescripcion ? data.xiiiDescripcion : this.xiiiDescripcion;
        this.xiiiDesde = data.xiiiDesde ? data.xiiiDesde : this.xiiiDesde;
        this.xiiiHasta = data.xiiiHasta ? data.xiiiHasta : this.xiiiHasta;
        this.xiiiFechaMaximaPago = data.xiiiFechaMaximaPago ? data.xiiiFechaMaximaPago : this.xiiiFechaMaximaPago;
        this.periodoSecuencial = data.periodoSecuencial ? data.periodoSecuencial : this.periodoSecuencial;
    }
}