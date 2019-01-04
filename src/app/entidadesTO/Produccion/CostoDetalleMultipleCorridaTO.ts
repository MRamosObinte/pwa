
export class CostoDetalleMultipleCorridaTO {

    id: number = 0;
    costoSector: string = "";
    costoPiscina: string = "";
    costoCorrida: string = "";
    costoProducto: string = "";
    costoCodigo: string = "";
    costoMedida: string = "";
    costoCantidad: number = 0;
    costoTotal: number = 0;
    costoPorcentaje: number = 0;
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
    }
}