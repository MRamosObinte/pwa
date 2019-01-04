export class InvFunListadoProductosTO {
    id: number = 0;
    prdCodigoPrincipal: string = "";
    prdCodigoAlterno: string = "";
    prdCodigoBarra: string = "";
    prdNombre: string = "";
    prdDetalle: string = "";
    prdMedida: string = "";
    prdMarca: string = "";
    prdCategoria: string = "";
    prdPrecio1: number = 0;
    prdPrecio2: number = 0;
    prdPrecio3: number = 0;
    prdPrecio4: number = 0;
    prdPrecio5: number = 0;
    prdMinimo: number = 0;
    prdMaximo: number = 0;
    prdTipo: string = "";
    prdCuentaInventario: string = "";
    prdNombreInventario: string = "";
    prdCuentaGasto: string = "";
    prdNombreGasto: string = "";
    prdCuentaVenta: string = "";
    prdNombreVenta: string = "";
    prdIva: string = "";
    prdCreditoTributario: boolean = false;
    prdStockNegativo: boolean = false;
    prdInactivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.prdCodigoPrincipal = data.prdCodigoPrincipal ? data.prdCodigoPrincipal : this.prdCodigoPrincipal;
        this.prdCodigoAlterno = data.prdCodigoAlterno ? data.prdCodigoAlterno : this.prdCodigoAlterno;
        this.prdCodigoBarra = data.prdCodigoBarra ? data.prdCodigoBarra : this.prdCodigoBarra;
        this.prdNombre = data.prdNombre ? data.prdNombre : this.prdNombre;
        this.prdDetalle = data.prdDetalle ? data.prdDetalle : this.prdDetalle;
        this.prdMedida = data.prdMedida ? data.prdMedida : this.prdMedida;
        this.prdMarca = data.prdMarca ? data.prdMarca : this.prdMarca;
        this.prdCategoria = data.prdCategoria ? data.prdCategoria : this.prdCategoria;
        this.prdPrecio1 = data.prdPrecio1 ? data.prdPrecio1 : this.prdPrecio1;
        this.prdPrecio2 = data.prdPrecio2 ? data.prdPrecio2 : this.prdPrecio2;
        this.prdPrecio3 = data.prdPrecio3 ? data.prdPrecio3 : this.prdPrecio3;
        this.prdPrecio4 = data.prdPrecio4 ? data.prdPrecio4 : this.prdPrecio4;
        this.prdPrecio5 = data.prdPrecio5 ? data.prdPrecio5 : this.prdPrecio5;
        this.prdMinimo = data.prdMinimo ? data.prdMinimo : this.prdMinimo;
        this.prdMaximo = data.prdMaximo ? data.prdMaximo : this.prdMaximo;
        this.prdTipo = data.prdTipo ? data.prdTipo : this.prdTipo;
        this.prdCuentaInventario = data.prdCuentaInventario ? data.prdCuentaInventario : this.prdCuentaInventario;
        this.prdNombreInventario = data.prdNombreInventario ? data.prdNombreInventario : this.prdNombreInventario;
        this.prdCuentaGasto = data.prdCuentaGasto ? data.prdCuentaGasto : this.prdCuentaGasto;
        this.prdNombreGasto = data.prdNombreGasto ? data.prdNombreGasto : this.prdNombreGasto;
        this.prdCuentaVenta = data.prdCuentaVenta ? data.prdCuentaVenta : this.prdCuentaVenta;
        this.prdNombreVenta = data.prdNombreVenta ? data.prdNombreVenta : this.prdNombreVenta;
        this.prdIva = data.prdIva ? data.prdIva : this.prdIva;
        this.prdCreditoTributario = data.prdCreditoTributario ? data.prdCreditoTributario : this.prdCreditoTributario;
        this.prdStockNegativo = data.prdStockNegativo ? data.prdStockNegativo : this.prdStockNegativo;
        this.prdInactivo = data.prdInactivo ? data.prdInactivo : this.prdInactivo;
    }

}