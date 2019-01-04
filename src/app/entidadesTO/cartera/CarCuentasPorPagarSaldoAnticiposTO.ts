export class CarCuentasPorPagarSaldoAnticiposTO {

	id:number=0;
	antPeriodo:string="";
	antTipo:string="";
	antNumero:string="";
	antSector:string="";
	antFecha:string="";
	antValor:number=0;
	antProveedorCodigo:string="";
	antProveedorNombre:string="";
	antObservaciones:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {

		this.id = data.id ? data.id : this.id;
		this.antPeriodo = data.antPeriodo ? data.antPeriodo : this.antPeriodo;
		this.antTipo = data.antTipo ? data.antTipo : this.antTipo;
		this.antNumero = data.antNumero ? data.antNumero : this.antNumero;
		this.antSector = data.antSector ? data.antSector : this.antSector;
		this.antFecha = data.antFecha ? data.antFecha : this.antFecha;
		this.antValor = data.antValor ? data.antValor : this.antValor;
		this.antProveedorCodigo = data.antProveedorCodigo ? data.antProveedorCodigo : this.antProveedorCodigo;
		this.antProveedorNombre = data.antProveedorNombre ? data.antProveedorNombre : this.antProveedorNombre;
		this.antObservaciones = data.antObservaciones ? data.antObservaciones : this.antObservaciones;
	}

}
