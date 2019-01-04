export class PrdResumenPescaSiembraTO {
    id: number;
    rcSector: string = "";
    rcPiscina: string = "";
    rcCorrida: string = "";
    rcHectareaje:  number = 0;
    rcFechaDesde: string = "";
    rcFechaSiembra: string = "";
    rcFechaPesca: string = "";
    rcFechaHasta: string = "";
    rcEdad: number = 0;
    rcDiasMuertos: number = 0;
    rcNumeroLarvas: number = 0;
    rcDensidad: number = 0;
    rcLaboratorio: string = "";
    rcNauplio: string = "";
    rcBalanceado: number = 0;
    rcBiomasa: number = 0;
    rcBiomasaReal: number = 0;
    rcConversion: number = 0;
    rcTallaPromedio: number = 0;
    rcPesoIdeal: number = 0;
    rcSobrevivencia: string = "";
    rcDirecto: number = 0;
    rcIndirecto: number = 0;
    rcTransferencia: number = 0;
    rcSubtotal: number = 0;
    rcAdministrativo: number = 0;
    rcFinanciero: number = 0;
    rcGND: number = 0;
    rcSubtotal2: number = 0;
    rcTotal: number = 0;
    rcVenta: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rcSector = data ? data.rcSector : this.rcSector;
        this.rcPiscina = data ? data.rcPiscina : this.rcPiscina;
        this.rcCorrida = data ? data.rcCorrida : this.rcCorrida;
        this.rcHectareaje = data ? data.rcHectareaje : this.rcHectareaje;
        this.rcFechaDesde = data ? data.rcFechaDesde : this.rcFechaDesde;
        this.rcFechaSiembra = data ? data.rcFechaSiembra : this.rcFechaSiembra;
        this.rcFechaPesca = data ? data.rcFechaPesca : this.rcFechaPesca;
        this.rcFechaHasta = data ? data.rcFechaHasta : this.rcFechaHasta;
        this.rcEdad = data ? data.rcEdad : this.rcEdad;
        this.rcDiasMuertos = data ? data.rcDiasMuertos : this.rcDiasMuertos;
        this.rcNumeroLarvas = data ? data.rcNumeroLarvas : this.rcNumeroLarvas;
        this.rcDensidad = data ? data.rcDensidad : this.rcDensidad;
        this.rcLaboratorio = data ? data.rcLaboratorio : this.rcLaboratorio;
        this.rcNauplio = data ? data.rcNauplio : this.rcNauplio;
        this.rcBalanceado = data ? data.rcBalanceado : this.rcBalanceado;
        this.rcBiomasa = data ? data.rcBiomasa : this.rcBiomasa;
        this.rcBiomasaReal = data ? data.rcBiomasaReal : this.rcBiomasaReal;
        this.rcConversion = data ? data.rcConversion : this.rcConversion;
        this.rcTallaPromedio = data ? data.rcTallaPromedio : this.rcTallaPromedio;
        this.rcPesoIdeal = data ? data.rcPesoIdeal : this.rcPesoIdeal;
        this.rcSobrevivencia = data ? data.rcSobrevivencia : this.rcSobrevivencia;
        this.rcDirecto = data ? data.rcDirecto : this.rcDirecto;
        this.rcIndirecto = data ? data.rcIndirecto : this.rcIndirecto;
        this.rcTransferencia = data ? data.rcTransferencia : this.rcTransferencia;
        this.rcSubtotal = data ? data.rcSubtotal : this.rcSubtotal;
        this.rcAdministrativo = data ? data.rcAdministrativo : this.rcAdministrativo;
        this.rcFinanciero = data ? data.rcFinanciero : this.rcFinanciero;
        this.rcGND = data ? data.rcGND : this.rcGND;
        this.rcSubtotal2 = data ? data.rcSubtotal2 : this.rcSubtotal2;
        this.rcTotal = data ? data.rcTotal : this.rcTotal;
        this.rcVenta = data ? data.rcVenta : this.rcVenta;
    }
}