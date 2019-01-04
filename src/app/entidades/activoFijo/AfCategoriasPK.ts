export class AfCategoriasPK {

    catEmpresa: string;
    catCodigo: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.catEmpresa = data.catEmpresa ? data.catEmpresa : this.catEmpresa;
        this.catCodigo = data.catCodigo ? data.catCodigo : this.catCodigo;
    }

}