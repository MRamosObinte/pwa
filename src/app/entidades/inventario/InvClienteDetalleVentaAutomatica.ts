import { InvCliente } from './InvCliente';
import { InvProducto } from './InvProducto';
export class InvClienteDetalleVentaAutomatica {

    detSecuencial: string = null;
    detCantidad: string = null;
    invCliente: InvCliente = new InvCliente();
    invProducto: InvProducto = new InvProducto();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.invCliente = data.invCliente ? data.invCliente : this.invCliente;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
    }
}