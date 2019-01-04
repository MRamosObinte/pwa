import { AnxAnulados } from "./AnxAnulados";

export class AnxTipocomprobante {

    tcCodigo: String = "";
    tcDescripcion: String = "";
    tcTransaccion: String = "";
    tcSustento: String = "";
    tcAbreviatura: String = "";
    tcReporte: String = "";
    anxAnuladosList: Array<AnxAnulados> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tcCodigo = data.tcCodigo ? data.tcCodigo : this.tcCodigo;
        this.tcDescripcion = data.tcDescripcion ? data.tcDescripcion : this.tcDescripcion;
        this.tcTransaccion = data.tcTransaccion ? data.tcTransaccion : this.tcTransaccion;
        this.tcSustento = data.tcSustento ? data.tcSustento : this.tcSustento;
        this.tcAbreviatura = data.tcAbreviatura ? data.tcAbreviatura : this.tcAbreviatura;
        this.tcReporte = data.tcReporte ? data.tcReporte : this.tcReporte;
        this.anxAnuladosList = data.anxAnuladosList ? data.anxAnuladosList : this.anxAnuladosList;
    }
}