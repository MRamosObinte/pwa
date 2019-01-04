export class InvFunComprasConsolidandoProductosTO {
    public id: number = 0;
    public ccpProducto: string = null;
    public ccpCodigo: string = null;
    public ccpMedida: string = null;
    public ccpCantidad: number = null;
    public ccpTotal: number = null;
    public ccpPorcentaje: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.ccpProducto = data.ccpProducto ? data.ccpProducto : this.ccpProducto;
        this.ccpCodigo = data.ccpCodigo ? data.ccpCodigo : this.ccpCodigo;
        this.ccpMedida = data.ccpMedida ? data.ccpMedida : this.ccpMedida;
        this.ccpCantidad = data.ccpCantidad ? data.ccpCantidad : this.ccpCantidad;
        this.ccpTotal = data.ccpTotal ? data.ccpTotal : this.ccpTotal;
        this.ccpPorcentaje = data.ccpPorcentaje ? data.ccpPorcentaje : this.ccpPorcentaje;
    }

}