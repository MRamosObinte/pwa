
export class PrdListaFunAnalisisPesosTO {

    apPiscina: string = "";
    apSector: string = "";
    apCorrida: string = "";
    apHectareas: number = 0;
    apFechaSiembra: string = "";
    apFormaSiembra: string = "";
    apDensidadMetroCuadrado: number = 0;
    apSobrevivenciaMetroCuadrado: number = 0;
    apRaleo: number = 0;
    apEdad: number = 0;
    apPesoIdeal: number = 0;
    apPesoSobreIdeal: number = 0;
    apPesoPromedioActual: number = 0;
    apPesoIncrementoSemana4: number = 0;
    apPesoIncrementoSemana3: number = 0;
    apPesoIncrementoSemana2: number = 0;
    apPesoIncrementoSemana1: number = 0;
    apPesoIncrementoPromedio: number = 0;
    apBalanceadoTipo: string = "";
    apBalanceadoSacos: number = 0;
    apBalanceadoKilosHectarea: number = 0;
    apBalanceadoAcumulado: number = 0;
    apBiomasaProyectada: number = 0;
    apConversionAlimenticia: number = 0;
    apLaboratorio: string = "";
    apNauplio: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.apPiscina = data.apPiscina ? data.apPiscina : this.apPiscina;
        this.apCorrida = data.apCorrida ? data.apCorrida : this.apCorrida;
        this.apFechaSiembra = data.apFechaSiembra ? data.apFechaSiembra : this.apFechaSiembra;
        this.apSobrevivenciaMetroCuadrado = data.apSobrevivenciaMetroCuadrado ? data.apSobrevivenciaMetroCuadrado : this.apSobrevivenciaMetroCuadrado;
        this.apRaleo = data.apRaleo ? data.apRaleo : this.apRaleo;
        this.apEdad = data.apEdad ? data.apEdad : this.apEdad;
        this.apPesoIdeal = data.apPesoIdeal ? data.apPesoIdeal : this.apPesoIdeal;
        this.apPesoIncrementoSemana1 = data.apPesoIncrementoSemana1 ? data.apPesoIncrementoSemana1 : this.apPesoIncrementoSemana1;
        this.apPesoIncrementoSemana2 = data.apPesoIncrementoSemana2 ? data.apPesoIncrementoSemana2 : this.apPesoIncrementoSemana2;
        this.apPesoIncrementoSemana3 = data.apPesoIncrementoSemana3 ? data.apPesoIncrementoSemana3 : this.apPesoIncrementoSemana3;
        this.apPesoIncrementoSemana4 = data.apPesoIncrementoSemana4 ? data.apPesoIncrementoSemana4 : this.apPesoIncrementoSemana4;
        this.apPesoIncrementoPromedio = data.apPesoIncrementoPromedio ? data.apPesoIncrementoPromedio : this.apPesoIncrementoPromedio;
        this.apBiomasaProyectada = data.apBiomasaProyectada ? data.apBiomasaProyectada : this.apBiomasaProyectada;
        this.apConversionAlimenticia = data.apConversionAlimenticia ? data.apConversionAlimenticia : this.apConversionAlimenticia;
    }
}