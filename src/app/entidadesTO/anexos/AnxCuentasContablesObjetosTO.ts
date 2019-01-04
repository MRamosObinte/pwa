import { ConCuentasTO } from "../contabilidad/ConCuentasTO";

export class AnxCuentasContablesObjetosTO {
    ctaSecuencial: string = null;
    ctaEmpresa: string = null;
    ctaIvaPagado: ConCuentasTO = new ConCuentasTO();
    ctaIvaCobrado: ConCuentasTO = new ConCuentasTO();
    ctaRetFteIvaPagado: ConCuentasTO = new ConCuentasTO();
    ctaRetFteIvaCobrado: ConCuentasTO = new ConCuentasTO();
    ctaRetFteIvaAsumido: ConCuentasTO = new ConCuentasTO();
    ctaRetFteIrPagado: ConCuentasTO = new ConCuentasTO();
    ctaRetFteIrCobrado: ConCuentasTO = new ConCuentasTO();
    ctaRetFteIrAsumido: ConCuentasTO = new ConCuentasTO();
    ctaOtrosImpuestos: ConCuentasTO = new ConCuentasTO();
    ctaCuentasPorCobrar: ConCuentasTO = new ConCuentasTO();
    ctaCuentasPorPagar: ConCuentasTO = new ConCuentasTO();
    ctaCuentasPorPagarActivoFijo: ConCuentasTO = new ConCuentasTO();
    ctaAnticiposDeClientes: ConCuentasTO = new ConCuentasTO();
    ctaAnticiposAProveedores: ConCuentasTO = new ConCuentasTO();
    ctaInventarioProductosProceso: ConCuentasTO = new ConCuentasTO();
    ctaCostoProductosProceso: ConCuentasTO = new ConCuentasTO();

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