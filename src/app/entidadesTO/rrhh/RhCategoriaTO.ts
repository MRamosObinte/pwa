export class RhCategoriaTO {
    empCodigo: string = "";
    catNombre: string = "";
    ctaAnticipos: string = "";
    ctaPrestamos: string = "";
    ctaPorPagarBonos: string = "";
    ctaPorPagarSueldo: string = "";
    ctaPorPagarImpuestoRenta: string = "";
    ctaPorPagarUtilidades: string = "";
    ctaGastoHorasExtras: string = "";
    ctaGastoHorasExtras100: string = "";
    ctaGastoBonos: string = "";
    ctaGastoBonosNd: string = "";
    ctaGastoBonoFijo: string = "";
    ctaGastoBonoFijoNd: string = "";
    ctaGastoOtrosIngresos: string = "";
    ctaGastoOtrosIngresosNd: string = "";
    ctaPermisoMedico: string = "";
    ctaGastoSueldos: string = "";
    ctaPrestamoQuirografario: string = "";
    ctaPrestamoHipotecario: string = "";
    ctaAportepersonal: string = "";
    ctaAporteExtension: string = "";
    ctaAportepatronal: string = "";
    ctaIece: string = "";
    ctaSecap: string = "";
    ctaXiii: string = "";
    ctaXiv: string = "";
    ctaFondoreserva: string = "";
    ctaVacaciones: string = "";
    ctaDesahucio: string = "";
    ctaGastoAporteindividual: string = "";
    ctaGastoAportepatronal: string = "";
    ctaGastoIece: string = "";
    ctaGastoSecap: string = "";
    ctaGastoXiii: string = "";
    ctaGastoXiv: string = "";
    ctaGastoFondoreserva: string = "";
    ctaGastoVacaciones: string = "";
    ctaGastoSalarioDigno: string = "";
    ctaGastoDesahucio: string = "";
    ctaGastoDesahucioIntempestivo: string = "";
    ctaGastoBonoLiquidacion: string = "";
    tipCodigo: string = "";
    usrInsertaCategoria: string = "";
    usrFechaInsertaCategoria: string = "";

    constructor(accion, data?) {
        data ? this.hydrate(data) : null;
        if (accion == 'cuenta') {
            this.formatearCuentas(data);
        }
        if (accion == 'nombre') {
            this.formatearNombres(data);
        }
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo
        this.catNombre = data.catNombre ? data.catNombre : this.catNombre
        this.ctaAnticipos = data.ctaAnticipos ? data.ctaAnticipos : this.ctaAnticipos
        this.ctaPrestamos = data.ctaPrestamos ? data.ctaPrestamos : this.ctaPrestamos
        this.ctaPorPagarBonos = data.ctaPorPagarBonos ? data.ctaPorPagarBonos : this.ctaPorPagarBonos
        this.ctaPorPagarSueldo = data.ctaPorPagarSueldo ? data.ctaPorPagarSueldo : this.ctaPorPagarSueldo
        this.ctaPorPagarImpuestoRenta = data.ctaPorPagarImpuestoRenta ? data.ctaPorPagarImpuestoRenta : this.ctaPorPagarImpuestoRenta
        this.ctaPorPagarUtilidades = data.ctaPorPagarUtilidades ? data.ctaPorPagarUtilidades : this.ctaPorPagarUtilidades
        this.ctaGastoHorasExtras = data.ctaGastoHorasExtras ? data.ctaGastoHorasExtras : this.ctaGastoHorasExtras
        this.ctaGastoHorasExtras100 = data.ctaGastoHorasExtras100 ? data.ctaGastoHorasExtras100 : this.ctaGastoHorasExtras100
        this.ctaGastoBonos = data.ctaGastoBonos ? data.ctaGastoBonos : this.ctaGastoBonos
        this.ctaGastoBonosNd = data.ctaGastoBonosNd ? data.ctaGastoBonosNd : this.ctaGastoBonosNd
        this.ctaGastoBonoFijo = data.ctaGastoBonoFijo ? data.ctaGastoBonoFijo : this.ctaGastoBonoFijo
        this.ctaGastoBonoFijoNd = data.ctaGastoBonoFijoNd ? data.ctaGastoBonoFijoNd : this.ctaGastoBonoFijoNd
        this.ctaGastoOtrosIngresos = data.ctaGastoOtrosIngresos ? data.ctaGastoOtrosIngresos : this.ctaGastoOtrosIngresos
        this.ctaGastoOtrosIngresosNd = data.ctaGastoOtrosIngresosNd ? data.ctaGastoOtrosIngresosNd : this.ctaGastoOtrosIngresosNd
        this.ctaPermisoMedico = data.ctaPermisoMedico ? data.ctaPermisoMedico : this.ctaPermisoMedico
        this.ctaGastoSueldos = data.ctaGastoSueldos ? data.ctaGastoSueldos : this.ctaGastoSueldos
        this.ctaPrestamoQuirografario = data.ctaPrestamoQuirografario ? data.ctaPrestamoQuirografario : this.ctaPrestamoQuirografario
        this.ctaPrestamoHipotecario = data.ctaPrestamoHipotecario ? data.ctaPrestamoHipotecario : this.ctaPrestamoHipotecario
        this.ctaAportepersonal = data.ctaAportepersonal ? data.ctaAportepersonal : this.ctaAportepersonal
        this.ctaAporteExtension = data.ctaAporteExtension ? data.ctaAporteExtension : this.ctaAporteExtension
        this.ctaAportepatronal = data.ctaAportepatronal ? data.ctaAportepatronal : this.ctaAportepatronal
        this.ctaIece = data.ctaIece ? data.ctaIece : this.ctaIece
        this.ctaSecap = data.ctaSecap ? data.ctaSecap : this.ctaSecap
        this.ctaXiii = data.ctaXiii ? data.ctaXiii : this.ctaXiii
        this.ctaXiv = data.ctaXiv ? data.ctaXiv : this.ctaXiv
        this.ctaFondoreserva = data.ctaFondoreserva ? data.ctaFondoreserva : this.ctaFondoreserva
        this.ctaVacaciones = data.ctaVacaciones ? data.ctaVacaciones : this.ctaVacaciones
        this.ctaDesahucio = data.ctaDesahucio ? data.ctaDesahucio : this.ctaDesahucio
        this.ctaGastoAporteindividual = data.ctaGastoAporteindividual ? data.ctaGastoAporteindividual : this.ctaGastoAporteindividual
        this.ctaGastoAportepatronal = data.ctaGastoAportepatronal ? data.ctaGastoAportepatronal : this.ctaGastoAportepatronal
        this.ctaGastoIece = data.ctaGastoIece ? data.ctaGastoIece : this.ctaGastoIece
        this.ctaGastoSecap = data.ctaGastoSecap ? data.ctaGastoSecap : this.ctaGastoSecap
        this.ctaGastoXiii = data.ctaGastoXiii ? data.ctaGastoXiii : this.ctaGastoXiii
        this.ctaGastoXiv = data.ctaGastoXiv ? data.ctaGastoXiv : this.ctaGastoXiv
        this.ctaGastoFondoreserva = data.ctaGastoFondoreserva ? data.ctaGastoFondoreserva : this.ctaGastoFondoreserva
        this.ctaGastoVacaciones = data.ctaGastoVacaciones ? data.ctaGastoVacaciones : this.ctaGastoVacaciones
        this.ctaGastoSalarioDigno = data.ctaGastoSalarioDigno ? data.ctaGastoSalarioDigno : this.ctaGastoSalarioDigno
        this.ctaGastoDesahucio = data.ctaGastoDesahucio ? data.ctaGastoDesahucio : this.ctaGastoDesahucio
        this.ctaGastoDesahucioIntempestivo = data.ctaGastoDesahucioIntempestivo ? data.ctaGastoDesahucioIntempestivo : this.ctaGastoDesahucioIntempestivo
        this.ctaGastoBonoLiquidacion = data.ctaGastoBonoLiquidacion ? data.ctaGastoBonoLiquidacion : this.ctaGastoBonoLiquidacion
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo
        this.usrInsertaCategoria = data.usrInsertaCategoria ? data.usrInsertaCategoria : this.usrInsertaCategoria
        this.usrFechaInsertaCategoria = data.usrFechaInsertaCategoria ? data.usrFechaInsertaCategoria : this.usrFechaInsertaCategoria
    }

    formatearCuentas(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo
        this.catNombre = data.catNombre ? data.catNombre : this.catNombre
        this.ctaAnticipos = data.ctaAnticipos ? this.extraerCuenta(data.ctaAnticipos) : this.ctaAnticipos
        this.ctaPrestamos = data.ctaPrestamos ? this.extraerCuenta(data.ctaPrestamos) : this.ctaPrestamos
        this.ctaPorPagarBonos = data.ctaPorPagarBonos ? this.extraerCuenta(data.ctaPorPagarBonos) : this.ctaPorPagarBonos
        this.ctaPorPagarSueldo = data.ctaPorPagarSueldo ? this.extraerCuenta(data.ctaPorPagarSueldo) : this.ctaPorPagarSueldo
        this.ctaPorPagarImpuestoRenta = data.ctaPorPagarImpuestoRenta ? this.extraerCuenta(data.ctaPorPagarImpuestoRenta) : this.ctaPorPagarImpuestoRenta
        this.ctaPorPagarUtilidades = data.ctaPorPagarUtilidades ? this.extraerCuenta(data.ctaPorPagarUtilidades) : this.ctaPorPagarUtilidades
        this.ctaGastoHorasExtras = data.ctaGastoHorasExtras ? this.extraerCuenta(data.ctaGastoHorasExtras) : this.ctaGastoHorasExtras
        this.ctaGastoHorasExtras100 = data.ctaGastoHorasExtras100 ? this.extraerCuenta(data.ctaGastoHorasExtras100) : this.ctaGastoHorasExtras100
        this.ctaGastoBonos = data.ctaGastoBonos ? this.extraerCuenta(data.ctaGastoBonos) : this.ctaGastoBonos
        this.ctaGastoBonosNd = data.ctaGastoBonosNd ? this.extraerCuenta(data.ctaGastoBonosNd) : this.ctaGastoBonosNd
        this.ctaGastoBonoFijo = data.ctaGastoBonoFijo ? this.extraerCuenta(data.ctaGastoBonoFijo) : this.ctaGastoBonoFijo
        this.ctaGastoBonoFijoNd = data.ctaGastoBonoFijoNd ? this.extraerCuenta(data.ctaGastoBonoFijoNd) : this.ctaGastoBonoFijoNd
        this.ctaGastoOtrosIngresos = data.ctaGastoOtrosIngresos ? this.extraerCuenta(data.ctaGastoOtrosIngresos) : this.ctaGastoOtrosIngresos
        this.ctaGastoOtrosIngresosNd = data.ctaGastoOtrosIngresosNd ? this.extraerCuenta(data.ctaGastoOtrosIngresosNd) : this.ctaGastoOtrosIngresosNd
        this.ctaPermisoMedico = data.ctaPermisoMedico ? this.extraerCuenta(data.ctaPermisoMedico) : this.ctaPermisoMedico
        this.ctaGastoSueldos = data.ctaGastoSueldos ? this.extraerCuenta(data.ctaGastoSueldos) : this.ctaGastoSueldos
        this.ctaPrestamoQuirografario = data.ctaPrestamoQuirografario ? this.extraerCuenta(data.ctaPrestamoQuirografario) : this.ctaPrestamoQuirografario
        this.ctaPrestamoHipotecario = data.ctaPrestamoHipotecario ? this.extraerCuenta(data.ctaPrestamoHipotecario) : this.ctaPrestamoHipotecario
        this.ctaAportepersonal = data.ctaAportepersonal ? this.extraerCuenta(data.ctaAportepersonal) : this.ctaAportepersonal
        this.ctaAporteExtension = data.ctaAporteExtension ? this.extraerCuenta(data.ctaAporteExtension) : this.ctaAporteExtension
        this.ctaAportepatronal = data.ctaAportepatronal ? this.extraerCuenta(data.ctaAportepatronal) : this.ctaAportepatronal
        this.ctaIece = data.ctaIece ? this.extraerCuenta(data.ctaIece) : this.ctaIece
        this.ctaSecap = data.ctaSecap ? this.extraerCuenta(data.ctaSecap) : this.ctaSecap
        this.ctaXiii = data.ctaXiii ? this.extraerCuenta(data.ctaXiii) : this.ctaXiii
        this.ctaXiv = data.ctaXiv ? this.extraerCuenta(data.ctaXiv) : this.ctaXiv
        this.ctaFondoreserva = data.ctaFondoreserva ? this.extraerCuenta(data.ctaFondoreserva) : this.ctaFondoreserva
        this.ctaVacaciones = data.ctaVacaciones ? this.extraerCuenta(data.ctaVacaciones) : this.ctaVacaciones
        this.ctaDesahucio = data.ctaDesahucio ? this.extraerCuenta(data.ctaDesahucio) : this.ctaDesahucio
        this.ctaGastoAporteindividual = data.ctaGastoAporteindividual ? this.extraerCuenta(data.ctaGastoAporteindividual) : this.ctaGastoAporteindividual
        this.ctaGastoAportepatronal = data.ctaGastoAportepatronal ? this.extraerCuenta(data.ctaGastoAportepatronal) : this.ctaGastoAportepatronal
        this.ctaGastoIece = data.ctaGastoIece ? this.extraerCuenta(data.ctaGastoIece) : this.ctaGastoIece
        this.ctaGastoSecap = data.ctaGastoSecap ? this.extraerCuenta(data.ctaGastoSecap) : this.ctaGastoSecap
        this.ctaGastoXiii = data.ctaGastoXiii ? this.extraerCuenta(data.ctaGastoXiii) : this.ctaGastoXiii
        this.ctaGastoXiv = data.ctaGastoXiv ? this.extraerCuenta(data.ctaGastoXiv) : this.ctaGastoXiv
        this.ctaGastoFondoreserva = data.ctaGastoFondoreserva ? this.extraerCuenta(data.ctaGastoFondoreserva) : this.ctaGastoFondoreserva
        this.ctaGastoVacaciones = data.ctaGastoVacaciones ? this.extraerCuenta(data.ctaGastoVacaciones) : this.ctaGastoVacaciones
        this.ctaGastoSalarioDigno = data.ctaGastoSalarioDigno ? this.extraerCuenta(data.ctaGastoSalarioDigno) : this.ctaGastoSalarioDigno
        this.ctaGastoDesahucio = data.ctaGastoDesahucio ? this.extraerCuenta(data.ctaGastoDesahucio) : this.ctaGastoDesahucio
        this.ctaGastoDesahucioIntempestivo = data.ctaGastoDesahucioIntempestivo ? this.extraerCuenta(data.ctaGastoDesahucioIntempestivo) : this.ctaGastoDesahucioIntempestivo
        this.ctaGastoBonoLiquidacion = data.ctaGastoBonoLiquidacion ? this.extraerCuenta(data.ctaGastoBonoLiquidacion) : this.ctaGastoBonoLiquidacion
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo
        this.usrInsertaCategoria = data.usrInsertaCategoria ? data.usrInsertaCategoria : this.usrInsertaCategoria
        this.usrFechaInsertaCategoria = data.usrFechaInsertaCategoria ? data.usrFechaInsertaCategoria : this.usrFechaInsertaCategoria
    }

    extraerCuenta(cadena): string {
        if (cadena) {
            let arreglo: Array<string> = cadena.split("-");
            let retorno = arreglo[0] ? arreglo[0].trim() : "";
            return retorno;
        }
        return "";
    }

    extraerNombre(cadena): string {
        if (cadena) {
            let arreglo: Array<string> = cadena.split("-");
            let retorno = arreglo[1] ? arreglo[1].trim() : "";
            retorno = arreglo[2] ? retorno + " " + arreglo[2].trim() : retorno;
            return retorno;
        }
        return "";
    }

    formatearNombres(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo
        this.catNombre = data.catNombre ? data.catNombre : this.catNombre
        this.ctaAnticipos = data.ctaAnticipos ? this.extraerNombre(data.ctaAnticipos) : this.ctaAnticipos
        this.ctaPrestamos = data.ctaPrestamos ? this.extraerNombre(data.ctaPrestamos) : this.ctaPrestamos
        this.ctaPorPagarBonos = data.ctaPorPagarBonos ? this.extraerNombre(data.ctaPorPagarBonos) : this.ctaPorPagarBonos
        this.ctaPorPagarSueldo = data.ctaPorPagarSueldo ? this.extraerNombre(data.ctaPorPagarSueldo) : this.ctaPorPagarSueldo
        this.ctaPorPagarImpuestoRenta = data.ctaPorPagarImpuestoRenta ? this.extraerNombre(data.ctaPorPagarImpuestoRenta) : this.ctaPorPagarImpuestoRenta
        this.ctaPorPagarUtilidades = data.ctaPorPagarUtilidades ? this.extraerNombre(data.ctaPorPagarUtilidades) : this.ctaPorPagarUtilidades
        this.ctaGastoHorasExtras = data.ctaGastoHorasExtras ? this.extraerNombre(data.ctaGastoHorasExtras) : this.ctaGastoHorasExtras
        this.ctaGastoHorasExtras100 = data.ctaGastoHorasExtras100 ? this.extraerNombre(data.ctaGastoHorasExtras100) : this.ctaGastoHorasExtras100
        this.ctaGastoBonos = data.ctaGastoBonos ? this.extraerNombre(data.ctaGastoBonos) : this.ctaGastoBonos
        this.ctaGastoBonosNd = data.ctaGastoBonosNd ? this.extraerNombre(data.ctaGastoBonosNd) : this.ctaGastoBonosNd
        this.ctaGastoBonoFijo = data.ctaGastoBonoFijo ? this.extraerNombre(data.ctaGastoBonoFijo) : this.ctaGastoBonoFijo
        this.ctaGastoBonoFijoNd = data.ctaGastoBonoFijoNd ? this.extraerNombre(data.ctaGastoBonoFijoNd) : this.ctaGastoBonoFijoNd
        this.ctaGastoOtrosIngresos = data.ctaGastoOtrosIngresos ? this.extraerNombre(data.ctaGastoOtrosIngresos) : this.ctaGastoOtrosIngresos
        this.ctaGastoOtrosIngresosNd = data.ctaGastoOtrosIngresosNd ? this.extraerNombre(data.ctaGastoOtrosIngresosNd) : this.ctaGastoOtrosIngresosNd
        this.ctaPermisoMedico = data.ctaPermisoMedico ? this.extraerNombre(data.ctaPermisoMedico) : this.ctaPermisoMedico
        this.ctaGastoSueldos = data.ctaGastoSueldos ? this.extraerNombre(data.ctaGastoSueldos) : this.ctaGastoSueldos
        this.ctaPrestamoQuirografario = data.ctaPrestamoQuirografario ? this.extraerNombre(data.ctaPrestamoQuirografario) : this.ctaPrestamoQuirografario
        this.ctaPrestamoHipotecario = data.ctaPrestamoHipotecario ? this.extraerNombre(data.ctaPrestamoHipotecario) : this.ctaPrestamoHipotecario
        this.ctaAportepersonal = data.ctaAportepersonal ? this.extraerNombre(data.ctaAportepersonal) : this.ctaAportepersonal
        this.ctaAporteExtension = data.ctaAporteExtension ? this.extraerNombre(data.ctaAporteExtension) : this.ctaAporteExtension
        this.ctaAportepatronal = data.ctaAportepatronal ? this.extraerNombre(data.ctaAportepatronal) : this.ctaAportepatronal
        this.ctaIece = data.ctaIece ? this.extraerNombre(data.ctaIece) : this.ctaIece
        this.ctaSecap = data.ctaSecap ? this.extraerNombre(data.ctaSecap) : this.ctaSecap
        this.ctaXiii = data.ctaXiii ? this.extraerNombre(data.ctaXiii) : this.ctaXiii
        this.ctaXiv = data.ctaXiv ? this.extraerNombre(data.ctaXiv) : this.ctaXiv
        this.ctaFondoreserva = data.ctaFondoreserva ? this.extraerNombre(data.ctaFondoreserva) : this.ctaFondoreserva
        this.ctaVacaciones = data.ctaVacaciones ? this.extraerNombre(data.ctaVacaciones) : this.ctaVacaciones
        this.ctaDesahucio = data.ctaDesahucio ? this.extraerNombre(data.ctaDesahucio) : this.ctaDesahucio
        this.ctaGastoAporteindividual = data.ctaGastoAporteindividual ? this.extraerNombre(data.ctaGastoAporteindividual) : this.ctaGastoAporteindividual
        this.ctaGastoAportepatronal = data.ctaGastoAportepatronal ? this.extraerNombre(data.ctaGastoAportepatronal) : this.ctaGastoAportepatronal
        this.ctaGastoIece = data.ctaGastoIece ? this.extraerNombre(data.ctaGastoIece) : this.ctaGastoIece
        this.ctaGastoSecap = data.ctaGastoSecap ? this.extraerNombre(data.ctaGastoSecap) : this.ctaGastoSecap
        this.ctaGastoXiii = data.ctaGastoXiii ? this.extraerNombre(data.ctaGastoXiii) : this.ctaGastoXiii
        this.ctaGastoXiv = data.ctaGastoXiv ? this.extraerNombre(data.ctaGastoXiv) : this.ctaGastoXiv
        this.ctaGastoFondoreserva = data.ctaGastoFondoreserva ? this.extraerNombre(data.ctaGastoFondoreserva) : this.ctaGastoFondoreserva
        this.ctaGastoVacaciones = data.ctaGastoVacaciones ? this.extraerNombre(data.ctaGastoVacaciones) : this.ctaGastoVacaciones
        this.ctaGastoSalarioDigno = data.ctaGastoSalarioDigno ? this.extraerNombre(data.ctaGastoSalarioDigno) : this.ctaGastoSalarioDigno
        this.ctaGastoDesahucio = data.ctaGastoDesahucio ? this.extraerNombre(data.ctaGastoDesahucio) : this.ctaGastoDesahucio
        this.ctaGastoDesahucioIntempestivo = data.ctaGastoDesahucioIntempestivo ? this.extraerNombre(data.ctaGastoDesahucioIntempestivo) : this.ctaGastoDesahucioIntempestivo
        this.ctaGastoBonoLiquidacion = data.ctaGastoBonoLiquidacion ? this.extraerNombre(data.ctaGastoBonoLiquidacion) : this.ctaGastoBonoLiquidacion
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo
        this.usrInsertaCategoria = data.usrInsertaCategoria ? data.usrInsertaCategoria : this.usrInsertaCategoria
        this.usrFechaInsertaCategoria = data.usrFechaInsertaCategoria ? data.usrFechaInsertaCategoria : this.usrFechaInsertaCategoria
    }

}