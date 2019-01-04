export class InvProductoPresentacionUnidadesComboListadoTO {

    presuCodigo: string = "";
	presuDetalle: string = "";
    presuAbreviado: string = "";
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.presuCodigo = data.presuCodigo ? data.presuCodigo : this.presuCodigo;
        this.presuDetalle = data.presuDetalle ? data.presuDetalle : this.presuDetalle;
        this.presuAbreviado = data.presuAbreviado ? data.presuAbreviado : this.presuAbreviado;
    }

}