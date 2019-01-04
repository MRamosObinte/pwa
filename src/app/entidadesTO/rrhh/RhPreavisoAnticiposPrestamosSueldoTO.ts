export class RhPreavisoAnticiposPrestamosSueldoTO {
    preTipoRegistro: string = "";//
    preSecuencial: string = "";//
    preBeneficiarioCodigo: string = "";
    preBeneficiarioTipoId: string = "";//
    preBeneficiarioNumeroId: string = "";//
    preBeneficiarioNombre: string = "";//
    preFormaPago: string = "";
    preCodigoPais: string = "";
    preCodigoBanco: string = "";
    preCuentaTipo: string = "";//
    preCuentaNumero: string = "";//
    preCodigoMoneda: string = "";//
    preTotalPagado: string = "";//
    preConcepto: string = "";
    preCodigoBancario: string = "";
    preCodigoServicio: string = "";
    preMotivoPago: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.preTipoRegistro = data.preTipoRegistro ? data.preTipoRegistro : this.preTipoRegistro;
        this.preSecuencial = data.preSecuencial ? data.preSecuencial : this.preSecuencial;
        this.preBeneficiarioCodigo = data.preBeneficiarioCodigo ? data.preBeneficiarioCodigo : this.preBeneficiarioCodigo;
        this.preBeneficiarioTipoId = data.preBeneficiarioTipoId ? data.preBeneficiarioTipoId : this.preBeneficiarioTipoId;
        this.preBeneficiarioNumeroId = data.preBeneficiarioNumeroId ? data.preBeneficiarioNumeroId : this.preBeneficiarioNumeroId;
        this.preBeneficiarioNombre = data.preBeneficiarioNombre ? data.preBeneficiarioNombre : this.preBeneficiarioNombre;
        this.preFormaPago = data.preFormaPago ? data.preFormaPago : this.preFormaPago;
        this.preCodigoPais = data.preCodigoPais ? data.preCodigoPais : this.preCodigoPais;
        this.preCodigoBanco = data.preCodigoBanco ? data.preCodigoBanco : this.preCodigoBanco;
        this.preCuentaTipo = data.preCuentaTipo ? data.preCuentaTipo : this.preCuentaTipo;
        this.preCuentaNumero = data.preCuentaNumero ? data.preCuentaNumero : this.preCuentaNumero;
        this.preCodigoMoneda = data.preCodigoMoneda ? data.preCodigoMoneda : this.preCodigoMoneda;
        this.preTotalPagado = data.preTotalPagado ? data.preTotalPagado : this.preTotalPagado;
        this.preConcepto = data.preConcepto ? data.preConcepto : this.preConcepto;
        this.preCodigoBancario = data.preCodigoBancario ? data.preCodigoBancario : this.preCodigoBancario;
        this.preCodigoServicio = data.preCodigoServicio ? data.preCodigoServicio : this.preCodigoServicio;
        this.preMotivoPago = data.preMotivoPago ? data.preMotivoPago : this.preMotivoPago;
    }
}