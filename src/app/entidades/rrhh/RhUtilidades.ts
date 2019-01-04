import { PrdSector } from "../produccion/PrdSector";
import { ConCuentas } from "../contabilidad/ConCuentas";
import { ConContable } from "../contabilidad/ConContable";
import { RhEmpleado } from "./RhEmpleado";

export class RhUtilidades {

    utiSecuencial: number = 0;
    utiDesde: any = new Date();
    utiHasta: any = new Date();
    utiDiasLaborados: number = 0;
    utiValorPersonal: number = 0;
    utiValorCargas: number = 0;
    utiValorTotal: number = 0;
    utiCodigoMinisterial: string = "";
    utiDocumento: string = "";
    utiObservaciones: string = "";
    utiAuxiliar: boolean = false;
    empCargo: string = "";
    empFechaIngreso: any = new Date();
    empCargasFamiliares: number = 0;
    prdSector: PrdSector = new PrdSector();
    conCuentas: ConCuentas = new ConCuentas();
    conContable: ConContable = new ConContable();
    rhEmpleado: RhEmpleado = new RhEmpleado();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.utiSecuencial = data.utiSecuencial ? data.utiSecuencial : this.utiSecuencial;
        this.utiDesde = data.utiDesde ? data.utiDesde : this.utiDesde;
        this.utiHasta = data.utiHasta ? data.utiHasta : this.utiHasta;
        this.utiDiasLaborados = data.utiDiasLaborados ? data.utiDiasLaborados : this.utiDiasLaborados;
        this.utiValorPersonal = data.utiValorPersonal ? data.utiValorPersonal : this.utiValorPersonal;
        this.utiValorCargas = data.utiValorCargas ? data.utiValorCargas : this.utiValorCargas;
        this.utiValorTotal = data.utiValorTotal ? data.utiValorTotal : this.utiValorTotal;
        this.utiCodigoMinisterial = data.utiCodigoMinisterial ? data.utiCodigoMinisterial : this.utiCodigoMinisterial;
        this.utiDocumento = data.utiDocumento ? data.utiDocumento : this.utiDocumento;
        this.utiObservaciones = data.utiObservaciones ? data.utiObservaciones : this.utiObservaciones;
        this.utiAuxiliar = data.utiAuxiliar ? data.utiAuxiliar : this.utiAuxiliar;
        this.empCargo = data.empCargo ? data.empCargo : this.empCargo;
        this.empFechaIngreso = data.empFechaIngreso ? data.empFechaIngreso : this.empFechaIngreso;
        this.empCargasFamiliares = data.empCargasFamiliares ? data.empCargasFamiliares : this.empCargasFamiliares;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.conCuentas = data.conCuentas ? data.conCuentas : this.conCuentas;
        this.conContable = data.conContable ? data.conContable : this.conContable;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
    }

}