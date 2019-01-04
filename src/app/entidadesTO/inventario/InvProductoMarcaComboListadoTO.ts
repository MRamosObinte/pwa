export class InvProductoMarcaComboListadoTO {

    marCodigo:string = "";
	marDetalle:string = "";
    marAbreviado:string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.marCodigo = data.marCodigo ? data.marCodigo : this.marCodigo;
        this.marDetalle = data.marDetalle ? data.marDetalle : this.marDetalle;
        this.marAbreviado = data.marAbreviado ? data.marAbreviado : this.marAbreviado;
    }
    
}