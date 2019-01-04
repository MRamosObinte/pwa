export class RhComboCategoriaTO {
    catNombre: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.catNombre = data.catNombre ? data.catNombre : this.catNombre;
    }
}