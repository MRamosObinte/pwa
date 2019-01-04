export class BanChequeTO {
    chqSecuencia: number = 0;
    chqBeneficiario: string = "";
    chqCantidad: string = "";
    chqCiudad: string = "";
    chqFecha: string = "";
    chqCruzado: boolean = false;
    chqImpreso: boolean = false;
    chqImpresoFecha: string = "";
    chqRevisado: boolean = false;
    chqRevisadoFecha: string = "";
    chqRevisadoObservacion: string = "";
    chqEntregado: boolean = false;
    chqEntregadoFecha: string = "";
    chqEntregadoObservacion: string = "";
    chqReversado: boolean = false;
    chqReversadoFecha: string = "";
    chqReversadoObservacion: string = "";
    chqAnulado: boolean = false;
    chqAnuladooFecha: string = "";
    chqAnuladoObservacion: string = "";
    chqNoCheque: boolean = false;
    concEmpresa: string = "";
    concCuentaContable: string = "";
    concCodigo: string = "";
    concCategoria: string = "";
    detSecuencia: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.chqSecuencia = data.chqSecuencia ? data.chqSecuencia : this.chqSecuencia;
        this.chqBeneficiario = data.chqBeneficiario ? data.chqBeneficiario : this.chqBeneficiario;
        this.chqCantidad = data.chqCantidad ? data.chqCantidad : this.chqCantidad;
        this.chqCiudad = data.chqCiudad ? data.chqCiudad : this.chqCiudad;
        this.chqFecha = data.chqFecha ? data.chqFecha : this.chqFecha;
        this.chqCruzado = data.chqCruzado ? data.chqCruzado : this.chqCruzado;
        this.chqImpreso = data.chqImpreso ? data.chqImpreso : this.chqImpreso;
        this.chqImpresoFecha = data.chqImpresoFecha ? data.chqImpresoFecha : this.chqImpresoFecha;
        this.chqRevisado = data.chqRevisado ? data.chqRevisado : this.chqRevisado;
        this.chqRevisadoFecha = data.chqRevisadoFecha ? data.chqRevisadoFecha : this.chqRevisadoFecha;
        this.chqRevisadoObservacion = data.chqRevisadoObservacion ? data.chqRevisadoObservacion : this.chqRevisadoObservacion;
        this.chqEntregado = data.chqEntregado ? data.chqEntregado : this.chqEntregado;
        this.chqEntregadoFecha = data.chqEntregadoFecha ? data.chqEntregadoFecha : this.chqEntregadoFecha;
        this.chqEntregadoObservacion = data.chqEntregadoObservacion ? data.chqEntregadoObservacion : this.chqEntregadoObservacion;
        this.chqReversado = data.chqReversado ? data.chqReversado : this.chqReversado;
        this.chqReversadoFecha = data.chqReversadoFecha ? data.chqReversadoFecha : this.chqReversadoFecha;
        this.chqReversadoObservacion = data.chqReversadoObservacion ? data.chqReversadoObservacion : this.chqReversadoObservacion;
        this.chqAnulado = data.chqAnulado ? data.chqAnulado : this.chqAnulado;
        this.chqAnuladooFecha = data.chqAnuladooFecha ? data.chqAnuladooFecha : this.chqAnuladooFecha;
        this.chqAnuladoObservacion = data.chqAnuladoObservacion ? data.chqAnuladoObservacion : this.chqAnuladoObservacion;
        this.chqNoCheque = data.chqNoCheque ? data.chqNoCheque : this.chqNoCheque;
        this.concEmpresa = data.concEmpresa ? data.concEmpresa : this.concEmpresa;
        this.concCuentaContable = data.concCuentaContable ? data.concCuentaContable : this.concCuentaContable;
        this.concCodigo = data.concCodigo ? data.concCodigo : this.concCodigo;
        this.concCategoria = data.concCategoria ? data.concCategoria : this.concCategoria;
        this.detSecuencia = data.detSecuencia ? data.detSecuencia : this.detSecuencia;
    }
}