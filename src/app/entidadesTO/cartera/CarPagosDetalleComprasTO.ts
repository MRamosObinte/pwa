export class CarPagosDetalleComprasTO {

	detSecuencial: number = 0;
	detValor: number = 0;
	pagEmpresa: string = "";
	pagPeriodo: string = "";
	pagTipo: string = "";
	pagNumero: string = "";
	compEmpresa: string = "";
	compPeriodo: string = "";
	compMotivo: string = "";
	compNumero: string = "";
	provCodigo: string = "";
	compDocumento: string = "";
	compSecCodigo: string = "";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
		this.detValor = data.detValor ? data.detValor : this.detValor;
		this.pagEmpresa = data.pagEmpresa ? data.pagEmpresa : this.pagEmpresa;
		this.pagPeriodo = data.pagPeriodo ? data.pagPeriodo : this.pagPeriodo;
		this.pagTipo = data.pagTipo ? data.pagTipo : this.pagTipo;
		this.pagNumero = data.pagNumero ? data.pagNumero : this.pagNumero;
		this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
		this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
		this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
		this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
		this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
		this.compDocumento = data.compDocumento ? data.compDocumento : this.compDocumento;
		this.compSecCodigo = data.compSecCodigo ? data.compSecCodigo : this.compSecCodigo;
	}

}
