import { InvPedidosOrdenCompra } from "../../entidades/inventario/InvPedidosOrdenCompra";

export class InvPedidosOrdenCompraDetalleTO {

    detSecuencialOrdenCompra: number = 0;
    detOrden: number = 0;
    detCantidad: number = 0;
    detPrecioReferencial: number = 0;
    detPrecioReal: number = 0;
    detObservaciones: string = "";
    //Detalle de pedidos
    detSecuencial: Number = 0;
    detCantidadAprobada: Number = 0;
    detCantidadAdquirida: Number = 0;
    detCompletado: boolean = false;
    //Producto
    proEmpresa: string = null;
    proCodigoPrincipal: string = null;
    proNombre: string = "";
    proCostoReferencial1: number = 0;
    proCostoReferencial2: number = 0;
    proCostoReferencial3: number = 0;
    //Unidad de medida
    medEmpresa: string = null;
    medCodigo: string = null;
    medDetalle: String = null;
    //Orden de compra
    ocEmpresa: string = "";
    ocSector: string = "";
    ocMotivo: string = "";
    ocNumero: string = "";
    //observaciones
    ocObsRegistra:string = "";
    ocObsAprueba:string = "";
    ocObsEjecuta:string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencialOrdenCompra = data.detSecuencialOrdenCompra ? data.detSecuencialOrdenCompra : this.detSecuencialOrdenCompra;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecioReferencial = data.detPrecioReferencial ? data.detPrecioReferencial : this.detPrecioReferencial;
        this.detPrecioReal = data.detPrecioReal ? data.detPrecioReal : this.detPrecioReal;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detCantidadAprobada = data.detCantidadAprobada ? data.detCantidadAprobada : this.detCantidadAprobada;
        this.detCantidadAdquirida = data.detCantidadAdquirida ? data.detCantidadAdquirida : this.detCantidadAdquirida;
        this.detCompletado = data.detCompletado ? data.detCompletado : this.detCompletado;
        this.proEmpresa = data.proEmpresa ? data.proEmpresa : this.proEmpresa;
        this.proCodigoPrincipal = data.proCodigoPrincipal ? data.proCodigoPrincipal : this.proCodigoPrincipal;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.medEmpresa = data.medEmpresa ? data.medEmpresa : this.medEmpresa;
        this.medCodigo = data.medCodigo ? data.medCodigo : this.medCodigo;
        this.medDetalle = data.medDetalle ? data.medDetalle : this.medDetalle;
        this.ocEmpresa = data.ocEmpresa ? data.ocEmpresa : this.ocEmpresa;
        this.ocSector = data.ocSector ? data.ocSector : this.ocSector;
        this.ocMotivo = data.ocMotivo ? data.ocMotivo : this.ocMotivo;
        this.ocNumero = data.ocNumero ? data.ocNumero : this.ocNumero;
    }
}