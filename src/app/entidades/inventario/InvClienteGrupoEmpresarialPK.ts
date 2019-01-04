export class InvClienteGrupoEmpresarialPK {
    public geEmpresa: string = "";
    public geCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.geEmpresa = data.geEmpresa ? data.geEmpresa : this.geEmpresa;
        this.geCodigo = data.geCodigo ? data.geCodigo : this.geCodigo;
    }

}