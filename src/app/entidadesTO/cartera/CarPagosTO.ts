export class CarPagosTO {

	conApellidosNombres:string="";
	pagPeriodo:string="";
	pagTipo:string="";
	pagNumero:string="";
	pagReversado:boolean=false;
	pagSaldoAnterior:number=0;
	pagValor:number=0;
	pagSaldoActual:number=0;
	pagFecha:string="";// EJB contable
	pagObservaciones:string="";// EJB contable
	provCodigo:string="";
	usrEmpresa:string="";
	usrCodigo:string="";
	usrFechaInserta:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.conApellidosNombres = data.conApellidosNombres ? data.conApellidosNombres : this.conApellidosNombres;
		this.pagPeriodo = data.pagPeriodo ? data.pagPeriodo : this.pagPeriodo;
		this.pagTipo = data.pagTipo ? data.pagTipo : this.pagTipo;
		this.pagNumero = data.pagNumero ? data.pagNumero : this.pagNumero;
		this.pagReversado = data.pagReversado ? data.pagReversado : this.pagReversado;
		this.pagSaldoAnterior = data.pagSaldoAnterior ? data.pagSaldoAnterior : this.pagSaldoAnterior;
		this.pagValor = data.pagValor ? data.pagValor : this.pagValor;
		this.pagSaldoActual = data.pagSaldoActual ? data.pagSaldoActual : this.pagSaldoActual;
		this.pagFecha = data.pagFecha ? data.pagFecha : this.pagFecha;
		this.pagObservaciones = data.pagObservaciones ? data.pagObservaciones : this.pagObservaciones;
		this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
		this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
		this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
		this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
	}
	
}
