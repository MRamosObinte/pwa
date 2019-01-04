import { PrdTalla } from './PrdTalla';
import { PrdPresupuestoPesca } from './PrdPresupuestoPesca';
export class PrdPresupuestoPescaDetalle {

    detSecuencial: number = 0;
    detOrden: number = 0;
    detCantidad: number = 0;
    detGramos: number = 0;
    detPorcentaje: number = 0;
    detPrecio: number = 0;
    prdLiquidacionTalla: PrdTalla = new PrdTalla();
    prdPresupuestoPesca: PrdPresupuestoPesca = new PrdPresupuestoPesca();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detGramos = data.detGramos ? data.detGramos : this.detGramos;
        this.detPorcentaje = data.detPorcentaje ? data.detPorcentaje : this.detPorcentaje;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.prdLiquidacionTalla = data.prdLiquidacionTalla ? new PrdTalla(data.prdLiquidacionTalla) : this.prdLiquidacionTalla;
        this.prdPresupuestoPesca = data.prdPresupuestoPesca ? new PrdPresupuestoPesca(data.prdPresupuestoPesca) : this.prdPresupuestoPesca;
    }

}