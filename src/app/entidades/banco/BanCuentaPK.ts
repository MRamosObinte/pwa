export class BanCuentaPK {

    ctaEmpresa: string = "";
    ctaCuentaContable: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null
    }
    
    hydrate(data) {
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCuentaContable = data.ctaCuentaContable ? data.ctaCuentaContable : this.ctaCuentaContable;
    }
}