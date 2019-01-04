export class RhProvisionesListadoTransTO {
    empresa: string = "";
    sector: string = "";
    periodo: string = "";
    estado: string = "";
    datePeriodoHasta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empresa = data.empresa ? data.empresa : this.empresa;
        this.sector = data.sector ? data.sector : this.sector;
        this.periodo = data.periodo ? data.periodo : this.periodo;
        this.estado = data.estado ? data.estado : this.estado;
        this.datePeriodoHasta = data.datePeriodoHasta ? data.datePeriodoHasta : this.datePeriodoHasta;
    }
}