import { RhEmpleado } from "./RhEmpleado";
import { RhAnticipoMotivo } from "./RhAnticipoMotivo";

export class RhEmpleadoDescuentosFijos {
    descSecuencial: number = 0;
    descValor: number = 0;
    rhEmpleado: RhEmpleado = new RhEmpleado();
    rhAnticipoMotivo: RhAnticipoMotivo = new RhAnticipoMotivo();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.descSecuencial = data.descSecuencial ? data.descSecuencial : this.descSecuencial;
        this.descValor = data.descValor ? data.descValor : this.descValor;
        this.rhEmpleado = data.rhEmpleado ? data.rhEmpleado : this.rhEmpleado;
        this.rhAnticipoMotivo = data.rhAnticipoMotivo ? data.rhAnticipoMotivo : this.rhAnticipoMotivo;
    }
}