export class InvFunVentasConsolidandoProductosCoberturaTO {
    id: number = null;
    vcpProducto: string = null;
    vcpCodigo: string = null;
    vcpMedida: string = null;
    vcpCantidad: number = null;
    vcpTotal: number = null;
    vcpPorcentaje: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vcpProducto = data.vcpProducto ? data.vcpProducto : this.vcpProducto;
        this.vcpCodigo = data.vcpCodigo ? data.vcpCodigo : this.vcpCodigo;
        this.vcpMedida = data.vcpMedida ? data.vcpMedida : this.vcpMedida;
        this.vcpCantidad = data.vcpCantidad ? data.vcpCantidad : this.vcpCantidad;
        this.vcpTotal = data.vcpTotal ? data.vcpTotal : this.vcpTotal;
        this.vcpPorcentaje = data.vcpPorcentaje ? data.vcpPorcentaje : this.vcpPorcentaje;
    }

}