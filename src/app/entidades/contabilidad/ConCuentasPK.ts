export class ConCuentasPK {
    public ctaEmpresa: string = null;
    public ctaCodigo: string = null;
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.ctaEmpresa = data ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data ? data.ctaCodigo : this.ctaCodigo;
    }
}