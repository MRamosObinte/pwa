import { InvProducto } from "./InvProducto";
import { InvConsumos } from "./InvConsumos";
import { InvBodega } from "./InvBodega";

export class InvConsumosDetalle {

    detSecuencial: number = 0;
    detOrden: number = 0;
    detPendiente: boolean = false;
    detCantidad: number = 0;
    detValorPromedio: number = 0;
    detValorUltimaCompra: number = 0;
    detSaldo: number = 0;
    secEmpresa: string = null;
    secCodigo: string = null;
    pisEmpresa: string = null;
    pisSector: string = null;
    pisNumero: string = null;
    invProducto: InvProducto = new InvProducto();
    invConsumos: InvConsumos = new InvConsumos();
    invBodega: InvBodega = new InvBodega();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detPendiente = data.detPendiente ? data.detPendiente : this.detPendiente;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detValorPromedio = data.detValorPromedio ? data.detValorPromedio : this.detValorPromedio;
        this.detValorUltimaCompra = data.detValorUltimaCompra ? data.detValorUltimaCompra : this.detValorUltimaCompra;
        this.detSaldo = data.detSaldo ? data.detSaldo : this.detSaldo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
        this.invConsumos = data.invConsumos ? data.invConsumos : this.invConsumos;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;

    }
}