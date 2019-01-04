export class SisPeriodoPK {

    perEmpresa: string = "";
    perCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.perEmpresa = data.perEmpresa ? data.perEmpresa : this.perEmpresa;
        this.perCodigo = data.perCodigo ? data.perCodigo : this.perCodigo;
    }
}