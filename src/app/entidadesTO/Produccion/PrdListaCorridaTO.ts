
export class PrdListaCorridaTO {

    corNumero: string = "";
    corFechaDesde: string = "";
    corHectareas: number = 0;
    corNumeroLarvas: number = 0;
    corLaboratorio: string = "";
    corNauplio: string = "";
    corPellet: number = 0;
    corFechaSiembra: string = "";
    corTipoSiembra: string = "";
    corBiomasa: number = 0;
    corValorVenta: number = 0;
    corObservaciones: string = "";
    corFechaPesca: string = "";
    corFechaHasta: string = "";
    corActiva: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.corNumero = data.corNumero ? data.corNumero : this.corNumero;
        this.corFechaDesde = data.corFechaDesde ? data.corFechaDesde : this.corFechaDesde;
        this.corHectareas = data.corHectareas ? data.corHectareas : this.corHectareas;
        this.corNumeroLarvas = data.corNumeroLarvas ? data.corNumeroLarvas : this.corNumeroLarvas;
        this.corLaboratorio = data.corLaboratorio ? data.corLaboratorio : this.corLaboratorio;
        this.corNauplio = data.corNauplio ? data.corNauplio : this.corNauplio;
        this.corPellet = data.corPellet ? data.corPellet : this.corPellet;
        this.corFechaSiembra = data.corFechaSiembra ? data.corFechaSiembra : this.corFechaSiembra;
        this.corTipoSiembra = data.corTipoSiembra ? data.corTipoSiembra : this.corTipoSiembra;
        this.corBiomasa = data.corBiomasa ? data.corBiomasa : this.corBiomasa;
        this.corValorVenta = data.corValorVenta ? data.corValorVenta : this.corValorVenta;
        this.corObservaciones = data.corObservaciones ? data.corObservaciones : this.corObservaciones;
        this.corFechaPesca = data.corFechaPesca ? data.corFechaPesca : this.corFechaPesca;
        this.corFechaHasta = data.corFechaHasta ? data.corFechaHasta : this.corFechaHasta;
        this.corActiva = data.corActiva ? data.corActiva : this.corActiva;
    }
}