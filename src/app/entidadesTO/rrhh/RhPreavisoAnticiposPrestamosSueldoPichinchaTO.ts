export class RhPreavisoAnticiposPrestamosSueldoPichinchaTO {
    preTipoRegistro: string = "";
    preSecuencial: string = "";
    preCodigo: string = "";
    preMoneda: string = "";
    preTotalPagado: string = "";
    preCuenta: string = "";
    preCuentaTipo: string = "";
    preCuentaNumero: string = "";
    preReferencia: string = "";
    preBeneficiarioTipoId: string = "";
    preBeneficiarioNumeroId: string = "";
    preBeneficiarioNombre: string = "";
    preCodigoBanco: string = "";
    prePrefijoEmpresarial: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.preTipoRegistro = data.preTipoRegistro ? data.preTipoRegistro : this.preTipoRegistro;
        this.preSecuencial = data.preSecuencial ? data.preSecuencial : this.preSecuencial;
        this.preCodigo = data.preCodigo ? data.preCodigo : this.preCodigo;
        this.preMoneda = data.preMoneda ? data.preMoneda : this.preMoneda;
        this.preTotalPagado = data.preTotalPagado ? data.preTotalPagado : this.preTotalPagado;
        this.preCuenta = data.preCuenta ? data.preCuenta : this.preCuenta;
        this.preCuentaTipo = data.preCuentaTipo ? data.preCuentaTipo : this.preCuentaTipo;
        this.preCuentaNumero = data.preCuentaNumero ? data.preCuentaNumero : this.preCuentaNumero;
        this.preReferencia = data.preReferencia ? data.preReferencia : this.preReferencia;
        this.preBeneficiarioTipoId = data.preBeneficiarioTipoId ? data.preBeneficiarioTipoId : this.preBeneficiarioTipoId;
        this.preBeneficiarioNumeroId = data.preBeneficiarioNumeroId ? data.preBeneficiarioNumeroId : this.preBeneficiarioNumeroId;
        this.preBeneficiarioNombre = data.preBeneficiarioNombre ? data.preBeneficiarioNombre : this.preBeneficiarioNombre;
        this.preCodigoBanco = data.preCodigoBanco ? data.preCodigoBanco : this.preCodigoBanco;
        this.prePrefijoEmpresarial = data.prePrefijoEmpresarial ? data.prePrefijoEmpresarial : this.prePrefijoEmpresarial;
    }
}