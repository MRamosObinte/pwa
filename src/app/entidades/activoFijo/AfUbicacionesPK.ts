export class AfUbicacionesPK {

    ubiEmpresa: string = "";
    ubiCodigo: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ubiEmpresa = data.ubiEmpresa ? data.ubiEmpresa : this.ubiEmpresa;
        this.ubiCodigo = data.ubiCodigo ? data.ubiCodigo : this.ubiCodigo;
    }

}