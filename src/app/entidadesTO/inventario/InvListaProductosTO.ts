export class InvListaProductosTO {

    id: number = 0;
    proCodigoPrincipal: string = "";
    proCodigoBarra: string = "";
    proCodigoBarra2: string = "";
    proCodigoBarra3: string = "";
    proCodigoBarra4: string = "";
    proCodigoBarra5: string = "";
    proNombre: string = "";
    proCategoria: string = "";
    proEmpaque: string = "";
    stockSaldo: number = 0;
    stockUltimoCosto: number = 0;
    stockCostoPromedio: number = 0;
    detalleMedida: string = "";
    stockPrecio1: number = 0;
    stockPrecio2: number = 0;
    stockPrecio3: number = 0;
    stockPrecio4: number = 0;
    stockPrecio5: number = 0;
    stockPrecioCaja: number = 0;
    proGravaIva: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.proCodigoPrincipal = data.proCodigoPrincipal ? data.proCodigoPrincipal : this.proCodigoPrincipal;
        this.proCodigoBarra = data.proCodigoBarra ? data.proCodigoBarra : this.proCodigoBarra;
        this.proCodigoBarra2 = data.proCodigoBarra2 ? data.proCodigoBarra2 : this.proCodigoBarra2;
        this.proCodigoBarra3 = data.proCodigoBarra3 ? data.proCodigoBarra3 : this.proCodigoBarra3;
        this.proCodigoBarra4 = data.proCodigoBarra4 ? data.proCodigoBarra4 : this.proCodigoBarra4;
        this.proCodigoBarra5 = data.proCodigoBarra5 ? data.proCodigoBarra5 : this.proCodigoBarra5;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.proCategoria = data.proCategoria ? data.proCategoria : this.proCategoria;
        this.proEmpaque = data.proEmpaque ? data.proEmpaque : this.proEmpaque;
        this.stockSaldo = data.stockSaldo ? data.stockSaldo : this.stockSaldo;
        this.stockUltimoCosto = data.stockUltimoCosto ? data.stockUltimoCosto : this.stockUltimoCosto;
        this.stockCostoPromedio = data.stockCostoPromedio ? data.stockCostoPromedio : this.stockCostoPromedio;
        this.detalleMedida = data.detalleMedida ? data.detalleMedida : this.detalleMedida;
        this.stockPrecio1 = data.stockPrecio1 ? data.stockPrecio1 : this.stockPrecio1;
        this.stockPrecio2 = data.stockPrecio2 ? data.stockPrecio2 : this.stockPrecio2;
        this.stockPrecio3 = data.stockPrecio3 ? data.stockPrecio3 : this.stockPrecio3;
        this.stockPrecio4 = data.stockPrecio4 ? data.stockPrecio4 : this.stockPrecio4;
        this.stockPrecio5 = data.stockPrecio5 ? data.stockPrecio5 : this.stockPrecio5;
        this.stockPrecioCaja = data.stockPrecioCaja ? data.stockPrecioCaja : this.stockPrecioCaja;
        this.proGravaIva = data.proGravaIva ? data.proGravaIva : this.proGravaIva;
    }

}