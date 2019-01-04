
export class PrdResumenCorridaTO {
    id: number = null;
    empCodigo: string = null;
    pisNumero: string = null;
    secCodigo: string = null;
    secNombre: string = null;
    pisNombre: string = null;
    rcHectareaje: number = null;
    rcCorridaNumero: string = null;
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
    rcLibrasBalanceados: number = null;
    rcBiomasa: number = null;
    rcBiomasaReal: number = null;
    rcConversion: number = null;
    rcTGrande: number = null;
    rcTMediano: number = null;
    rcTPequeno: number = null;
    rcTPromedio: number = null;
    rcPesoIdeal: number = null;
    rcSobrevivencia: string = null;
    rcCosto: number = null;
    rcDirecto: number = null;
    rcIndirecto: number = null;
    rcCostoTransferencia: number = null;
    rcValorVenta: number = null;
    rcResultado: number = null;
    rcRendimiento: number = null;
    rcCostoHectarea: number = null;
    rcVentaHectarea: number = null;
    rcResultadoHectarea: number = null;
    rcCostoLibra: number = null;
    rcVentaLibra: number = null;
    rcResultadoLibra: number = null;
    rcCostoDirectoDia: number = null;
    rcCostoindirectoDia: number = null;
    rcCostoTotalDia: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.secNombre = data.secNombre ? data.secNombre : this.secNombre;
        this.rcHectareaje = data.rcHectareaje ? data.rcHectareaje : this.rcHectareaje;
        this.pisNombre = data.pisNombre ? data.pisNombre : this.pisNombre;
        this.rcFechaSiembra = data.rcFechaSiembra ? data.rcFechaSiembra : this.rcFechaSiembra;
        this.rcFechaDesde = data.rcFechaDesde ? data.rcFechaDesde : this.rcFechaDesde;
        this.rcFechaPesca = data.rcFechaPesca ? data.rcFechaPesca : this.rcFechaPesca;
        this.rcCorridaNumero = data.rcCorridaNumero ? data.rcCorridaNumero : this.rcCorridaNumero;
        this.rcEdad = data.rcEdad ? data.rcEdad : this.rcEdad;
        this.rcDiasMuertos = data.rcDiasMuertos ? data.rcDiasMuertos : this.rcDiasMuertos;
        this.rcNumeroLarvas = data.rcNumeroLarvas ? data.rcNumeroLarvas : this.rcNumeroLarvas;
        this.rcFechaHasta = data.rcFechaHasta ? data.rcFechaHasta : this.rcFechaHasta;
        this.rcLaboratorio = data.rcLaboratorio ? data.rcLaboratorio : this.rcLaboratorio;
        this.rcDensidad = data.rcDensidad ? data.rcDensidad : this.rcDensidad;
        this.rcLibrasBalanceados = data.rcLibrasBalanceados ? data.rcLibrasBalanceados : this.rcLibrasBalanceados;
        this.rcBiomasa = data.rcBiomasa ? data.rcBiomasa : this.rcBiomasa;
        this.rcBiomasaReal = data.rcBiomasaReal ? data.rcBiomasaReal : this.rcBiomasaReal;
        this.rcConversion = data.rcConversion ? data.rcConversion : this.rcConversion;
        this.rcTGrande = data.rcTGrande ? data.rcTGrande : this.rcTGrande;
        this.rcTMediano = data.rcTMediano ? data.rcTMediano : this.rcTMediano;
        this.rcTMediano = data.rcTMediano ? data.rcTMediano : this.rcTMediano;
        this.rcTPequeno = data.rcTPequeno ? data.rcTPequeno : this.rcTPequeno;
        this.rcTPromedio = data.rcTPromedio ? data.rcTPromedio : this.rcTPromedio;
        this.rcPesoIdeal = data.rcPesoIdeal ? data.rcPesoIdeal : this.rcPesoIdeal;
        this.rcSobrevivencia = data.rcSobrevivencia ? data.rcSobrevivencia : this.rcSobrevivencia;
        this.rcCosto = data.rcCosto ? data.rcCosto : this.rcCosto;
        this.rcDirecto = data.rcDirecto ? data.rcDirecto : this.rcDirecto;
        this.rcIndirecto = data.rcIndirecto ? data.rcIndirecto : this.rcIndirecto;
        this.rcCostoTransferencia = data.rcCostoTransferencia ? data.rcCostoTransferencia : this.rcCostoTransferencia;
        this.rcValorVenta = data.rcValorVenta ? data.rcValorVenta : this.rcValorVenta;
        this.rcResultado = data.rcResultado ? data.rcResultado : this.rcResultado;
        this.rcRendimiento = data.rcRendimiento ? data.rcRendimiento : this.rcRendimiento;
        this.rcCostoHectarea = data.rcCostoHectarea ? data.rcCostoHectarea : this.rcCostoHectarea;
        this.rcVentaHectarea = data.rcVentaHectarea ? data.rcVentaHectarea : this.rcVentaHectarea;
        this.rcResultadoHectarea = data.rcResultadoHectarea ? data.rcResultadoHectarea : this.rcResultadoHectarea;
        this.rcCostoLibra = data.rcCostoLibra ? data.rcCostoLibra : this.rcCostoLibra;
        this.rcVentaLibra = data.rcVentaLibra ? data.rcVentaLibra : this.rcVentaLibra;
        this.rcResultadoLibra = data.rcResultadoLibra ? data.rcResultadoLibra : this.rcResultadoLibra;
        this.rcCostoDirectoDia = data.rcCostoDirectoDia ? data.rcCostoDirectoDia : this.rcCostoDirectoDia;
        this.rcCostoindirectoDia = data.rcCostoindirectoDia ? data.rcCostoindirectoDia : this.rcCostoindirectoDia;
        this.rcCostoTotalDia = data.rcCostoTotalDia ? data.rcCostoTotalDia : this.rcCostoTotalDia;

    }
}