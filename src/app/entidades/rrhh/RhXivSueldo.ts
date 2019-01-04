import { RhEmpleado } from './RhEmpleado';
import { ConContable } from './../contabilidad/ConContable';
import { ConCuentas } from './../contabilidad/ConCuentas';
import { PrdSector } from './../produccion/PrdSector';
export class RhXivSueldo {
    public xivSecuencial: number = null;
    public xivDesde: Date = null;
    public xivHasta: Date = null;
    public xivDiasLaboradosEmpleado: number = null;
    public xivBaseImponible: number = null;
    public xivValor: number = null;
    public xivDocumento: string = null;
    public xivObservaciones: string = null;
    public xivCodigoMinisterial: string = null;
    public xivAuxiliar: boolean = null;
    public empCargo: string = null;
    public empSueldo: number = 0;
    public empFechaIngreso: Date = null;
    public prdSector: PrdSector = new PrdSector();
    public conCuentas: ConCuentas = new ConCuentas();
    public conContable: ConContable = new ConContable();
    public rhEmpleado: RhEmpleado = new RhEmpleado();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.xivSecuencial = data.xivSecuencial ? data.xivSecuencial : this.xivSecuencial;
        this.xivDesde = data.xivDesde ? data.xivDesde : this.xivDesde;
        this.xivHasta = data.xivHasta ? data.xivHasta : this.xivHasta;
        this.xivDiasLaboradosEmpleado = data.xivDiasLaboradosEmpleado ? data.xivDiasLaboradosEmpleado : this.xivDiasLaboradosEmpleado;
        this.xivBaseImponible = data.xivBaseImponible ? data.xivBaseImponible : this.xivBaseImponible;
        this.xivValor = data.xivValor ? data.xivValor : this.xivValor;
        this.xivDocumento = data.xivDocumento ? data.xivDocumento : this.xivDocumento;
        this.xivObservaciones = data.xivObservaciones ? data.xivObservaciones : this.xivObservaciones;
        this.xivCodigoMinisterial = data.xivCodigoMinisterial ? data.xivCodigoMinisterial : this.xivCodigoMinisterial;
        this.xivAuxiliar = data.xivAuxiliar ? data.xivAuxiliar : this.xivAuxiliar;
        this.empCargo = data.empCargo ? data.empCargo : this.empCargo;
        this.empSueldo = data.empSueldo ? data.empSueldo : this.empSueldo;
        this.empFechaIngreso = data.empFechaIngreso ? data.empFechaIngreso : this.empFechaIngreso;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.conCuentas = data.conCuentas ? data.conCuentas : this.conCuentas;
        this.conContable = data.conContable ? data.conContable : this.conContable;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
    }
}