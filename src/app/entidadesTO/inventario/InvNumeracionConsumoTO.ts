export class InvNumeracionConsumoTO {
    public numEmpresa: string = "";
    public numPeriodo: string = "";
    public numMotivo: string = "";
    public numSecuencia: string = "";
    public numId: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.numEmpresa = data.numEmpresa ? data.numEmpresa : this.numEmpresa;
        this.numPeriodo = data.numPeriodo ? data.numPeriodo : this.numPeriodo;
        this.numMotivo = data.numMotivo ? data.numMotivo : this.numMotivo;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
        this.numId = data.numId ? data.numId : this.numId;
    }

}