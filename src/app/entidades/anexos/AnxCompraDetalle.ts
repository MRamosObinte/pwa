import { AnxConcepto } from "./AnxConcepto";
import { AnxCompra } from "./AnxCompra";

export class AnxCompraDetalle {

    detSecuencial: number = 0;
    detBase0: number = 0;
    detBaseimponible: number = 0;
    detBasenoobjetoiva: number = 0;
    detPorcentaje: number = 0;
    detValorretenido: number = 0;
    detOrden: number = 0;
    detConcepto: AnxConcepto = new AnxConcepto();
    anxCompra: AnxCompra = new AnxCompra();


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detBase0 = data.detBase0 ? data.detBase0 : this.detBase0;
        this.detBaseimponible = data.detBaseimponible ? data.detBaseimponible : this.detBaseimponible;
        this.detBasenoobjetoiva = data.detBasenoobjetoiva ? data.detBasenoobjetoiva : this.detBasenoobjetoiva;
        this.detPorcentaje = data.detPorcentaje ? data.detPorcentaje : this.detPorcentaje;
        this.detValorretenido = data.detValorretenido ? data.detValorretenido : this.detValorretenido;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detConcepto = data.detConcepto ? data.detConcepto : this.detConcepto;
        this.anxCompra = data.anxCompra ? data.anxCompra : this.anxCompra;
    }
}