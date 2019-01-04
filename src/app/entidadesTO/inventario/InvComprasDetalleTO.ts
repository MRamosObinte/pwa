import { PrdListaPiscinaTO } from './../Produccion/PrdListaPiscinaTO';
export class InvComprasDetalleTO {
    detSecuencia: number = null;
    detOrden: number = null;
    detPendiente: boolean = true;
    detConfirmado: boolean = false;
    detCantidad: number = 0;
    detPrecio: number = 0;
    detPorcentajeDescuento: number = 0;
    detOtrosImpuestos: number = 0;
    detValorPromedio: number = 0;
    detValorUltimaCompra: number = 0;
    detSaldo: number = 0;
    bodEmpresa: string = "";
    bodCodigo: string = "";
    proEmpresa: string = null;
    proCodigoPrincipal: string = null;
    secEmpresa: string = null;
    secCodigo: string = null;
    pisEmpresa: string = null;
    pisSector: string = null;
    pisNumero: string = null;
    comEmpresa: string = null;
    comPeriodo: string = null;
    comMotivo: string = null;
    comNumero: string = null;
    proEstadoIva: string = null;
    proTipo: string = null;
    detIce: number = 0;
    detPrecio1: number = 0;
    detPrecio2: number = 0;
    detPrecio3: number = 0;
    detPrecio4: number = 0;
    detPrecio5: number = 0;

    parcialProducto: number = 0;//temporal
    medidaDetalle: string = null;//temporal
    nombreProducto: string = null;//temporal
    proCodigoPrincipalCopia: string = null;//temporal
    bodCodigoCopia: string = null;//temporal
    listadoPiscinaTO: Array<PrdListaPiscinaTO> = [];//Temporal

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencia = data.detSecuencia ? data.detSecuencia : this.detSecuencia;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detPendiente = data.detPendiente ? data.detPendiente : this.detPendiente;
        this.detConfirmado = data.detConfirmado ? data.detConfirmado : this.detConfirmado;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;


        this.detPrecio3 = data.detPrecio3 ? data.detPrecio3 : this.detPrecio3;
        this.detPrecio4 = data.detPrecio4 ? data.detPrecio4 : this.detPrecio4;
        this.detPrecio5 = data.detPrecio5 ? data.detPrecio5 : this.detPrecio5;
    }
}