export class InvBodegaPK {

    bodEmpresa: string = null;
    bodCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bodEmpresa = data.bodEmpresa ? data.bodEmpresa : this.bodEmpresa;
        this.bodCodigo = data.bodCodigo ? data.bodCodigo : this.bodCodigo;
    }

}