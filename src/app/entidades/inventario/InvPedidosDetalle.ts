import { InvPedidos } from "./InvPedidos";
import { InvProducto } from "./InvProducto";

export class InvPedidosDetalle {

    detSecuencial: number = 0;
    detOrden: number = 0;
    detCantidadSolicitada: number = 0;
    detCantidadAprobada: number = 0;
    detCantidadAdquirida: number = 0;
    detPrecioReferencial: number = 0;
    detPrecioReal: number = 0;
    detObservacionesRegistra: string = "";
    detObservacionesAprueba: string = "";
    detObservacionesEjecuta: string = "";
    detCompletado: boolean = false;
    invPedidos: InvPedidos = new InvPedidos();
    invProducto: InvProducto = new InvProducto();
    proCodigoPrincipal: string = null; //SE UN TEMPORAL PARA LA TABLA
    parcial: number = 0;//SE UN TEMPORAL PARA LA TABLA
    categoriaProductoValido: boolean = true;//SE UN TEMPORAL PARA LA TABLA

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detCantidadSolicitada = data.detCantidadSolicitada ? data.detCantidadSolicitada : this.detCantidadSolicitada;
        this.detCantidadAprobada = data.detCantidadAprobada ? data.detCantidadAprobada : this.detCantidadAprobada;
        this.detCantidadAdquirida = data.detCantidadAdquirida ? data.detCantidadAdquirida : this.detCantidadAdquirida;
        this.detPrecioReferencial = data.detPrecioReferencial ? data.detPrecioReferencial : this.detPrecioReferencial;
        this.detPrecioReal = data.detPrecioReal ? data.detPrecioReal : this.detPrecioReal;
        this.detObservacionesRegistra = data.detObservacionesRegistra ? data.detObservacionesRegistra : this.detObservacionesRegistra;
        this.detObservacionesAprueba = data.detObservacionesAprueba ? data.detObservacionesAprueba : this.detObservacionesAprueba;
        this.detObservacionesEjecuta = data.detObservacionesEjecuta ? data.detObservacionesEjecuta : this.detObservacionesEjecuta;
        this.detCompletado = data.detCompletado ? data.detCompletado : this.detCompletado;
        this.invPedidos = data.invPedidos ? data.invPedidos : this.invPedidos;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
        this.proCodigoPrincipal = this.invProducto && this.invProducto.invProductoPK ? this.invProducto.invProductoPK.proCodigoPrincipal : null;
    }
}