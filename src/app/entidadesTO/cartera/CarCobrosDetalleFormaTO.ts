export class CarCobrosDetalleFormaTO {

	detBanco: string = null;
	detCuenta: string = null;
	detFechaPst: string = "";
	detReferencia: string = "";
	detValor: number = 0;
	detObservaciones: string = "";
	banEmpresa: string = null;
	banCodigo: string = null;
	cobEmpresa: string = "";
	cobPeriodo: string = "";
	cobMotivo: string = "";
	cobNumero: string = "";
	secCodigo: string = "";
	fpSecuencial: number = 0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.detBanco = data.detBanco ? data.detBanco : this.detBanco;
		this.detCuenta = data.detCuenta ? data.detCuenta : this.detCuenta;
		this.detFechaPst = data.detFechaPst ? data.detFechaPst : this.detFechaPst;
		this.detReferencia = data.detReferencia ? data.detReferencia : this.detReferencia;
		this.detValor = data.detValor ? data.detValor : this.detValor;
		this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
		this.banEmpresa = data.banEmpresa ? data.banEmpresa : this.banEmpresa;
		this.banCodigo = data.banCodigo ? data.banCodigo : this.banCodigo;
		this.cobEmpresa = data.cobEmpresa ? data.cobEmpresa : this.cobEmpresa;
		this.cobPeriodo = data.cobPeriodo ? data.cobPeriodo : this.cobPeriodo;
		this.cobMotivo = data.cobMotivo ? data.cobMotivo : this.cobMotivo;
		this.cobNumero = data.cobNumero ? data.cobNumero : this.cobNumero;
		this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
	}

}
