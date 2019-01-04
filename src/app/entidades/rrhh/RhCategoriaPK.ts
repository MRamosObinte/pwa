export class RhCategoriaPK {
    catEmpresa: string = "";
    catNombre: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.catEmpresa = data.catEmpresa ? data.catEmpresa : this.catEmpresa;
        this.catNombre = data.catNombre ? data.catNombre : this.catNombre;
    }
}