export class CarContableTO {

	contPeriodo:string="";
	contTipo:string="";
	contNumero:string="";
	mensaje:string="";
	listaFacturaTO: Array<string> = [];

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.contPeriodo = data.contPeriodo ? data.contPeriodo : this.contPeriodo;
		this.contTipo = data.contTipo ? data.contTipo : this.contTipo;
		this.contNumero = data.contNumero ? data.contNumero : this.contNumero;
		this.mensaje = data.mensaje ? data.mensaje : this.mensaje;
		this.listaFacturaTO = data.listaFacturaTO ? data.listaFacturaTO : this.listaFacturaTO;
	}

}
