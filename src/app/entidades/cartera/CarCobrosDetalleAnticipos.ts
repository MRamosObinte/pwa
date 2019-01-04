import { CarCobrosAnticipos } from "./CarCobrosAnticipos";
import { CarCobros } from "./CarCobros";

export class CarCobrosDetalleAnticipos {

    detSecuencial: number = null;
    detValor: number = 0;
    detObservaciones: string = "";
    carCobrosAnticipos:CarCobrosAnticipos = new CarCobrosAnticipos();
    carCobros:CarCobros = new CarCobros();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detValor = data.detValor ? data.detValor : this.detValor;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.carCobrosAnticipos = data.carCobrosAnticipos ? data.carCobrosAnticipos : this.carCobrosAnticipos;
        this.carCobros = data.carCobros ? data.carCobros : this.carCobros;
    }

}