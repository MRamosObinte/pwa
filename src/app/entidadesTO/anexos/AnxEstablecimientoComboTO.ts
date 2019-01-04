export class AnxEstablecimientoComboTO {

    establecimiento : string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.establecimiento = data.establecimiento ? data.establecimiento : this.establecimiento;
    }

}