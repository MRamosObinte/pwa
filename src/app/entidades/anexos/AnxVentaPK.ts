export class AnxVentaPK {

    venEmpresa: String = "";
    venPeriodo: String = "";
    venMotivo: String = "";
    venNumero: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.venEmpresa = data.venEmpresa ? data.venEmpresa : this.venEmpresa;
        this.venPeriodo = data.venPeriodo ? data.venPeriodo : this.venPeriodo;
        this.venMotivo = data.venMotivo ? data.venMotivo : this.venMotivo;
        this.venNumero = data.venNumero ? data.venNumero : this.venNumero;
    }
}