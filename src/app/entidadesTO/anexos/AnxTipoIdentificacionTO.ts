export class AnxTipoIdentificacionTO {

    tiCodigo: string = "";
    tiDetalle: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tiCodigo = data.tiCodigo ? data.tiCodigo : this.tiCodigo;
        this.tiDetalle = data.tiDetalle ? data.tiDetalle : this.tiDetalle;
    }
    
}