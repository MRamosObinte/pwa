import { InvBodegaPK } from "./InvBodegaPK";
import { InvVentasDetalle } from "./InvVentasDetalle";
import { InvTransferencias } from "./InvTransferencias";
import { InvTransferenciasDetalle } from "./InvTransferenciasDetalle";
import { InvProductoSaldos } from "./InvProductoSaldos";
import { InvCompras } from "./InvCompras";
import { InvComprasDetalle } from "./InvComprasDetalle";
import { InvVentas } from "./InvVentas";
import { InvConsumos } from "./InvConsumos";
import { InvConsumosDetalle } from "./InvConsumosDetalle";

export class InvBodega {
    invBodegaPK: InvBodegaPK = new InvBodegaPK();
    bodNombre: string = "";
    bodInactiva: boolean = false;
    secEmpresa: string = "";
    secCodigo: string = "";
    detEmpresa: string = "";
    detUsuario: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    bodProductoPermitido: string = "";
    bodProductoNoPermitido: string = "";
    invConsumosList: InvConsumos[] = [];
    invVentasDetalleList: InvVentasDetalle[] = [];
    invConsumosDetalleList: InvConsumosDetalle[] = [];
    invTransferenciasList: InvTransferencias[] = [];
    invTransferenciasList1: InvTransferencias[] = [];
    invTransferenciasDetalleList: InvTransferenciasDetalle[] = [];
    invTransferenciasDetalleList1: InvTransferenciasDetalle[] = [];
    invProductoSaldosList: InvProductoSaldos[] = [];
    invComprasList: InvCompras[] = [];
    invComprasDetalleList: InvComprasDetalle[] = [];
    invVentasList: InvVentas[] = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invBodegaPK = data.invBodegaPK ? data.invBodegaPK : this.invBodegaPK;
        this.bodNombre = data.bodNombre ? data.bodNombre : this.bodNombre;
        this.bodInactiva = data.bodInactiva ? data.bodInactiva : this.bodInactiva;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.detEmpresa = data.detEmpresa ? data.detEmpresa : this.detEmpresa;
        this.detUsuario = data.detUsuario ? data.detUsuario : this.detUsuario;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.bodProductoPermitido = data.bodProductoPermitido ? data.bodProductoPermitido : this.bodProductoPermitido;
        this.bodProductoNoPermitido = data.bodProductoNoPermitido ? data.bodProductoNoPermitido : this.bodProductoNoPermitido;
        this.invConsumosList = data.invConsumosList ? data.invConsumosList : this.invConsumosList;
        this.invVentasDetalleList = data.invVentasDetalleList ? data.invVentasDetalleList : this.invVentasDetalleList;
        this.invConsumosDetalleList = data.invConsumosDetalleList ? data.invConsumosDetalleList : this.invConsumosDetalleList;
        this.invTransferenciasList = data.invTransferenciasList ? data.invTransferenciasList : this.invTransferenciasList;
        this.invTransferenciasList1 = data.invTransferenciasList ? data.invTransferenciasList : this.invTransferenciasList;
        this.invTransferenciasDetalleList = data.invTransferenciasDetalleList ? data.invTransferenciasDetalleList : this.invTransferenciasDetalleList;
        this.invTransferenciasDetalleList1 = data.invTransferenciasDetalleList1 ? data.invTransferenciasDetalleList1 : this.invTransferenciasDetalleList1;
        this.invProductoSaldosList = data.invProductoSaldosList ? data.invProductoSaldosList : this.invProductoSaldosList;
        this.invComprasList = data.invComprasList ? data.invComprasList : this.invComprasList;
        this.invComprasDetalleList = data.invComprasDetalleList ? data.invComprasDetalleList : this.invComprasDetalleList;
        this.invVentasList = data.invVentasList ? data.invVentasList : this.invVentasList;
    }

}