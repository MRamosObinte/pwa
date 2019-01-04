import { AnxProvinciasPK } from "./AnxProvinciasPK";

export class AnxProvincias {

    anxProvinciasPK: AnxProvinciasPK = new AnxProvinciasPK();
    provinciaNombre: String = "";
    cantonNombre: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anxProvinciasPK = data.anxProvinciasPK ? data.anxProvinciasPK : this.anxProvinciasPK;
        this.provinciaNombre = data.provinciaNombre ? data.provinciaNombre : this.provinciaNombre;
        this.cantonNombre = data.cantonNombre ? data.cantonNombre : this.cantonNombre;
    }
}