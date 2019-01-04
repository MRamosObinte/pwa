export class InvProductoPresentacionCajasComboListadoTO {

    prescCodigo:string = "";
	prescDetalle:string = "";
    prescAbreviado:string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prescCodigo = data.prescCodigo ? data.prescCodigo : this.prescCodigo;
        this.prescDetalle = data.prescDetalle ? data.prescDetalle : this.prescDetalle;
        this.prescAbreviado = data.prescAbreviado ? data.prescAbreviado : this.prescAbreviado;
    }
    
}