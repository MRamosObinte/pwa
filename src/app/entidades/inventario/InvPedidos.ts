import { InvPedidosPK } from "./InvPedidosPK";
import { InvPedidosDetalle } from "./InvPedidosDetalle";
import { InvPedidosMotivo } from "./InvPedidosMotivo";
import { InvCliente } from "./InvCliente";

export class InvPedidos {

    pedCodigoTransaccional: string = "";
    invPedidosPK: InvPedidosPK = new InvPedidosPK();
    invCliente: InvCliente = new InvCliente();
    pedLugarEntrega: string = null;
    pedFechaHoraEntrega: any = null;
    pedContactoNombre: string = null;
    pedContactoTelefono: string = null;
    pedFechaEmision: any = null;
    pedFechaVencimiento: any = null;
    pedObservacionesRegistra: string = "";
    pedObservacionesAprueba: string = "";
    pedObservacionesEjecuta: string = "";
    pedOrdenCompra: string = "";
    pedFormaCobro: string = "";
    pedPendiente: boolean = false;
    pedAprobado: boolean = false;
    pedEjecutado: boolean = false;
    pedAnulado: boolean = false;
    pedMontoTotal: number = 0;
    usrRegistra: string = null;
    usrAprueba: string = null;
    usrEjecuta: string = null;
    usrFechaInserta: Date = null;
    invPedidosDetalleList: Array<InvPedidosDetalle> = [];
    invPedidosMotivo: InvPedidosMotivo = new InvPedidosMotivo();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pedCodigoTransaccional = data.pedCodigoTransaccional ? data.pedCodigoTransaccional : this.pedCodigoTransaccional;
        this.pedObservacionesRegistra = data.pedObservacionesRegistra ? data.pedObservacionesRegistra : this.pedObservacionesRegistra;
        this.pedObservacionesAprueba = data.pedObservacionesAprueba ? data.pedObservacionesAprueba : this.pedObservacionesAprueba;
        this.pedObservacionesEjecuta = data.pedObservacionesEjecuta ? data.pedObservacionesEjecuta : this.pedObservacionesEjecuta;
        this.pedOrdenCompra = data.pedOrdenCompra ? data.pedOrdenCompra : this.pedOrdenCompra;
        this.pedFormaCobro = data.pedFormaCobro ? data.pedFormaCobro : this.pedFormaCobro;
        this.invPedidosPK = data.invPedidosPK ? data.invPedidosPK : this.invPedidosPK;
        this.pedFechaEmision = data.pedFechaEmision ? data.pedFechaEmision : this.pedFechaEmision;
        this.pedFechaVencimiento = data.pedFechaVencimiento ? data.pedFechaVencimiento : this.pedFechaVencimiento;
        this.pedPendiente = data.pedPendiente ? data.pedPendiente : this.pedPendiente;
        this.pedAprobado = data.pedAprobado ? data.pedAprobado : this.pedAprobado;
        this.pedEjecutado = data.pedEjecutado ? data.pedEjecutado : this.pedEjecutado;
        this.pedAnulado = data.pedAnulado ? data.pedAnulado : this.pedAnulado;
        this.pedMontoTotal = data.pedMontoTotal ? data.pedMontoTotal : this.pedMontoTotal;
        this.usrRegistra = data.usrRegistra ? data.usrRegistra : this.usrRegistra;
        this.usrAprueba = data.usrAprueba ? data.usrAprueba : this.usrAprueba;
        this.usrEjecuta = data.usrEjecuta ? data.usrEjecuta : this.usrEjecuta;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invPedidosDetalleList = data.invPedidosDetalleList ? data.invPedidosDetalleList : this.invPedidosDetalleList;
        this.invPedidosMotivo = data.invPedidosMotivo ? data.invPedidosMotivo : this.invPedidosMotivo;
        this.invCliente = data.invCliente ? data.invCliente : this.invCliente;
        this.pedLugarEntrega = data.pedLugarEntrega ? data.pedLugarEntrega : this.pedLugarEntrega;
        this.pedFechaHoraEntrega = data.pedFechaHoraEntrega ? data.pedFechaHoraEntrega : this.pedFechaHoraEntrega;
        this.pedContactoNombre = data.pedContactoNombre ? data.pedContactoNombre : this.pedContactoNombre;
        this.pedContactoTelefono = data.pedContactoTelefono ? data.pedContactoTelefono : this.pedContactoTelefono;
    }
}