export class BanChequePreavisadoTO {
    id: number = 0;
    chqSecuencial: string = "";
    chqTipoRegistro: string = "";
    chqBeneficiarioCodigo: string = "";
    chqBeneficiarioTipoId: string = "";
    chqBeneficiarioNumeroId: string = "";
    chqBeneficiarioNombre: string = "";
    chqFormaPago: string = "";
    chqCodigoPais: string = "";
    chqCodigoBanco: string = "";
    chqCuentaTipo: string = "";
    chqCuentaNumero: string = "";
    chqChequeNumero: string = "";
    chqChequeMoneda: string = "";
    chqChequeValor: string = "";
    chqReferencia: string = "";
    chqCodigoServicio: string = "";
    chqChequeTipo: string = "";
    chqCodigoEmpresa: string = "";
    chqFechaRevision: string = "";


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.chqSecuencial = data.chqSecuencial ? data.chqSecuencial : this.chqSecuencial;
        this.chqTipoRegistro = data.chqTipoRegistro ? data.chqTipoRegistro : this.chqTipoRegistro;
        this.chqBeneficiarioCodigo = data.chqBeneficiarioCodigo ? data.chqBeneficiarioCodigo : this.chqBeneficiarioCodigo;
        this.chqBeneficiarioTipoId = data.chqBeneficiarioTipoId ? data.chqBeneficiarioTipoId : this.chqBeneficiarioTipoId;
        this.chqBeneficiarioNumeroId = data.chqBeneficiarioNumeroId ? data.chqBeneficiarioNumeroId : this.chqBeneficiarioNumeroId;
        this.chqBeneficiarioNombre = data.chqBeneficiarioNombre ? data.chqBeneficiarioNombre : this.chqBeneficiarioNombre;
        this.chqFormaPago = data.chqFormaPago ? data.chqFormaPago : this.chqFormaPago;
        this.chqCodigoPais = data.chqCodigoPais ? data.chqCodigoPais : this.chqCodigoPais;
        this.chqCodigoBanco = data.chqCodigoBanco ? data.chqCodigoBanco : this.chqCodigoBanco;
        this.chqCuentaTipo = data.chqCuentaTipo ? data.chqCuentaTipo : this.chqCuentaTipo;
        this.chqCuentaNumero = data.chqCuentaNumero ? data.chqCuentaNumero : this.chqCuentaNumero;
        this.chqChequeNumero = data.chqChequeNumero ? data.chqChequeNumero : this.chqChequeNumero;
        this.chqChequeMoneda = data.chqChequeMoneda ? data.chqChequeMoneda : this.chqChequeMoneda;
        this.chqChequeValor = data.chqChequeValor ? data.chqChequeValor : this.chqChequeValor;
        this.chqReferencia = data.chqReferencia ? data.chqReferencia : this.chqReferencia;
        this.chqCodigoServicio = data.chqCodigoServicio ? data.chqCodigoServicio : this.chqCodigoServicio;
        this.chqChequeTipo = data.chqChequeTipo ? data.chqChequeTipo : this.chqChequeTipo;
        this.chqCodigoEmpresa = data.chqCodigoEmpresa ? data.chqCodigoEmpresa : this.chqCodigoEmpresa;
        this.chqFechaRevision = data.chqFechaRevision ? data.chqFechaRevision : this.chqFechaRevision;
    }
    
}