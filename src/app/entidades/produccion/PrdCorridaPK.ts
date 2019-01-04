export class PrdCorridaPK {

    corEmpresa: string = "";
    corSector: string = "";
    corPiscina: string = "";
    corNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.corEmpresa = data.corEmpresa ? data.corEmpresa : this.corEmpresa;
        this.corSector = data.corSector ? data.corSector : this.corSector;
        this.corPiscina = data.corPiscina ? data.corPiscina : this.corPiscina;
        this.corNumero = data.corNumero ? data.corNumero : this.corNumero;
    }

}