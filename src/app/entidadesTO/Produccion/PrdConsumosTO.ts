
export class PrdConsumosTO {
    id: number;
    consumoSector: string = "";
    consumoProducto: String = "";
    consumoCodigo: String = "";
    consumoMedida: String = "";
    consumoCantidad: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.consumoSector = data.consumoSector ? data.consumoSector : this.consumoSector;
        this.consumoProducto = data.consumoProducto ? data.consumoProducto : this.consumoProducto;
        this.consumoCodigo = data.consumoCodigo ? data.consumoCodigo : this.consumoCodigo;
        this.consumoMedida = data.consumoMedida ? data.consumoMedida : this.consumoMedida;
        this.consumoCantidad = data.consumoCantidad ? data.consumoCantidad : this.consumoCantidad;
    }
}