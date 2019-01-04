export class InvConsumosNumeracionPK {
    numEmpresa: String = null;
    numPeriodo: String = null;
    numMotivo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.numEmpresa = data.numEmpresa ? data.numEmpresa : this.numEmpresa;
        this.numPeriodo = data.numPeriodo ? data.numPeriodo : this.numPeriodo;
        this.numMotivo = data.numMotivo ? data.numMotivo : this.numMotivo;
    }
}