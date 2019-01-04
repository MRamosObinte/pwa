import { AfActivos } from "./AfActivos";

export class AfActivosDatosAdjuntos {

    adjArchivo: File;
    adjSecuencial: number = 0;
    afActivos: AfActivos = new AfActivos();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.adjArchivo = data.adjArchivo ? data.adjArchivo : this.adjArchivo;
        this.adjSecuencial = data.adjSecuencial ? data.adjSecuencial : this.adjSecuencial;
        this.afActivos = data.afActivos ? new AfActivos(data.afActivos) : this.afActivos;
    }

}