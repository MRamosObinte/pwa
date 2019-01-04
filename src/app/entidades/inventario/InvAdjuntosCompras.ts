import { InvCompras } from "./InvCompras";

export class InvAdjuntosCompras {

    adjSecuencial: string = null;
    adjTipo: string = null;
    adjArchivo: File = null;
    invCompras: InvCompras = new InvCompras();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.adjSecuencial = data.adjSecuencial ? data.adjSecuencial : this.adjSecuencial;
        this.adjTipo = data.adjTipo ? data.adjTipo : this.adjTipo;
        this.adjArchivo = data.adjArchivo ? data.adjArchivo : this.adjArchivo;
        this.invCompras = data.invCompras ? data.invCompras : this.invCompras;
    }

}
