export class AnxSustentoComboTO {

    susCodigo: string = null;
    susDescripcion: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.susCodigo = data.susCodigo ? data.susCodigo : this.susCodigo;
        this.susDescripcion = data.susDescripcion ? data.susDescripcion : this.susDescripcion;
    }

}