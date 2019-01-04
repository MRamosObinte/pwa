export class PrdResumenCorridaPK {

    rcEmpresa: String = "";
    rcSector: String = "";
    rcPiscina: String = "";
    rcCorrida: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rcEmpresa = data.rcEmpresa ? data.rcEmpresa : this.rcEmpresa;
        this.rcSector = data.rcSector ? data.rcSector : this.rcSector;
        this.rcPiscina = data.rcPiscina ? data.rcPiscina : this.rcPiscina;
        this.rcCorrida = data.rcCorrida ? data.rcCorrida : this.rcCorrida;
    }

}