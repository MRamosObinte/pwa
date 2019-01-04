export class PrdGrameajePK {

    graEmpresa: string = null;
    graSector: string = null;
    graPiscina: string = null;
    graFecha: any;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.graEmpresa = data.graEmpresa ? data.graEmpresa : this.graEmpresa;
        this.graSector = data.graSector ? data.graSector : this.graSector;
        this.graPiscina = data.graPiscina ? data.graPiscina : this.graPiscina;
        this.graFecha = data.graFecha ? data.graFecha : this.graFecha;
    }

}