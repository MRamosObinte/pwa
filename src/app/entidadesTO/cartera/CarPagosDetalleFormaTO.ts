export class CarPagosDetalleFormaTO {

	detValor:number=0;
	detReferencia:string="";
	detObservaciones:string="";
	pagEmpresa:string="";
	pagPeriodo:string="";
	pagMotivo:string="";
	pagNumero:string="";
	fpSecuencial:number=0;
	secCodigo:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.detValor = data.detValor ? data.detValor : this.detValor;
		this.detReferencia = data.detReferencia ? data.detReferencia : this.detReferencia;
		this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
		this.pagEmpresa = data.pagEmpresa ? data.pagEmpresa : this.pagEmpresa;
		this.pagPeriodo = data.pagPeriodo ? data.pagPeriodo : this.pagPeriodo;
		this.pagMotivo = data.pagMotivo ? data.pagMotivo : this.pagMotivo;
		this.pagNumero = data.pagNumero ? data.pagNumero : this.pagNumero;
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
		this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
	}

}
