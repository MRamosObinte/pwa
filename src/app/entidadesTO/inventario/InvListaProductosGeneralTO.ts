export class InvListaProductosGeneralTO {

    id: number = 0;
    proCodigoPrincipal: string = "";
    proNombre: string = "";
    proCategoria: string = "";
    proEmpaque: string = "";
    stockSaldo: number = 0;
    stockUltimoCosto: number = 0;
    stockCostoPromedio: number = 0;
    detalleMedida: string = "";
    proPrecio: number = 0;
    proCantidad: number = 0;
    proDescuento: number = 0;
    proMargenUtilidad: number = 0;
    proGravaIva: string = "";
    tipTipo: string = "";
    proInactivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.proCodigoPrincipal = data.proCodigoPrincipal ? data.proCodigoPrincipal : this.proCodigoPrincipal;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.proCategoria = data.proCategoria ? data.proCategoria : this.proCategoria;
        this.proEmpaque = data.proEmpaque ? data.proEmpaque : this.proEmpaque;
        this.stockSaldo = data.stockSaldo ? data.stockSaldo : this.stockSaldo;
        this.stockUltimoCosto = data.stockUltimoCosto ? data.stockUltimoCosto : this.stockUltimoCosto;
        this.stockCostoPromedio = data.stockCostoPromedio ? data.stockCostoPromedio : this.stockCostoPromedio;
        this.detalleMedida = data.detalleMedida ? data.detalleMedida : this.detalleMedida;
        this.proPrecio = data.proPrecio ? data.proPrecio : this.proPrecio;
        this.proCantidad = data.proCantidad ? data.proCantidad : this.proCantidad;
        this.proDescuento = data.proDescuento ? data.proDescuento : this.proDescuento;
        this.proMargenUtilidad = data.proMargenUtilidad ? data.proMargenUtilidad : this.proMargenUtilidad;
        this.proGravaIva = data.proGravaIva ? data.proGravaIva : this.proGravaIva;
        this.tipTipo = data.tipTipo ? data.tipTipo : this.tipTipo;
        this.proInactivo = data.proInactivo ? data.proInactivo : this.proInactivo;
    }

}