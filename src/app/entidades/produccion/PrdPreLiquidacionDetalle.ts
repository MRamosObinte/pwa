import { PrdProducto } from './PrdProducto';
import { PrdTalla } from './PrdTalla';
import { PrdPreLiquidacion } from './PrdPreLiquidacion';
export class PrdPreLiquidacionDetalle {

    detSecuencial: number = 0;
    detOrden: number = 0;
    detLibras: number = 0;
    detPrecio: number = 0;
    prdProducto: PrdProducto = new PrdProducto();
    prdTalla: PrdTalla = new PrdTalla();
    prdPreLiquidacion: PrdPreLiquidacion = new PrdPreLiquidacion();
    prdTotal: number = 0; //temporal

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detLibras = data.detLibras ? data.detLibras : this.detLibras;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.prdProducto = data.prdProducto ? new PrdProducto(data.prdProducto) : this.prdProducto;
        this.prdTalla = data.prdTalla ? new PrdTalla(data.prdTalla) : this.prdTalla;
        this.prdPreLiquidacion = data.prdPreLiquidacion ? new PrdPreLiquidacion(data.prdPreLiquidacion) : this.prdPreLiquidacion;
        this.prdTotal = data.prdTotal ? data.prdTotal : this.prdTotal;
    }
}