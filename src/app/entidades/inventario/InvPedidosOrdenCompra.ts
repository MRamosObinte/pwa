import { InvPedidosOrdenCompraMotivo } from "./InvPedidosOrdenCompraMotivo";
import { InvPedidosOrdenCompraPK } from "./InvPedidosOrdenCompraPK";
import { InvProveedor } from "./InvProveedor";
import { InvPedidosOrdenCompraDetalle } from "./InvPedidosOrdenCompraDetalle";
import { InvCliente } from "./InvCliente";

export class InvPedidosOrdenCompra {

    invPedidosOrdenCompraPK: InvPedidosOrdenCompraPK = new InvPedidosOrdenCompraPK();
    ocCodigoTransaccional: string = "";
    ocFechaEmision: any = null;
    ocFormaPago: string = "";
    ocObservacionesRegistra: string = "";
    ocAnulado: boolean = false;
    ocMontoTotal: number = 0;
    usrCodigo: string = "";
    usrAprueba: string = "";
    ocLugarEntrega: string = "";
    ocContactoNombre: string = "";
    ocContactoTelefono: string = "";
    usrFechaInserta: Date = null;
    ocFechaHoraEntrega: any = null;
    invProveedor: InvProveedor = new InvProveedor();
    invPedidosOrdenCompraMotivo: InvPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
    invPedidosOrdenCompraDetalleList: Array<InvPedidosOrdenCompraDetalle> = new Array();
    ocValorRetencion: number = 1;
    ocAprobada: boolean = false;
    invCliente: InvCliente = new InvCliente();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invPedidosOrdenCompraPK = data.invPedidosOrdenCompraPK ? data.invPedidosOrdenCompraPK : this.invPedidosOrdenCompraPK;
        this.ocCodigoTransaccional = data.ocCodigoTransaccional ? data.ocCodigoTransaccional : this.ocCodigoTransaccional;
        this.ocFechaEmision = data.ocFechaEmision ? data.ocFechaEmision : this.ocFechaEmision;
        this.ocFormaPago = data.ocFormaPago ? data.ocFormaPago : this.ocFormaPago;
        this.ocObservacionesRegistra = data.ocObservacionesRegistra ? data.ocObservacionesRegistra : this.ocObservacionesRegistra;
        this.ocAnulado = data.ocAnulado ? data.ocAnulado : this.ocAnulado;
        this.ocMontoTotal = data.ocMontoTotal ? data.ocMontoTotal : this.ocMontoTotal;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrAprueba = data.usrAprueba ? data.usrAprueba : this.usrAprueba;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invProveedor = data.invProveedor ? data.invProveedor : this.invProveedor;
        this.invPedidosOrdenCompraMotivo = data.invPedidosOrdenCompraMotivo ? data.invPedidosOrdenCompraMotivo : this.invPedidosOrdenCompraMotivo;
        this.invPedidosOrdenCompraDetalleList = data.invPedidosOrdenCompraDetalleList ? data.invPedidosOrdenCompraDetalleList : this.invPedidosOrdenCompraDetalleList;
        this.ocValorRetencion = data.ocValorRetencion ? data.ocValorRetencion : this.ocValorRetencion;
        this.ocAprobada = data.ocAprobada ? data.ocAprobada : this.ocAprobada;
        this.ocLugarEntrega = data.ocLugarEntrega ? data.ocLugarEntrega : this.ocLugarEntrega;
        this.ocContactoNombre = data.ocContactoNombre ? data.ocContactoNombre : this.ocContactoNombre;
        this.ocContactoTelefono = data.ocContactoTelefono ? data.ocContactoTelefono : this.ocContactoTelefono;
        this.ocFechaHoraEntrega = data.ocFechaHoraEntrega ? data.ocFechaHoraEntrega : this.ocFechaHoraEntrega;
        this.invCliente = data.invCliente ? data.invCliente : this.invCliente;
    }
}