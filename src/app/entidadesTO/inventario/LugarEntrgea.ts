export class LugarEntrega {

    public nombre: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.nombre = data.nombre ? data.nombre : this.nombre;
    }

}