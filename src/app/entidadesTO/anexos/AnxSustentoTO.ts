export class AnxSustentoTO {

    susCodigo:string = "";
    susDescripcion:string = "";
    susComprobante: string = "";
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.susCodigo = data.susCodigo ? data.susCodigo : this.susCodigo;
        this.susDescripcion = data.susDescripcion ? data.susDescripcion : this.susDescripcion;
        this.susComprobante = data.susComprobante ? data.susComprobante : this.susComprobante;
    }

}