export class ConContablePK {
    public conEmpresa: string = null;
    public conPeriodo: string = null;
    public conTipo: string = null;
    public conNumero: string = null;

    constructor(data?) {
        this.hydrate(data);
    }
    hydrate(data) {
        this.conEmpresa = data ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data ? data.conTipo : this.conTipo;
        this.conNumero = data ? data.conNumero : this.conNumero;
    }
}