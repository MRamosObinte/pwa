export class PrdVehiculosPK {

    vehEmpresa: String = "";
    vehEstablecimiento: String = "";
    vehPlaca: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vehEmpresa = data.vehEmpresa ? data.vehEmpresa : this.vehEmpresa;
        this.vehEstablecimiento = data.vehEstablecimiento ? data.vehEstablecimiento : this.vehEstablecimiento;
        this.vehPlaca = data.vehPlaca ? data.vehPlaca : this.vehPlaca;
    }

}