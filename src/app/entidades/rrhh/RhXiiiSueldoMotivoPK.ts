export class RhXiiiSueldoMotivoPK {
    motEmpresa: string = "";
    motDetalle: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.motEmpresa = data ? data.motEmpresa : this.motEmpresa;
        this.motDetalle = data ? data.motDetalle : this.motDetalle;
    }
}