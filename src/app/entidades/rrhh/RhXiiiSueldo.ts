import { ConContable } from './../contabilidad/ConContable';
import { ConCuentas } from './../contabilidad/ConCuentas';
import { PrdSector } from './../produccion/PrdSector';
import { RhEmpleado } from './RhEmpleado';
export class RhXiiiSueldo {
    public xiiiSecuencial: number = null;
    public xiiiDesde: Date = null;
    public xiiiHasta: Date = null;
    public xiiiDiasLaborados: number = null;
    public xiiiBaseImponible: number = null;
    public xiiiValor: number = null;
    public xiiiDocumento: string = null;
    public xiiiObservaciones: string = null;
    public xiiiCodigoMinisterial: string = null;
    public xiiiAuxiliar: boolean = null;
    public empCargo: string = null;
    public empFechaIngreso: Date = null;
    public prdSector: PrdSector = new PrdSector();
    public conCuentas: ConCuentas = new ConCuentas();
    public conContable: ConContable = new ConContable();
    public rhEmpleado: RhEmpleado = new RhEmpleado();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.xiiiSecuencial = data.xiiiSecuencial ? data.xiiiSecuencial : this.xiiiSecuencial;
        this.xiiiDesde = data.xiiiDesde ? data.xiiiDesde : this.xiiiDesde;
        this.xiiiHasta = data.xiiiHasta ? data.xiiiHasta : this.xiiiHasta;
        this.xiiiDiasLaborados = data.xiiiDiasLaborados ? data.xiiiDiasLaborados : this.xiiiDiasLaborados;
        this.xiiiBaseImponible = data.xiiiBaseImponible ? data.xiiiBaseImponible : this.xiiiBaseImponible;
        this.xiiiValor = data.xiiiValor ? data.xiiiValor : this.xiiiValor;
        this.xiiiDocumento = data.xiiiDocumento ? data.xiiiDocumento : this.xiiiDocumento;
        this.xiiiObservaciones = data.xiiiObservaciones ? data.xiiiObservaciones : this.xiiiObservaciones;
        this.xiiiCodigoMinisterial = data.xiiiCodigoMinisterial ? data.xiiiCodigoMinisterial : this.xiiiCodigoMinisterial;
        this.xiiiAuxiliar = data.xiiiAuxiliar ? data.xiiiAuxiliar : this.xiiiAuxiliar;
        this.empCargo = data.empCargo ? data.empCargo : this.empCargo;
        this.empFechaIngreso = data.empFechaIngreso ? data.empFechaIngreso : this.empFechaIngreso;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.conCuentas = data.conCuentas ? data.conCuentas : this.conCuentas;
        this.conContable = data.conContable ? data.conContable : this.conContable;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
    }
}