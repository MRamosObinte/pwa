import { AnxCompraDividendo } from "./AnxCompraDividendo";
import { AnxCompraDetalle } from "./AnxCompraDetalle";

export class AnxConcepto {

    conCodigo: String = "";
    conConcepto: String = "";
    conPorcentaje: number = 0;
    conIngresaPorcentaje: String = "";
    conFechaInicio: Date = new Date();
    conFechaFin: Date = new Date();
    anxCompraDividendoList: Array<AnxCompraDividendo> = [];
    anxCompraDetalleList: Array<AnxCompraDetalle> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.conCodigo = data.conCodigo ? data.conCodigo : this.conCodigo;
        this.conConcepto = data.conConcepto ? data.conConcepto : this.conConcepto;
        this.conPorcentaje = data.conPorcentaje ? data.conPorcentaje : this.conPorcentaje;
        this.conIngresaPorcentaje = data.conIngresaPorcentaje ? data.conIngresaPorcentaje : this.conIngresaPorcentaje;
        this.conFechaInicio = data.conFechaInicio ? data.conFechaInicio : this.conFechaInicio;
        this.conFechaFin = data.conFechaFin ? data.conFechaFin : this.conFechaFin;
        this.anxCompraDividendoList = data.anxCompraDividendoList ? data.anxCompraDividendoList : this.anxCompraDividendoList;
        this.anxCompraDetalleList = data.anxCompraDetalleList ? data.anxCompraDetalleList : this.anxCompraDetalleList;
    }
}