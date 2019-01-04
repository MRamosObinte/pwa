export class RhListaBonoConceptoTO {

    bcSecuencia: number = 0;
    bcDetalle: string = "";
    bcValor: number = 0;
    bcValorFijo: boolean = false;
    bcInactivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.bcSecuencia = data ? data.bcSecuencia : this.bcSecuencia;
        this.bcDetalle = data ? data.bcDetalle : this.bcDetalle;
        this.bcValor = data ? data.bcValor : this.bcValor;
        this.bcValorFijo = data ? data.bcValorFijo : this.bcValorFijo;
        this.bcInactivo = data ? data.bcInactivo : this.bcInactivo;        
    }

}
