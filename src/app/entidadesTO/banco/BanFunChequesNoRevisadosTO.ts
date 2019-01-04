export class BanFunChequesNoRevisadosTO {
    id: number = 0;
    chqSecuencia: number = 0;
    chqCuentaCodigo: string = "";
    chqCuentaDetalle: string = "";
    chqBeneficiario: string = "";
    chqNumero: string = "";
    chqValor: number = 0;
    chqFechaEmision: string = "";
    chqFechaVencimiento: string = "";
    chqObservacion: string = "";
    chqImpreso: boolean = false;
    chqEntregado: boolean = false;
    chqContablePeriodo: string = "";
    chqContableTipo: string = "";
    chqContableNumero: string = "";
    chqOrden: number = 0;
    estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.chqSecuencia = data.chqSecuencia ? data.chqSecuencia : this.chqSecuencia;
        this.chqCuentaCodigo = data.chqCuentaCodigo ? data.chqCuentaCodigo : this.chqCuentaCodigo;
        this.chqCuentaDetalle = data.chqCuentaDetalle ? data.chqCuentaDetalle : this.chqCuentaDetalle;
        this.chqBeneficiario = data.chqBeneficiario ? data.chqBeneficiario : this.chqBeneficiario;
        this.chqNumero = data.chqNumero ? data.chqNumero : this.chqNumero;
        this.chqValor = data.chqValor ? data.chqValor : this.chqValor;
        this.chqFechaEmision = data.chqFechaEmision ? data.chqFechaEmision : this.chqFechaEmision;
        this.chqFechaVencimiento = data.chqFechaVencimiento ? data.chqFechaVencimiento : this.chqFechaVencimiento;
        this.chqObservacion = data.chqObservacion ? data.chqObservacion : this.chqObservacion;
        this.chqImpreso = data.chqImpreso ? data.chqImpreso : this.chqImpreso;
        this.chqEntregado = data.chqEntregado ? data.chqEntregado : this.chqEntregado;
        this.chqContablePeriodo = data.chqContablePeriodo ? data.chqContablePeriodo : this.chqContablePeriodo;
        this.chqContableTipo = data.chqContableTipo ? data.chqContableTipo : this.chqContableTipo;
        this.chqContableNumero = data.chqContableNumero ? data.chqContableNumero : this.chqContableNumero;
        this.chqOrden = data.chqOrden ? data.chqOrden : this.chqOrden;
        this.estado = data.estado ? data.estado : this.estado;    
    }
}