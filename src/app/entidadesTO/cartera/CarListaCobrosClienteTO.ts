export class CarListaCobrosClienteTO {

	cliCodigo:string="";
	cliNombre:string="";
	cliRuc:string="";
	cliDireccion:string="";
	cliObservaciones:string="";
	conFecha:string="";
	conAnulado:boolean=false;
	cobSaldoAnterior:number=0;
	cobValor:number=0;
	cobSaldoActual:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
		this.cliNombre = data.cliNombre ? data.cliNombre : this.cliNombre;
		this.cliRuc = data.cliRuc ? data.cliRuc : this.cliRuc;
		this.cliDireccion = data.cliDireccion ? data.cliDireccion : this.cliDireccion;
		this.cliObservaciones = data.cliObservaciones ? data.cliObservaciones : this.cliObservaciones;
		this.conFecha = data.conFecha ? data.conFecha : this.conFecha;
		this.conAnulado = data.conAnulado ? data.conAnulado : this.conAnulado;
		this.cobSaldoAnterior = data.cobSaldoAnterior ? data.cobSaldoAnterior : this.cobSaldoAnterior;
		this.cobValor = data.cobValor ? data.cobValor : this.cobValor;
		this.cobSaldoActual = data.cobSaldoActual ? data.cobSaldoActual : this.cobSaldoActual;
	}

}