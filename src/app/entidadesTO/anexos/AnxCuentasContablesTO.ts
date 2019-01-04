export class AnxCuentasContablesTO {
    ctaSecuencial: string = null;
    ctaEmpresa: string = null;
    ctaIvaPagado: string = "";
    ctaIvaCobrado: string = "";
    ctaRetFteIvaPagado: string = "";
    ctaRetFteIvaCobrado: string = "";
    ctaRetFteIvaAsumido: string = "";
    ctaRetFteIrPagado: string = "";
    ctaRetFteIrCobrado: string = "";
    ctaRetFteIrAsumido: string = "";
    ctaOtrosImpuestos: string = "";
    ctaCuentasPorCobrar: string = "";
    ctaCuentasPorPagar: string = "";
    ctaCuentasPorPagarActivoFijo: string = "";
    ctaAnticiposDeClientes: string = "";
    ctaAnticiposAProveedores: string = "";
    ctaInventarioProductosProceso: string = "";
    ctaCostoProductosProceso: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ctaSecuencial = data.ctaSecuencial ? data.ctaSecuencial : this.ctaSecuencial;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaIvaPagado = data.ctaIvaPagado ? data.ctaIvaPagado : this.ctaIvaPagado;
        this.ctaIvaCobrado = data.ctaIvaCobrado ? data.ctaIvaCobrado : this.ctaIvaCobrado;
        this.ctaRetFteIvaPagado = data.ctaRetFteIvaPagado ? data.ctaRetFteIvaPagado : this.ctaRetFteIvaPagado;
        this.ctaRetFteIvaCobrado = data.ctaRetFteIvaCobrado ? data.ctaRetFteIvaCobrado : this.ctaRetFteIvaCobrado;
        this.ctaRetFteIvaAsumido = data.ctaRetFteIvaAsumido ? data.ctaRetFteIvaAsumido : this.ctaRetFteIvaAsumido;
        this.ctaRetFteIrPagado = data.ctaRetFteIrPagado ? data.ctaRetFteIrPagado : this.ctaRetFteIrPagado;
        this.ctaRetFteIrCobrado = data.ctaRetFteIrCobrado ? data.ctaRetFteIrCobrado : this.ctaRetFteIrCobrado;
        this.ctaRetFteIrAsumido = data.ctaRetFteIrAsumido ? data.ctaRetFteIrAsumido : this.ctaRetFteIrAsumido;
        this.ctaOtrosImpuestos = data.ctaOtrosImpuestos ? data.ctaOtrosImpuestos : this.ctaOtrosImpuestos;
        this.ctaCuentasPorCobrar = data.ctaCuentasPorCobrar ? data.ctaCuentasPorCobrar : this.ctaCuentasPorCobrar;
        this.ctaCuentasPorPagar = data.ctaCuentasPorPagar ? data.ctaCuentasPorPagar : this.ctaCuentasPorPagar;
        this.ctaAnticiposDeClientes = data.ctaAnticiposDeClientes ? data.ctaAnticiposDeClientes : this.ctaAnticiposDeClientes;
        this.ctaAnticiposAProveedores = data.ctaAnticiposAProveedores ? data.ctaAnticiposAProveedores : this.ctaAnticiposAProveedores;
    }
}