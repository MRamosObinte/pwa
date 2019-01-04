export class BanCajaPK {

    cajaEmpresa: string = "";
    cajaCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.cajaEmpresa = data.cajaEmpresa ? data.cajaEmpresa : this.cajaEmpresa;
        this.cajaCodigo = data.cajaCodigo ? data.cajaCodigo : this.cajaCodigo;
    }
}