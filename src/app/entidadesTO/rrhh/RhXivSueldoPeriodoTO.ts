export class RhXivSueldoPeriodoTO {
    xivDescripcion: string = "";
    xivDesde: string = null;
    xivHasta: string = null;
    xivFechaMaximaPago: string = null;
    xivSalarioMinimoVital: string = null;
    periodoSecuencial: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.xivDescripcion = data.xivDescripcion ? data.xivDescripcion : this.xivDescripcion;
        this.xivDesde = data.xivDesde ? data.xivDesde : this.xivDesde;
        this.xivHasta = data.xivHasta ? data.xivHasta : this.xivHasta;
        this.xivFechaMaximaPago = data.xivFechaMaximaPago ? data.xivFechaMaximaPago : this.xivFechaMaximaPago;
        this.periodoSecuencial = data.periodoSecuencial ? data.periodoSecuencial : this.periodoSecuencial;
    }
}