export class AnxTipoComprobanteTO {

    tcCodigo : string = "";
	tcDescripcion : string = "";
    tcTransaccion : string = "";
    tcSustento: string = "";
    tcAbreviatura: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tcCodigo = data.tcCodigo ? data.tcCodigo : this.tcCodigo;
        this.tcDescripcion = data.tcDescripcion ? data.tcDescripcion : this.tcDescripcion;
        this.tcTransaccion = data.tcTransaccion ? data.tcTransaccion : this.tcTransaccion;
        this.tcSustento = data.tcSustento ? data.tcSustento : this.tcSustento;
        this.tcAbreviatura = data.tcAbreviatura ? data.tcAbreviatura : this.tcAbreviatura;
    }

}