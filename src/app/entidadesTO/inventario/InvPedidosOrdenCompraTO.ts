export class InvPedidosOrdenCompraTO {

    index: number = 0;
    ocEmpresa: string = "";
    ocSector: string = "";
    ocMotivo: string = "";
    ocNumero: string = "";
    ocFecha: Date = null;
    ocAnulado: boolean = false;
    ocAprobada: boolean = false;
    ocMontoTotal: number = 0;
    provRazonSocial: string = "";
    provCodigo: string = "";
    ocmDetalle: string = "";
    usrAprueba: string = "";
    provEmailOrdenCompra: string = "";
    ocmNotificarProveedor: boolean = false;
    ocPuedeAprobar: boolean = false;
    ocValorRetencion: number = 1;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.index = data.index ? data.index : this.index;
        this.ocEmpresa = data.ocEmpresa ? data.ocEmpresa : this.ocEmpresa;
        this.ocSector = data.ocSector ? data.ocSector : this.ocSector;
        this.ocMotivo = data.ocMotivo ? data.ocMotivo : this.ocMotivo;
        this.ocNumero = data.ocNumero ? data.ocNumero : this.ocNumero;
        this.ocFecha = data.ocFecha ? data.ocFecha : this.ocFecha;
        this.ocAnulado = data.ocAnulado ? data.ocAnulado : this.ocAnulado;
        this.ocAprobada = data.ocAprobada ? data.ocAprobada : this.ocAprobada;
        this.ocMontoTotal = data.ocMontoTotal ? data.ocMontoTotal : this.ocMontoTotal;
        this.ocValorRetencion = data.ocValorRetencion ? data.ocValorRetencion : this.ocValorRetencion;
        this.provRazonSocial = data.provRazonSocial ? data.provRazonSocial : this.provRazonSocial;
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.usrAprueba = data.usrAprueba ? data.usrAprueba : this.usrAprueba;
        this.ocmDetalle = data.ocmDetalle ? data.ocmDetalle : this.ocmDetalle;
        this.provEmailOrdenCompra = data.provEmailOrdenCompra ? data.provEmailOrdenCompra : this.provEmailOrdenCompra;
        this.ocmNotificarProveedor = data.ocmNotificarProveedor ? data.ocmNotificarProveedor : this.ocmNotificarProveedor;
        this.ocPuedeAprobar = data.ocPuedeAprobar ? data.ocPuedeAprobar : this.ocPuedeAprobar;
    }
}