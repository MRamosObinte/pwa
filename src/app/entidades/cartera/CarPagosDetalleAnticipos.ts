import { CarPagosAnticipos } from "./CarPagosAnticipos";
import { CarPagos } from "./CarPagos";

export class CarPagosDetalleAnticipos {

    detSecuencial: number = null;
    detValor: number = 0;
    detObservaciones: string = "";
    carPagosAnticipos: CarPagosAnticipos = new CarPagosAnticipos();
    carPagos: CarPagos = new CarPagos();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detValor = data.detValor ? data.detValor : this.detValor;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.carPagosAnticipos = data.carPagosAnticipos ? data.carPagosAnticipos : this.carPagosAnticipos;
        this.carPagos = data.carPagos ? data.carPagos : this.carPagos;
    }

}