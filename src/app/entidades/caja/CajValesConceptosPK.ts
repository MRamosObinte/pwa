export class CajValesConceptosPK {

    concEmpresa: String = "";
    concCodigo: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.concEmpresa = data.concEmpresa ? data.concEmpresa : this.concEmpresa;
        this.concCodigo = data.concCodigo ? data.concCodigo : this.concCodigo;
    }

}