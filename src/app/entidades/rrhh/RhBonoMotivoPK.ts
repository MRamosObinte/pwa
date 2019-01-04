export class RhBonoMotivoPK {
    motEmpresa: string = "";
    motDetalle: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.motEmpresa = data.motEmpresa ? data.motEmpresa : this.motEmpresa;
        this.motDetalle = data.motDetalle ? data.motDetalle : this.motDetalle;

    }
}