export class InvProformasPK {

    profEmpresa: String = null;
    profPeriodo: String = null;
    profMotivo: String = null;
    profNumero: String = null;


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.profEmpresa = data.profEmpresa ? data.profEmpresa : this.profEmpresa;
        this.profPeriodo = data.profPeriodo ? data.profPeriodo : this.profPeriodo;
        this.profMotivo = data.profMotivo ? data.profMotivo : this.profMotivo;
        this.profNumero = data.profNumero ? data.profNumero : this.profNumero;
    }
}