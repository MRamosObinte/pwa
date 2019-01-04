export class InvProductoPK {
    proEmpresa: string = "";
    proCodigoPrincipal: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.proEmpresa = data ? data.proEmpresa : this.proEmpresa;
        this.proCodigoPrincipal = data ? data.proCodigoPrincipal : this.proCodigoPrincipal;
    }

}