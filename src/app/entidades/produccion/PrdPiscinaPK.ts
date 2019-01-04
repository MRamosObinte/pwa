export class PrdPiscinaPK {

    pisEmpresa: string = "";
    pisSector: string = "";
    pisNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
    }
}