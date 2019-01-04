export class InvProductoPresentacionUnidadesPK {
    presuEmpresa: String = null;
    presuCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.presuEmpresa = data.presuEmpresa ? data.presuEmpresa : this.presuEmpresa;
        this.presuCodigo = data.presuCodigo ? data.presuCodigo : this.presuCodigo;
    }
}