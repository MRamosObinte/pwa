export class CarPagosPK {

	pagEmpresa: string = "";
	pagPeriodo: string = "";
	pagTipo: string = "";
	pagNumero: string = "";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.pagEmpresa = data.pagEmpresa ? data.pagEmpresa : this.pagEmpresa;
		this.pagPeriodo = data.pagPeriodo ? data.pagPeriodo : this.pagPeriodo;
		this.pagTipo = data.pagTipo ? data.pagTipo : this.pagTipo;
		this.pagNumero = data.pagNumero ? data.pagNumero : this.pagNumero;
	}
	
}