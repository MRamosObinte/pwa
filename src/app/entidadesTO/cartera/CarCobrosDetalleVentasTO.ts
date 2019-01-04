export class CarCobrosDetalleVentasTO {

	detSecuencial: number = 0;
	detValor: number = 0;
	cobEmpresa: string = "";
	cobPeriodo: string = "";
	cobTipo: string = "";
	cobNumero: string = "";
	vtaEmpresa: string = "";
	vtaPeriodo: string = "";
	vtaMotivo: string = "";
	vtaNumero: string = "";
	cliCodigo: string = "";
	vtaDocumento: string = "";
	vtaSecCodigo: string = "";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
		this.detValor = data.detValor ? data.detValor : this.detValor;
		this.cobEmpresa = data.cobEmpresa ? data.cobEmpresa : this.cobEmpresa;
		this.cobPeriodo = data.cobPeriodo ? data.cobPeriodo : this.cobPeriodo;
		this.cobTipo = data.cobTipo ? data.cobTipo : this.cobTipo;
		this.cobNumero = data.cobNumero ? data.cobNumero : this.cobNumero;
		this.vtaEmpresa = data.vtaEmpresa ? data.vtaEmpresa : this.vtaEmpresa;
		this.vtaPeriodo = data.vtaPeriodo ? data.vtaPeriodo : this.vtaPeriodo;
		this.vtaMotivo = data.vtaMotivo ? data.vtaMotivo : this.vtaMotivo;
		this.vtaNumero = data.vtaNumero ? data.vtaNumero : this.vtaNumero;
		this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
		this.vtaDocumento = data.vtaDocumento ? data.vtaDocumento : this.vtaDocumento;
		this.vtaSecCodigo = data.vtaSecCodigo ? data.vtaSecCodigo : this.vtaSecCodigo;
	}

}
