export class CarCobrosDetalleAnticiposTO {

	detValor: number = 0;
	detObservaciones: string = "";
	antEmpresa: string = "";
	antPeriodo: string = "";
	antTipo: string = "";
	antNumero: string = "";
	antSector: string = "";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.detValor = data.detValor ? data.detValor : this.detValor;
		this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
		this.antEmpresa = data.antEmpresa ? data.antEmpresa : this.antEmpresa;
		this.antPeriodo = data.antPeriodo ? data.antPeriodo : this.antPeriodo;
		this.antTipo = data.antTipo ? data.antTipo : this.antTipo;
		this.antNumero = data.antNumero ? data.antNumero : this.antNumero;
		this.antSector = data.antSector ? data.antSector : this.antSector;
	}

}