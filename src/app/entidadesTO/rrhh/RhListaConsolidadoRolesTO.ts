export class RhListaConsolidadoRolesTO {
    id: number = null;
    crpCategoria: string = null;
    crpId: string = null;
    crpNombres: string = null;
    crpDl: number = 0;
    crpDf: number = 0;
    crpDe: number = 0;
    crpDd: number = 0;
    crpDp: number = 0;
    crpSueldo: number = 0;
    crpHorasExtras: number = 0;
    crpHorasExtras100: number = 0;
    crpBonos: number = 0;
    crpBonosnd: number = 0;
    crpBonoFijo: number = 0;
    crpBonoFijoNd: number = 0;
    crpOtrosIngresos: number = 0;
    crpOtrosIngresosNd: number = 0;
    crpSubtotalBonos: number = 0;
    crpSubtotalIngresos: number = 0;
    crpFondoReserva: number = 0;
    crpLiquidacion: number = 0;
    crpIngresos: number = 0;
    crpAnticipos: number = 0;
    crpPrestamos: number = 0;
    crpIess: number = 0;
    crpIessExtension: number = 0;
    crpPrestamoQuirografario: number = 0;
    crpPrestamoHipotecario: number = 0;
    crpRetencion: number = 0;
    crpPermisoMedico: number = 0;
    crpDescuentosFondoReserva: number = 0;
    crpDescuentos: number = 0;
    crpTotal: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.crpCategoria = data.crpCategoria ? data.crpCategoria : this.crpCategoria;
        this.crpId = data.crpId ? data.crpId : this.crpId;
        this.crpNombres = data.crpNombres ? data.crpNombres : this.crpNombres;
        this.crpDl = data.crpDl ? data.crpDl : this.crpDl;
        this.crpDf = data.crpDf ? data.crpDf : this.crpDf;
        this.crpDe = data.crpDe ? data.crpDe : this.crpDe;
        this.crpDd = data.crpDd ? data.crpDd : this.crpDd;
        this.crpSueldo = data.crpSueldo ? data.crpSueldo : this.crpSueldo;
        this.crpHorasExtras = data.crpHorasExtras ? data.crpHorasExtras : this.crpHorasExtras;
        this.crpHorasExtras100 = data.crpHorasExtras100 ? data.crpHorasExtras100 : this.crpHorasExtras100;
        this.crpBonos = data.crpBonos ? data.crpBonos : this.crpBonos;
        this.crpBonosnd = data.crpBonosnd ? data.crpBonosnd : this.crpBonosnd;
        this.crpBonoFijo = data.crpBonoFijo ? data.crpBonoFijo : this.crpBonoFijo;
        this.crpBonoFijoNd = data.crpBonoFijoNd ? data.crpBonoFijoNd : this.crpBonoFijoNd;
        this.crpOtrosIngresos = data.crpOtrosIngresos ? data.crpOtrosIngresos : this.crpOtrosIngresos;
        this.crpOtrosIngresosNd = data.crpOtrosIngresosNd ? data.crpOtrosIngresosNd : this.crpOtrosIngresosNd;
        this.crpSubtotalBonos = data.crpSubtotalBonos ? data.crpSubtotalBonos : this.crpSubtotalBonos;
        this.crpSubtotalIngresos = data.crpSubtotalIngresos ? data.crpSubtotalIngresos : this.crpSubtotalIngresos;
        this.crpFondoReserva = data.crpFondoReserva ? data.crpFondoReserva : this.crpFondoReserva;
        this.crpLiquidacion = data.crpLiquidacion ? data.crpLiquidacion : this.crpLiquidacion;
        this.crpIngresos = data.crpIngresos ? data.crpIngresos : this.crpIngresos;
        this.crpAnticipos = data.crpAnticipos ? data.crpAnticipos : this.crpAnticipos;
        this.crpPrestamos = data.crpPrestamos ? data.crpPrestamos : this.crpPrestamos;
        this.crpIess = data.crpIess ? data.crpIess : this.crpIess;
        this.crpIessExtension = data.crpIessExtension ? data.crpIessExtension : this.crpIessExtension;
        this.crpPrestamoQuirografario = data.crpPrestamoQuirografario ? data.crpPrestamoQuirografario : this.crpPrestamoQuirografario;
        this.crpPrestamoHipotecario = data.crpPrestamoHipotecario ? data.crpPrestamoHipotecario : this.crpPrestamoHipotecario;
        this.crpRetencion = data.crpRetencion ? data.crpRetencion : this.crpRetencion;
        this.crpPermisoMedico = data.crpPermisoMedico ? data.crpPermisoMedico : this.crpPermisoMedico;
        this.crpDescuentosFondoReserva = data.crpDescuentosFondoReserva ? data.crpDescuentosFondoReserva : this.crpDescuentosFondoReserva;
        this.crpDescuentos = data.crpDescuentos ? data.crpDescuentos : this.crpDescuentos;
        this.crpTotal = data.crpTotal ? data.crpTotal : this.crpTotal;
    }
}