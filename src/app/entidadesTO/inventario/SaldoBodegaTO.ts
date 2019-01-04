export class SaldoBodegaTO {
    public id: number = 0;
    public sbBodega: string = "";
    public sbProducto: string = "";
    public sbNombre: string = "";
    public sbMedida: string = "";
    public sbStock: number = 0;
    public sbCosto: number = 0;
    public sbTotal: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.sbBodega = data.sbBodega ? data.sbBodega : this.sbBodega;
        this.sbProducto = data.sbProducto ? data.sbProducto : this.sbProducto;
        this.sbNombre = data.sbNombre ? data.sbNombre : this.sbNombre;
        this.sbMedida = data.sbMedida ? data.sbMedida : this.sbMedida;
        this.sbStock = data.sbStock ? data.sbStock : this.sbStock;
        this.sbCosto = data.sbCosto ? data.sbCosto : this.sbCosto;
        this.sbTotal = data.sbTotal ? data.sbTotal : this.sbTotal;
    }

}