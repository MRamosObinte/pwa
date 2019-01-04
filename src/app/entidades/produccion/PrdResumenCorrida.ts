import { PrdResumenCorridaPK } from "./PrdResumenCorridaPK";

export class PrdResumenCorrida {

    prdResumenCorridaPK: PrdResumenCorridaPK = new PrdResumenCorridaPK();
    rcSectorNombre: String = "";
    rcPiscinaNombre: String = "";
    rcHectareaje: number = 0;
    rcFechaDesde: String = "";
    rcFechaSiembra: String = "";
    rcFechaPesca: String = "";
    rcFechaHasta: String = "";
    rcEdad: number = 0;
    rcDiasMuertos: number = 0;
    rcNumeroLarvas: number = 0;
    rcDensidad: number = 0;
    rcLaboratorio: String = "";
    rcNauplio: String = "";
    rcBalanceado: number = 0;
    rcBiomasa: number = 0;
    rcBiomasaReal: number = 0;
    rcConversion: number = 0;
    rcTallaGrande: number = 0;
    rcTallaMediano: number = 0;
    rcTallaPequeno: number = 0;
    rcTallaPromedio: number = 0;
    rcPesoIdeal: number = 0;
    rcSobrevivencia: String = "";
    rcTotal: number = 0;
    rcDirecto: number = 0;
    rcIndirecto: number = 0;
    rcValorVenta: number = 0;
    rcResultado: number = 0;
    rcCostoHectarea: number = 0;
    rcVentaHectarea: number = 0;
    rcResultadoHectarea: number = 0;
    rcCostoLibra: number = 0;
    rcVentaLibra: number = 0;
    rcResultadoLibra: number = 0;
    rcCostoDirectoDia: number = 0;
    rcVentaIndirectoDia: number = 0;
    rcCostoTotalDia: number = 0;
    rcFechaHora: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdResumenCorridaPK = data.prdResumenCorridaPK ? new PrdResumenCorridaPK(data.prdResumenCorridaPK) : this.prdResumenCorridaPK;
        this.rcSectorNombre = data.rcSectorNombre ? data.rcSectorNombre : this.rcSectorNombre;
        this.rcPiscinaNombre = data.rcPiscinaNombre ? data.rcPiscinaNombre : this.rcPiscinaNombre;
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
        this.rcTallaGrande = data.rcTallaGrande ? data.rcTallaGrande : this.rcTallaGrande;
        this.rcTallaMediano = data.rcTallaMediano ? data.rcTallaMediano : this.rcTallaMediano;
        this.rcTallaPequeno = data.rcTallaPequeno ? data.rcTallaPequeno : this.rcTallaPequeno;
        this.rcTallaPromedio = data.rcTallaPromedio ? data.rcTallaPromedio : this.rcTallaPromedio;
        this.rcPesoIdeal = data.rcPesoIdeal ? data.rcPesoIdeal : this.rcPesoIdeal;
        this.rcSobrevivencia = data.rcSobrevivencia ? data.rcSobrevivencia : this.rcSobrevivencia;
        this.rcTotal = data.rcTotal ? data.rcTotal : this.rcTotal;
        this.rcDirecto = data.rcDirecto ? data.rcDirecto : this.rcDirecto;
        this.rcIndirecto = data.rcIndirecto ? data.rcIndirecto : this.rcIndirecto;
        this.rcValorVenta = data.rcValorVenta ? data.rcValorVenta : this.rcValorVenta;
        this.rcResultado = data.rcResultado ? data.rcResultado : this.rcResultado;
        this.rcCostoHectarea = data.rcCostoHectarea ? data.rcCostoHectarea : this.rcCostoHectarea;
        this.rcVentaHectarea = data.rcVentaHectarea ? data.rcVentaHectarea : this.rcVentaHectarea;
        this.rcResultadoHectarea = data.rcResultadoHectarea ? data.rcResultadoHectarea : this.rcResultadoHectarea;
        this.rcCostoLibra = data.rcCostoLibra ? data.rcCostoLibra : this.rcCostoLibra;
        this.rcVentaLibra = data.rcVentaLibra ? data.rcVentaLibra : this.rcVentaLibra;
        this.rcResultadoLibra = data.rcResultadoLibra ? data.rcResultadoLibra : this.rcResultadoLibra;
        this.rcCostoDirectoDia = data.rcCostoDirectoDia ? data.rcCostoDirectoDia : this.rcCostoDirectoDia;
        this.rcVentaIndirectoDia = data.rcVentaIndirectoDia ? data.rcVentaIndirectoDia : this.rcVentaIndirectoDia;
        this.rcCostoTotalDia = data.rcCostoTotalDia ? data.rcCostoTotalDia : this.rcCostoTotalDia;
        this.rcFechaHora = data.rcFechaHora ? data.rcFechaHora : this.rcFechaHora;
    }

}