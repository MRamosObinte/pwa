import { InvProducto } from "./InvProducto";
import { InvBodega } from "./InvBodega";

export class InvProductoSaldos {

    stkSecuencial: Number = 0;
    stkSaldoInicial: Number = 0;
    stkValorPromedioInicial: Number = 0;
    stkValorUltimaCompraInicial: Number = 0;
    stkFechaUltimaCompraInicial: Date = null;
    stkSaldoFinal: Number = 0;
    stkValorPromedioFinal: Number = 0;
    stkValorUltimaCompraFinal: Number = 0;
    stkFechaUltimaCompraFinal: Date = null;
    invProducto: InvProducto = new InvProducto();
    invBodega: InvBodega = new InvBodega();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.stkSecuencial = data.stkSecuencial ? data.stkSecuencial : this.stkSecuencial;
        this.stkSaldoInicial = data.stkSaldoInicial ? data.stkSaldoInicial : this.stkSaldoInicial;
        this.stkValorPromedioInicial = data.stkValorPromedioInicial ? data.stkValorPromedioInicial : this.stkValorPromedioInicial;
        this.stkValorUltimaCompraInicial = data.stkValorUltimaCompraInicial ? data.stkValorUltimaCompraInicial : this.stkValorUltimaCompraInicial;
        this.stkFechaUltimaCompraInicial = data.stkFechaUltimaCompraInicial ? data.stkFechaUltimaCompraInicial : this.stkFechaUltimaCompraInicial;
        this.stkSaldoFinal = data.stkSaldoFinal ? data.stkSaldoFinal : this.stkSaldoFinal;
        this.stkValorPromedioFinal = data.stkValorPromedioFinal ? data.stkValorPromedioFinal : this.stkValorPromedioFinal;
        this.stkValorUltimaCompraFinal = data.stkValorUltimaCompraFinal ? data.stkValorUltimaCompraFinal : this.stkValorUltimaCompraFinal;
        this.stkFechaUltimaCompraFinal = data.stkFechaUltimaCompraFinal ? data.stkFechaUltimaCompraFinal : this.stkFechaUltimaCompraFinal;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;
    }
}