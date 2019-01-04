export class CarCobrosPK {

    cobEmpresa: string = "";
    cobPeriodo: string = "";
    cobTipo: string = "";
    cobNumero: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cobEmpresa = data.cobEmpresa ? data.cobEmpresa : this.cobEmpresa;
        this.cobPeriodo = data.cobPeriodo ? data.cobPeriodo : this.cobPeriodo;
        this.cobTipo = data.cobTipo ? data.cobTipo : this.cobTipo;
        this.cobNumero = data.cobNumero ? data.cobNumero : this.cobNumero;
    }
    
}