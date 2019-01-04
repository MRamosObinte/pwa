import { PrdSector } from "../produccion/PrdSector";
import { ConCuentas } from "../contabilidad/ConCuentas";
import { ConContable } from "../contabilidad/ConContable";
import { RhEmpleado } from "./RhEmpleado";

export class RhAnticipo {
    antSecuencial: number = 0;
    antValor: number = 0;
    antDocumento: string = "";
    antObservaciones: string = "";
    antAuxiliar: boolean = false;
    prdSector: PrdSector = new PrdSector();
    conCuentas: ConCuentas = new ConCuentas();
    conContable: ConContable = new ConContable();
    rhEmpleado: RhEmpleado = new RhEmpleado();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.antSecuencial = data.antSecuencial ? data.antSecuencial : this.antSecuencial;
        this.antValor = data.antValor ? data.antValor : this.antValor;
        this.antDocumento = data.antDocumento ? data.antDocumento : this.antDocumento;
        this.antObservaciones = data.antObservaciones ? data.antObservaciones : this.antObservaciones;
        this.antAuxiliar = data.antAuxiliar ? data.antAuxiliar : this.antAuxiliar;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.conCuentas = data.conCuentas ? data.conCuentas : this.conCuentas;
        this.conContable = data.conContable ? data.conContable : this.conContable;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
    }
}