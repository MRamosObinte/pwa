export class CarPagosAnticiposPK {

    antEmpresa: string = "";
    antPeriodo: string = "";
    antTipo: string = "";
    antNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.antEmpresa=data.antEmpresa ? data.antEmpresa : this.antEmpresa;
        this.antPeriodo=data.antPeriodo ? data.antPeriodo : this.antPeriodo;
        this.antTipo=data.antTipo ? data.antTipo : this.antTipo;
        this.antNumero=data.antNumero ? data.antNumero : this.antNumero;
    }
    
}