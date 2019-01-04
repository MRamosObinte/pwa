import { CarCobrosForma } from "./CarCobrosForma";
import { CarCobros } from "./CarCobros";

export class CarCobrosDetalleForma {

    detSecuencial: number = 0;
    detBanco: string = "";
    detCuenta: string = "";
    detFechaVencimiento: Date = new Date();
    detValor: number = 0;
    detReferencia: string = "";
    detObservaciones: string = "";
    banEmpresa: string = "";
    banCodigo: string = "";
    fpSecuencial: CarCobrosForma = new CarCobrosForma();
    carCobros: CarCobros = new CarCobros();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detBanco = data.detBanco ? data.detBanco : this.detBanco;
        this.detCuenta = data.detCuenta ? data.detCuenta : this.detCuenta;
        this.detFechaVencimiento = data.detFechaVencimiento ? data.detFechaVencimiento : this.detFechaVencimiento;
        this.detValor = data.detValor ? data.detValor : this.detValor;
        this.detReferencia = data.detReferencia ? data.detReferencia : this.detReferencia;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.banEmpresa = data.banEmpresa ? data.banEmpresa : this.banEmpresa;
        this.banCodigo = data.banCodigo ? data.banCodigo : this.banCodigo;
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.carCobros = data.carCobros ? data.carCobros : this.carCobros;
    }

}