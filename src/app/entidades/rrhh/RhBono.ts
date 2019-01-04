import { PrdSector } from "../produccion/PrdSector";
import { PrdPiscina } from "../produccion/PrdPiscina";
import { ConContable } from "../contabilidad/ConContable";
import { RhEmpleado } from "./RhEmpleado";

export class RhBono {
    bonoSecuencial: number = 0;
    bonoConcepto: string = "";
    bonoValor: number = 0;
    bonoDeducible: boolean = false;
    bonoObservacion: string = "";
    bonoAuxiliar: boolean = false;
    prdSector: PrdSector = new PrdSector();
    prdPiscina: PrdPiscina = new PrdPiscina();
    conContable: ConContable = new ConContable();
    rhEmpleado: RhEmpleado = new RhEmpleado();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bonoSecuencial = data.bonoSecuencial ? data.bonoSecuencial : this.bonoSecuencial;
        this.bonoConcepto = data.bonoConcepto ? data.bonoConcepto : this.bonoConcepto;
        this.bonoValor = data.bonoValor ? data.bonoValor : this.bonoValor;
        this.bonoDeducible = data.bonoDeducible ? data.bonoDeducible : this.bonoDeducible;
        this.bonoObservacion = data.bonoObservacion ? data.bonoObservacion : this.bonoObservacion;
        this.bonoAuxiliar = data.bonoAuxiliar ? data.bonoAuxiliar : this.bonoAuxiliar;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
        this.prdPiscina = data.prdPiscina ? data.prdPiscina : this.prdPiscina;
        this.conContable = data.conContable ? data.conContable : this.conContable;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
    }
}