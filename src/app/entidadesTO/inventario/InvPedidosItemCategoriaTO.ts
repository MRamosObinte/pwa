export class InvPedidosItemCategoriaTO {
    icatCodigo: string = "";
    icatDescripcion: string = "";
    icatInactivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.icatCodigo = data.icatCodigo ? data.icatCodigo : this.icatCodigo;
        this.icatDescripcion = data.icatDescripcion ? data.icatDescripcion : this.icatDescripcion;
        this.icatInactivo = data.icatInactivo ? data.icatInactivo : this.icatInactivo;
    }

}