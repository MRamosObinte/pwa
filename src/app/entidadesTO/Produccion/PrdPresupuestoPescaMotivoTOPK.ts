
export class PrdPresupuestoPescaMotivoTOPK {

    presuEmpresa: string = "";
    presuCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {

        this.presuEmpresa = data.presuEmpresa ? data.presuEmpresa : this.presuEmpresa;
        this.presuCodigo = data.presuCodigo ? data.presuCodigo : this.presuCodigo;
    }
}