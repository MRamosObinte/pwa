export class BanConciliacionPK {

    concEmpresa: string = "";
    concCuentaContable: string = "";
    concCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.concEmpresa = data.concEmpresa ? data.concEmpresa : this.concEmpresa;
        this.concCuentaContable = data.concCuentaContable ? data.concCuentaContable : this.concCuentaContable;
        this.concCodigo = data.concCodigo ? data.concCodigo : this.concCodigo;
    }
    
}