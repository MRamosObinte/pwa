
export class PrdCostoDetalleFechaTOPK {

    costoProducto: string = "";
    costoCodigo: string = "";
    costoMedida: string = "";
    costoCantidad: number = 0;
    costoTotal: number = 0;
    costoPorcentaje: number = 0;
    desde: any;
    hasta: any;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.costoProducto = data.costoProducto ? data.costoProducto : this.costoProducto;
        this.costoCodigo = data.costoCodigo ? data.costoCodigo : this.costoCodigo;
        this.costoMedida = data.costoMedida ? data.costoMedida : this.costoMedida;
        this.costoCantidad = data.costoCantidad ? data.costoCantidad : this.costoCantidad;
        this.costoTotal = data.costoTotal ? data.costoTotal : this.costoTotal;
        this.costoPorcentaje = data.costoPorcentaje ? data.costoPorcentaje : this.costoPorcentaje;
        this.desde = data.desde ? data.desde : this.desde;
        this.hasta = data.hasta ? data.hasta : this.hasta;
    }
}