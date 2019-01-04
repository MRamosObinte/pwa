export class RhParametros {

    parSecuencial: number = 0;
    parDesde: Date = null;
    parHasta: Date = null;
    parIessPorcentajeAporteIndividual: number = 0;
    parIessPorcentajeAporteExtendido: number = 0;
    parIessPorcentajeAportePatronal: number = 0;
    parIessPorcentajeIece: number = 0;
    parIessPorcentajeSecap: number = 0;
    parSalarioMinimoVital: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.parSecuencial = data.parSecuencial ? data.parSecuencial : this.parSecuencial;
        this.parDesde = data.parDesde ? data.parDesde : this.parDesde;
        this.parHasta = data.parHasta ? data.parHasta : this.parHasta;
        this.parIessPorcentajeAporteIndividual = data.parIessPorcentajeAporteIndividual ? data.parIessPorcentajeAporteIndividual : this.parIessPorcentajeAporteIndividual;
        this.parIessPorcentajeAporteExtendido = data.parIessPorcentajeAporteExtendido ? data.parIessPorcentajeAporteExtendido : this.parIessPorcentajeAporteExtendido;
        this.parIessPorcentajeAportePatronal = data.parIessPorcentajeAportePatronal ? data.parIessPorcentajeAportePatronal : this.parIessPorcentajeAportePatronal;
        this.parIessPorcentajeIece = data.parIessPorcentajeIece ? data.parIessPorcentajeIece : this.parIessPorcentajeIece;
        this.parIessPorcentajeSecap = data.parIessPorcentajeSecap ? data.parIessPorcentajeSecap : this.parIessPorcentajeSecap;
        this.parSalarioMinimoVital = data.parSalarioMinimoVital ? data.parSalarioMinimoVital : this.parSalarioMinimoVital;
    }
}