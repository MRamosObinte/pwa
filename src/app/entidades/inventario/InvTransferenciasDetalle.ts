import { InvTransferencias } from "./InvTransferencias";
import { InvProducto } from "./InvProducto";
import { InvBodega } from "./InvBodega";

export class InvTransferenciasDetalle {

    detSecuencial: Number = 0;
    detOrden: Number = 0;
    detPendiente: boolean = false;
    detConfirmado: boolean = false;
    detCantidad: Number = 0;
    detOrigenValorPromedio: Number = 0;
    detOrigenValorUltimaCompra: Number = 0;
    detOrigenSaldo: Number = 0;
    detDestinoValorPromedio: Number = 0;
    detDestinoValorUltimaCompra: Number = 0;
    detDestinoSaldo: Number = 0;
    secOrigenEmpresa: String = null;
    secOrigenCodigo: String = null;
    secDestinoEmpresa: String = null;
    secDestinoCodigo: String = null;
    invTransferencias: InvTransferencias = new InvTransferencias();
    invProducto: InvProducto = new InvProducto();
    invBodega: InvBodega = new InvBodega();
    invBodega1: InvBodega = new InvBodega();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detPendiente = data.detPendiente ? data.detPendiente : this.detPendiente;
        this.detConfirmado = data.detConfirmado ? data.detConfirmado : this.detConfirmado;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detOrigenValorPromedio = data.detOrigenValorPromedio ? data.detOrigenValorPromedio : this.detOrigenValorPromedio;
        this.detOrigenValorUltimaCompra = data.detOrigenValorUltimaCompra ? data.detOrigenValorUltimaCompra : this.detOrigenValorUltimaCompra;
        this.detOrigenSaldo = data.detOrigenSaldo ? data.detOrigenSaldo : this.detOrigenSaldo;
        this.detDestinoValorPromedio = data.detDestinoValorPromedio ? data.detDestinoValorPromedio : this.detDestinoValorPromedio;
        this.detDestinoValorUltimaCompra = data.detDestinoValorUltimaCompra ? data.detDestinoValorUltimaCompra : this.detDestinoValorUltimaCompra;
        this.detDestinoSaldo = data.detDestinoSaldo ? data.detDestinoSaldo : this.detDestinoSaldo;
        this.secOrigenEmpresa = data.secOrigenEmpresa ? data.secOrigenEmpresa : this.secOrigenEmpresa;
        this.secOrigenCodigo = data.secOrigenCodigo ? data.secOrigenCodigo : this.secOrigenCodigo;
        this.secDestinoEmpresa = data.secDestinoEmpresa ? data.secDestinoEmpresa : this.secDestinoEmpresa;
        this.secDestinoCodigo = data.secDestinoCodigo ? data.secDestinoCodigo : this.secDestinoCodigo;
        this.invTransferencias = data.invTransferencias ? data.invTransferencias : this.invTransferencias;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;
        this.invBodega1 = data.invBodega1 ? data.invBodega1 : this.invBodega1;
    }
}