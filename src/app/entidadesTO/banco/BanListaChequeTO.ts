export class BanListaChequeTO {
    id: number = 0;
    chqCuentaCodigo: string = "";
    chqCuentaDetalle: string = "";
    chqBeneficiario: string = "";
    chqNumero: string = "";
    chqValor: string = "";
    chqFechaEmision: string = "";
    chqFechaVencimiento: string = "";
    chqImpreso: string = "";
    chqRevisado: string = "";
    chqEntregado: string = "";
    chqContablePeriodo: string = "";
    chqContableTipo: string = "";
    chqContableNumero: string = "";
    chqSecuencia: string = "";
    chqOrden: number = 0;
    banNombre: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.chqCuentaCodigo = data.chqCuentaCodigo ? data.chqCuentaCodigo : this.chqCuentaCodigo;
        this.chqCuentaDetalle = data.chqCuentaDetalle ? data.chqCuentaDetalle : this.chqCuentaDetalle;
        this.chqBeneficiario = data.chqBeneficiario ? data.chqBeneficiario : this.chqBeneficiario;
        this.chqNumero = data.chqNumero ? data.chqNumero : this.chqNumero;
        this.chqValor = data.chqValor ? data.chqValor : this.chqValor;
        this.chqFechaEmision = data.chqFechaEmision ? data.chqFechaEmision : this.chqFechaEmision;
        this.chqFechaVencimiento = data.chqFechaVencimiento ? data.chqFechaVencimiento : this.chqFechaVencimiento;
        this.chqImpreso = data.chqImpreso ? data.chqImpreso : this.chqImpreso;
        this.chqRevisado = data.chqRevisado ? data.chqRevisado : this.chqRevisado;
        this.chqEntregado = data.chqEntregado ? data.chqEntregado : this.chqEntregado;
        this.chqContablePeriodo = data.chqContablePeriodo ? data.chqContablePeriodo : this.chqContablePeriodo;
        this.chqContableTipo = data.chqContableTipo ? data.chqContableTipo : this.chqContableTipo;
        this.chqContableNumero = data.chqContableNumero ? data.chqContableNumero : this.chqContableNumero;
        this.chqSecuencia = data.chqSecuencia ? data.chqSecuencia : this.chqSecuencia;
        this.chqOrden = data.chqOrden ? data.chqOrden : this.chqOrden;
    
    }
}