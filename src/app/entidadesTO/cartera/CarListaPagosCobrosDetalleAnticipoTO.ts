export class CarListaPagosCobrosDetalleAnticipoTO {

	id:string="";
	antPeriodo:string="";
	antTipo:string="";
	antNumero:string="";
	antFecha:string="";
	valor:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.id = data.id ? data.id : this.id;
		this.antPeriodo = data.antPeriodo ? data.antPeriodo : this.antPeriodo;
		this.antTipo = data.antTipo ? data.antTipo : this.antTipo;
		this.antNumero = data.antNumero ? data.antNumero : this.antNumero;
		this.antFecha = data.antFecha ? data.antFecha : this.antFecha;
		this.valor = data.valor ? data.valor : this.valor;
	}

}