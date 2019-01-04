export class CarCuentasPorCobrarSaldoAnticiposTO {
	
	id:number=0;
	antPeriodo:string="";
	antTipo:string="";
	antNumero:string="";
	antSector:string="";
	antFecha:string="";
	antValor:number=0;
	antClienteCodigo:string="";
	antClienteNombre:string="";
	antObservaciones:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	public hydrate(data) {	
		this.id = data.id ? data.id : this.id;
		this.antPeriodo = data.antPeriodo ? data.antPeriodo : this.antPeriodo;
		this.antTipo = data.antTipo ? data.antTipo : this.antTipo;
		this.antNumero = data.antNumero ? data.antNumero : this.antNumero;
		this.antSector = data.antSector ? data.antSector : this.antSector;
		this.antFecha = data.antFecha ? data.antFecha : this.antFecha;
		this.antValor = data.antValor ? data.antValor : this.antValor;
		this.antClienteCodigo = data.antClienteCodigo ? data.antClienteCodigo : this.antClienteCodigo;
		this.antClienteNombre = data.antClienteNombre ? data.antClienteNombre : this.antClienteNombre;
		this.antObservaciones = data.antObservaciones ? data.antObservaciones : this.antObservaciones;
	}

}
