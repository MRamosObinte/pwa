export class InvVentasDetalleTO {

    detSecuencia: number = 0;
    detOrden: number = 0;
    detPendiente: boolean = true;
    detCantidad: number = 0;
    detPrecio: number = 0;
    detPorcentajeRecargo: number = 0;
    detPorcentajeDescuento: number = 0;
    detValorPromedio: number = 0;//enviar vacìo
    detValorUltimaCompra: number = 0;
    detSaldo: number = 0;//saldo del producto
    bodEmpresa: string = "";
    bodCodigo: string = "";
    proEmpresa: string = "";
    proCodigoPrincipal: string = "";
    proNombre: string = "";
    proCreditoTributario: boolean = true;
    secEmpresa: string = null;
    secCodigo: string = null;
    pisEmpresa: string = null;
    pisSector: string = null;
    pisNumero: string = null;
    vtaEmpresa: string = "";
    vtaPeriodo: string = "";
    vtaMotivo: string = "";
    vtaNumero: string = "";
    vtIva: boolean = true;
    vtCodigoPorcentaje: string = "";
    proMedida: string = "";
    proEstadoIva: string = "";
    proTipo: string = "";

    catPrecioFijo: boolean = false;//eliminar al final para insercion o actualizacion
    estadoProducto: boolean = false;
    estadoPrecio: boolean = false;
    proCodigoPrincipalCopia: string = "";
    conversion: number;
    total: number;
    parcial: number;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencia = data.detSecuencia ? data.detSecuencia : this.detSecuencia;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detPendiente = data.detPendiente ? data.detPendiente : this.detPendiente;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.detPrecio = data.detPrecio ? data.detPrecio : this.detPrecio;
        this.detPorcentajeRecargo = data.detPorcentajeRecargo ? data.detPorcentajeRecargo : this.detPorcentajeRecargo;
        this.detPorcentajeDescuento = data.detPorcentajeDescuento ? data.detPorcentajeDescuento : this.detPorcentajeDescuento;
        this.detValorPromedio = data.detValorPromedio ? data.detValorPromedio : this.detValorPromedio;
        this.detValorUltimaCompra = data.detValorUltimaCompra ? data.detValorUltimaCompra : this.detValorUltimaCompra;
        this.detSaldo = data.detSaldo ? data.detSaldo : this.detSaldo;
        this.bodEmpresa = data.bodEmpresa ? data.bodEmpresa : this.bodEmpresa;
        this.bodCodigo = data.bodCodigo ? data.bodCodigo : this.bodCodigo;
        this.proEmpresa = data.proEmpresa ? data.proEmpresa : this.proEmpresa;
        this.proCodigoPrincipal = data.proCodigoPrincipal ? data.proCodigoPrincipal : this.proCodigoPrincipal;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.proCreditoTributario = data.proCreditoTributario ? data.proCreditoTributario : this.proCreditoTributario;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.vtaEmpresa = data.vtaEmpresa ? data.vtaEmpresa : this.vtaEmpresa;
        this.vtaPeriodo = data.vtaPeriodo ? data.vtaPeriodo : this.vtaPeriodo;
        this.vtaMotivo = data.vtaMotivo ? data.vtaMotivo : this.vtaMotivo;
        this.vtaNumero = data.vtaNumero ? data.vtaNumero : this.vtaNumero;
        this.vtIva = data.vtIva ? data.vtIva : this.vtIva;
        this.vtCodigoPorcentaje = data.vtCodigoPorcentaje ? data.vtCodigoPorcentaje : this.vtCodigoPorcentaje;
        this.proMedida = data.proMedida ? data.proMedida : this.proMedida;
        this.proEstadoIva = data.proEstadoIva ? data.proEstadoIva : this.proEstadoIva;
        this.proTipo = data.proTipo ? data.proTipo : this.proTipo;
    }

}