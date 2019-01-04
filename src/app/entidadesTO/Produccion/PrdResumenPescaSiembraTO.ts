
export class PrdResumenPescaSiembraTO {
    id: number = null;
    rcSector: string = null;
    rcPiscina: string = null;
    rcCorrida: string = null;
    rcHectareaje: number = null;
    rcFechaDesde: string = null;
    rcFechaSiembra: string = null;
    rcFechaPesca: string = null;
    rcFechaHasta: string = null;
    rcEdad: number = null;
    rcDiasMuertos: number = null;
    rcNumeroLarvas: number = null;
    rcDensidad: number = null;
    rcLaboratorio: string = null;
    rcNauplio: string = null;
    rcBalanceado: number = null;
    rcBiomasa: number = null;
    rcBiomasaReal: number = null;
    rcConversion: number = null;
    rcTallaPromedio: number = null;
    rcPesoIdeal: number = null;
    rcSobrevivencia: string = null;
    rcDirecto: number = null;
    rcIndirecto: number = null;
    rcTransferencia: number = null;
    rcSubtotal: number = null;
    rcAdministrativo: number = null;
    rcFinanciero: number = null;
    rcGND: number = null;
    rcSubtotal2: number = null;
    rcTotal: number = null;
    rcVenta: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.rcSector = data.rcSector ? data.rcSector : this.rcSector;
        this.rcPiscina = data.rcPiscina ? data.rcPiscina : this.rcPiscina;
        this.rcCorrida = data.rcCorrida ? data.rcCorrida : this.rcCorrida;
        this.rcHectareaje = data.rcHectareaje ? data.rcHectareaje : this.rcHectareaje;
        this.rcFechaDesde = data.rcFechaDesde ? data.rcFechaDesde : this.rcFechaDesde;
        this.rcFechaSiembra = data.rcFechaSiembra ? data.rcFechaSiembra : this.rcFechaSiembra;
        this.rcFechaPesca = data.rcFechaPesca ? data.rcFechaPesca : this.rcFechaPesca;
        this.rcFechaHasta = data.rcFechaHasta ? data.rcFechaHasta : this.rcFechaHasta;
        this.rcEdad = data.rcEdad ? data.rcEdad : this.rcEdad;
        this.rcDiasMuertos = data.rcDiasMuertos ? data.rcDiasMuertos : this.rcDiasMuertos;
        this.rcNumeroLarvas = data.rcNumeroLarvas ? data.rcNumeroLarvas : this.rcNumeroLarvas;
        this.rcDensidad = data.rcDensidad ? data.rcDensidad : this.rcDensidad;
        this.rcLaboratorio = data.rcLaboratorio ? data.rcLaboratorio : this.rcLaboratorio;
        this.rcNauplio = data.rcNauplio ? data.rcNauplio : this.rcNauplio;
        this.rcBalanceado = data.rcBalanceado ? data.rcBalanceado : this.rcBalanceado;
        this.rcBiomasa = data.rcBiomasa ? data.rcBiomasa : this.rcBiomasa;
        this.rcBiomasaReal = data.rcBiomasaReal ? data.rcBiomasaReal : this.rcBiomasaReal;
        this.rcConversion = data.rcConversion ? data.rcConversion : this.rcConversion;
        this.rcTallaPromedio = data.rcTallaPromedio ? data.rcTallaPromedio : this.rcTallaPromedio;
        this.rcPesoIdeal = data.rcPesoIdeal ? data.rcPesoIdeal : this.rcPesoIdeal;
        this.rcSobrevivencia = data.rcSobrevivencia ? data.rcSobrevivencia : this.rcSobrevivencia;
        this.rcSubtotal = data.rcSubtotal ? data.rcSubtotal : this.rcSubtotal;
        this.rcAdministrativo = data.rcAdministrativo ? data.rcAdministrativo : this.rcAdministrativo;
        this.rcFinanciero = data.rcFinanciero ? data.rcFinanciero : this.rcFinanciero;
        this.rcGND = data.rcGND ? data.rcGND : this.rcGND;
        this.rcSubtotal2 = data.rcSubtotal2 ? data.rcSubtotal2 : this.rcSubtotal2;
        this.rcTotal = data.rcTotal ? data.rcTotal : this.rcTotal;
        this.rcVenta = data.rcVenta ? data.rcVenta : this.rcVenta;
    }
}