export class CarCobrosTO {

	conApellidosNombres:string="";
	cobPeriodo:string="";
	cobTipo:string="";
	cobNumero:string="";
	cobReversado:boolean=false;
	cobSaldoAnterior:number=0;
	cobValor:number=0;
	cobSaldoActual:number=0;
	cobFecha:string="";// EJB contable
	cobObservaciones:string="";// EJB contable
	cliCodigo:string="";
	usrEmpresa:string="";
	usrCodigo:string="";
	usrFechaInserta:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.conApellidosNombres = data.conApellidosNombres ? data.conApellidosNombres : this.conApellidosNombres;
		this.cobPeriodo = data.cobPeriodo ? data.cobPeriodo : this.cobPeriodo;
		this.cobTipo = data.cobTipo ? data.cobTipo : this.cobTipo;
		this.cobNumero = data.cobNumero ? data.cobNumero : this.cobNumero;
		this.cobReversado = data.cobReversado ? data.cobReversado : this.cobReversado;
		this.cobSaldoAnterior = data.cobSaldoAnterior ? data.cobSaldoAnterior : this.cobSaldoAnterior;
		this.cobValor = data.cobValor ? data.cobValor : this.cobValor;
		this.cobSaldoActual = data.cobSaldoActual ? data.cobSaldoActual : this.cobSaldoActual;
		this.cobFecha = data.cobFecha ? data.cobFecha : this.cobFecha;
		this.cobObservaciones = data.cobObservaciones ? data.cobObservaciones : this.cobObservaciones;
		this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
		this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
		this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
		this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
	}

}
