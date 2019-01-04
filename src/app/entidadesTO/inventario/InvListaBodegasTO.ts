export class InvListaBodegasTO {
    public bodCodigo: string = null;
    public bodNombre: string = null;
    public bodResponsable: string = null;
    public bodInactiva: boolean = false;
    public codigoCP: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bodCodigo = data.bodCodigo ? data.bodCodigo : this.bodCodigo;
        this.bodNombre = data.bodNombre ? data.bodNombre : this.bodNombre;
        this.bodResponsable = data.bodResponsable ? data.bodResponsable : this.bodResponsable;
        this.bodInactiva = data.bodInactiva ? data.bodInactiva : this.bodInactiva;
        this.codigoCP = data.codigoCP ? data.codigoCP : this.codigoCP;
    }

}