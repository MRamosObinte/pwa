import { RhListaRolSaldoEmpleadoDetalladoTO } from "./RhListaRolSaldoEmpleadoDetalladoTO";
import { RhRol } from "../../entidades/rrhh/RhRol";

export class ItemListaRolTO {
    rhRol: RhRol = new RhRol();
    rolDesdeTexto: string = null;
    rolHastaTexto: any = null;
    rolImpuestoRenta: number = 0;
    rolPermisoMedico: number = 0;
    rolDescFondoReserva: number = 0;
    rolLiqXiiiSueldo: number = 0;
    rolLiqXivSueldo: number = 0;
    rolValorPrestamos: number = 0;
    totalPagar: number = 0;
    totalIngresos: number = 0;
    totalDescuentos: number = 0;
    totalLiquidacion: number = 0;
    detalle: Array<RhListaRolSaldoEmpleadoDetalladoTO> = [];
    mensaje: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rhRol = data.rhRol ? data.rhRol : this.rhRol;
        this.rolDesdeTexto = data.rolDesdeTexto ? data.rolDesdeTexto : this.rolDesdeTexto;
        this.rolHastaTexto = data.rolHastaTexto ? data.rolHastaTexto : this.rolHastaTexto;
        this.rolImpuestoRenta = data.rolImpuestoRenta ? data.rolImpuestoRenta : this.rolImpuestoRenta;
        this.rolPermisoMedico = data.rolPermisoMedico ? data.rolPermisoMedico : this.rolPermisoMedico;
        this.rolDescFondoReserva = data.rolDescFondoReserva ? data.rolDescFondoReserva : this.rolDescFondoReserva;
        this.rolLiqXiiiSueldo = data.rolLiqXiiiSueldo ? data.rolLiqXiiiSueldo : this.rolLiqXiiiSueldo;
        this.rolLiqXivSueldo = data.rolLiqXivSueldo ? data.rolLiqXivSueldo : this.rolLiqXivSueldo;
        this.rolValorPrestamos = data.rolValorPrestamos ? data.rolValorPrestamos : this.rolValorPrestamos;
        this.totalPagar = data.totalPagar ? data.totalPagar : this.totalPagar;
        this.totalIngresos = data.totalIngresos ? data.totalIngresos : this.totalIngresos;
        this.totalDescuentos = data.totalDescuentos ? data.totalDescuentos : this.totalDescuentos;
        this.totalLiquidacion = data.totalLiquidacion ? data.totalLiquidacion : this.totalLiquidacion;
        this.detalle = data.detalle ? data.detalle : this.detalle;
        this.mensaje = data.mensaje ? data.mensaje : this.mensaje;

    }

}