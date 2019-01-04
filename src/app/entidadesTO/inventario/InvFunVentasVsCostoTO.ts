export class InvFunVentasVsCostoTO {
    public id: number = null;
    public vcProducto: string = null;
    public vcCodigo: string = null;
    public vcMedida: string = null;
    public vcCantidad: number = null;
    public vcTotalVentas: number = null;
    public vcTotalCosto: number = null;
    public vcPorcentaje: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vcProducto = data.vcProducto ? data.vcProducto : this.vcProducto;
        this.vcCodigo = data.vcCodigo ? data.bodResponsable : this.vcCodigo;
        this.vcMedida = data.vcMedida ? data.vcMedida : this.vcMedida;
        this.vcCantidad = data.vcCantidad ? data.vcCantidad : this.vcCantidad;
        this.vcTotalVentas = data.vcTotalVentas ? data.vcTotalVentas : this.vcTotalVentas;
        this.vcTotalCosto = data.vcTotalCosto ? data.vcTotalCosto : this.vcTotalCosto;
        this.vcPorcentaje = data.vcPorcentaje ? data.vcPorcentaje : this.vcPorcentaje;
    }

}