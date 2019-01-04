export class ListaBanBancoTO {
    banCodigo: string = "";
    banNombre: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
        this.banCodigo = data.banCodigo ? data.banCodigo : this.banCodigo;
    }
}