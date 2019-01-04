export class InvPedidosOrdenCompraMotivoTO {

    ocmEmpresa: string = "";
    ocmSector: string = "";
    ocmCodigo: string = "";
    ocmDetalle: string = "";
    ocmNotificarProveedor: boolean = false;
    ocmNotificarAprobador: boolean = false;
    ocmCostoFijo: boolean = false;
    ocmAprobacionAutomatica: boolean = false;
    ocmInactivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ocmEmpresa = data.ocmEmpresa ? data.ocmEmpresa : this.ocmEmpresa;
        this.ocmSector = data.ocmSector ? data.ocmSector : this.ocmSector;
        this.ocmCodigo = data.ocmCodigo ? data.ocmCodigo : this.ocmCodigo;
        this.ocmDetalle = data.ocmDetalle ? data.ocmDetalle : this.ocmDetalle;
        this.ocmNotificarProveedor = data.ocmNotificarProveedor ? data.ocmNotificarProveedor : this.ocmNotificarProveedor;
        this.ocmNotificarAprobador = data.ocmNotificarAprobador ? data.ocmNotificarAprobador : this.ocmNotificarAprobador;
        this.ocmCostoFijo = data.ocmCostoFijo ? data.ocmCostoFijo : this.ocmCostoFijo;
        this.ocmAprobacionAutomatica = data.ocmAprobacionAutomatica ? data.ocmAprobacionAutomatica : this.ocmAprobacionAutomatica;
        this.ocmInactivo = data.ocmInactivo ? data.ocmInactivo : this.ocmInactivo;
    }
}