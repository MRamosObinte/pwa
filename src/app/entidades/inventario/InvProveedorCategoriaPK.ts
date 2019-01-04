export class InvProveedorCategoriaPK {

    pcEmpresa: String = null;
    pcCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pcEmpresa = data.pcEmpresa ? data.pcEmpresa : this.pcEmpresa;
        this.pcCodigo = data.pcCodigo ? data.pcCodigo : this.pcCodigo;
    }
}