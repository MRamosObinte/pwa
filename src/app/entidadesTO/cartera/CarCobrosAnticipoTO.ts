export class CarCobrosAnticipoTO {

	antEmpresa: string = "";
	antPeriodo: string = "";
	antTipo: string = "";
	antNumero: string = "";
	antValor: number = 0;
	antCobrado: boolean = false;
	antReversado: boolean = false;
	fpSecuencial: number = 0;
	cliEmpresa: string = "";
	cliCodigo: string = "";
	secEmpresa: string = "";
	secCodigo: string = "";
	usrEmpresa: string = "";
	usrCodigo: string = "";
	usrFechaInserta: string = "";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.antEmpresa = data.antEmpresa ? data.antEmpresa : this.antEmpresa;
		this.antPeriodo = data.antPeriodo ? data.antPeriodo : this.antPeriodo;
		this.antTipo = data.antTipo ? data.antTipo : this.antTipo;
		this.antNumero = data.antNumero ? data.antNumero : this.antNumero;
		this.antValor = data.antValor ? data.antValor : this.antValor;
		this.antCobrado = data.antCobrado ? data.antCobrado : this.antCobrado;
		this.antReversado = data.antReversado ? data.antReversado : this.antReversado;
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
		this.cliEmpresa = data.cliEmpresa ? data.cliEmpresa : this.cliEmpresa;
		this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
		this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
		this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
		this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
		this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
		this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
	}

}
