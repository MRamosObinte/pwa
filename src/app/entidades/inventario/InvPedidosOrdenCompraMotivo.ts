import { InvPedidosOrdenCompraMotivoPK } from "./InvPedidosOrdenCompraMotivoPK";

export class InvPedidosOrdenCompraMotivo {

    invPedidosOrdenCompraMotivoPK: InvPedidosOrdenCompraMotivoPK = new InvPedidosOrdenCompraMotivoPK();
    ocmDetalle: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = null;
    ocmNotificarProveedor: boolean = true;
    ocmNotificarAprobador: boolean = true;
    ocmCostoFijo: boolean = false;
    ocmAprobacionAutomatica: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invPedidosOrdenCompraMotivoPK = data.invPedidosOrdenCompraMotivoPK ? data.invPedidosOrdenCompraMotivoPK : this.invPedidosOrdenCompraMotivoPK;
        this.ocmDetalle = data.ocmDetalle ? data.ocmDetalle : this.ocmDetalle;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.ocmNotificarProveedor = data.ocmNotificarProveedor == true || data.ocmNotificarProveedor == false ? data.ocmNotificarProveedor : this.ocmNotificarProveedor;
        this.ocmNotificarAprobador = data.ocmNotificarAprobador == true || data.ocmNotificarAprobador == false ? data.ocmNotificarAprobador : this.ocmNotificarAprobador;
        this.ocmCostoFijo = data.ocmCostoFijo ? data.ocmNotificarProveedor : this.ocmCostoFijo;
        this.ocmAprobacionAutomatica = data.ocmAprobacionAutomatica ? data.ocmAprobacionAutomatica : this.ocmAprobacionAutomatica;
    }

}