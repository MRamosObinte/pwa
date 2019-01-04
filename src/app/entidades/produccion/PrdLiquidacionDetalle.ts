import { PrdTalla } from "./PrdTalla";
import { PrdProducto } from "./PrdProducto";
import { PrdLiquidacion } from "./PrdLiquidacion";


export class PrdLiquidacionDetalle {
    detSecuencial: number = null;
    detOrden: number = null;
    detLibras: number = 0;
    detPrecio: number = 0;
    prdLiquidacionTalla: PrdTalla = new PrdTalla();
    prdLiquidacionProducto: PrdProducto = new PrdProducto();
    prdLiquidacion: PrdLiquidacion = new PrdLiquidacion();
    prdTotal: number = 0; //temporal

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detLibras = data.detLibras ? data.detLibras : this.detLibras;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.prdLiquidacionTalla = data.prdLiquidacionTalla ? data.prdLiquidacionTalla : this.prdLiquidacionTalla;
        this.prdLiquidacionProducto = data.prdLiquidacionProducto ? data.prdLiquidacionProducto : this.prdLiquidacionProducto;
        this.prdLiquidacion = data.prdLiquidacion ? data.prdLiquidacion : this.prdLiquidacion;
        this.prdTotal = data.prdTotal ? data.prdTotal : this.prdTotal;
    }
}