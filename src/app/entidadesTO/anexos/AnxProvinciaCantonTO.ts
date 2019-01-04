export class AnxProvinciaCantonTO {

    codigo: string = "";
    nombre: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.codigo = data.codigo ? data.codigo : this.codigo;
        this.nombre = data.nombre ? data.nombre : this.nombre;
    }

}