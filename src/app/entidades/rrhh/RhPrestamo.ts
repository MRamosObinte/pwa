import { PrdSector } from "../produccion/PrdSector";
import { ConCuentas } from "../contabilidad/ConCuentas";
import { ConContable } from "../contabilidad/ConContable";
import { RhEmpleado } from "./RhEmpleado";

export class RhPrestamo {
    preSecuencial: number = 0;
    preValor: number = 0;
    preNumeroPagos: number = 0;
    preDocumento: string = "";
    preObservaciones: string = "";
    preAuxiliar: boolean = false;
    prdSector: PrdSector = new PrdSector();
    conCuentas: ConCuentas = new ConCuentas();
    conContable: ConContable = new ConContable();
    rhEmpleado: RhEmpleado = new RhEmpleado();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.preSecuencial = data.preSecuencial ? data.preSecuencial : this.preSecuencial;
        this.preValor = data.preValor ? data.preValor : this.preValor;
        this.preNumeroPagos = data.preNumeroPagos ? data.preNumeroPagos : this.preNumeroPagos;
        this.preDocumento = data.preDocumento ? data.preDocumento : this.preDocumento;
        this.preObservaciones = data.preObservaciones ? data.preObservaciones : this.preObservaciones;
        this.preAuxiliar = data.preAuxiliar ? data.preAuxiliar : this.preAuxiliar;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.conCuentas = data.conCuentas ? data.conCuentas : this.conCuentas;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
    }
}