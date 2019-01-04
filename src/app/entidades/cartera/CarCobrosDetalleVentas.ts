import { CarCobros } from "./CarCobros";

export class CarCobrosDetalleVentas {

    detSecuencial: number = 0;
    detValor: number = 0;
    vtaEmpresa: string = "";
    vtaPeriodo: string = "";
    vtaMotivo: string = "";
    vtaNumero: string = "";
    secEmpresa: string = "";
    secCodigo: string = "";
    carCobros: CarCobros = new CarCobros();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial :this.detSecuencial;
        this.detValor = data.detValor ? data.detValor :this.detValor;
        this.vtaEmpresa = data.vtaEmpresa ? data.vtaEmpresa :this.vtaEmpresa;
        this.vtaPeriodo = data.vtaPeriodo ? data.vtaPeriodo :this.vtaPeriodo;
        this.vtaMotivo = data.vtaMotivo ? data.vtaMotivo :this.vtaMotivo;
        this.vtaNumero = data.vtaNumero ? data.vtaNumero :this.vtaNumero;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa :this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo :this.secCodigo;
        this.carCobros = data.carCobros ? data.carCobros :this.carCobros;
    }
}