export class RhBonoConceptoTO {

    empCodigo: string = "";
    bcSecuencia: number = 0;
    bcDetalle: string = "";
    bcValor: number = 0;
    bcValorFijo: boolean = false;
    bcInactivo: boolean = false;
    usrInsertaBonoConcepto: string = "";
    usrFechaInsertaBonoConcepto: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data ? data.empCodigo : this.empCodigo;
        this.bcSecuencia = data ? data.bcSecuencia : this.bcSecuencia;
        this.bcDetalle = data ? data.bcDetalle : this.bcDetalle;
        this.bcValor = data ? data.bcValor : this.bcValor;
        this.bcValorFijo = data ? data.bcValorFijo : this.bcValorFijo;
        this.bcInactivo = data ? data.bcInactivo : this.bcInactivo;
        this.usrInsertaBonoConcepto = data ? data.usrInsertaBonoConcepto : this.usrInsertaBonoConcepto;
        this.usrFechaInsertaBonoConcepto = data ? data.usrFechaInsertaBonoConcepto : this.usrFechaInsertaBonoConcepto;
    }

}