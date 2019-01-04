export class BanBancoPK {

    banEmpresa: string = "";
    banCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.banEmpresa = data.banEmpresa ? data.banEmpresa : this.banEmpresa;
        this.banCodigo = data.banCodigo ? data.banCodigo : this.banCodigo;
    }
}