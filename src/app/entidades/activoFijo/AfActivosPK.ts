export class AfActivosPK {

    afEmpresa: string;
    afCodigo: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.afEmpresa = data.afEmpresa ? data.afEmpresa : this.afEmpresa;
        this.afCodigo = data.afCodigo ? data.afCodigo : this.afCodigo;
    }

}