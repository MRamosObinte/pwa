
export class ConNumeracionTO {
    public numEmpresa: String = null;
    public numPeriodo: String = null;
    public numTipo: String = null;
    public numSecuencia: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.numEmpresa = data ? data.numEmpresa : this.numEmpresa;
        this.numPeriodo = data ? data.numPeriodo : this.numPeriodo;
        this.numTipo = data ? data.numTipo : this.numTipo;
        this.numSecuencia = data ? data.numSecuencia : this.numSecuencia;
    }
}