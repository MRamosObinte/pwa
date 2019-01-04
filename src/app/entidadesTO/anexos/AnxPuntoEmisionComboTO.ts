export class AnxPuntoEmisionComboTO {

    puntoEmision : string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.puntoEmision = data.puntoEmision ? data.puntoEmision : this.puntoEmision;
    }

}