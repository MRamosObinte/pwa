export class CuentasPorPagarDetalladoTO {

	id:number=0;
	cxpdPeriodo:string="";
	cxpdMotivo:string="";
	cxpdNumero:string="";
	cxpdProveedor:string="";
	cxpdFechaEmision:string="";
	cxpdFechaVencimiento:string="";
	cxpdSaldo:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cxpdPeriodo = data.cxpdPeriodo ? data.cxpdPeriodo : this.cxpdPeriodo;
		this.cxpdMotivo = data.cxpdMotivo ? data.cxpdMotivo : this.cxpdMotivo;
		this.cxpdNumero = data.cxpdNumero ? data.cxpdNumero : this.cxpdNumero;
		this.cxpdProveedor = data.cxpdProveedor ? data.cxpdProveedor : this.cxpdProveedor;
		this.cxpdFechaEmision = data.cxpdFechaEmision ? data.cxpdFechaEmision : this.cxpdFechaEmision;
		this.cxpdFechaVencimiento = data.cxpdFechaVencimiento ? data.cxpdFechaVencimiento : this.cxpdFechaVencimiento;
		this.cxpdSaldo = data.cxpdSaldo ? data.cxpdSaldo : this.cxpdSaldo;
		this.id = data.id ? data.id : this.id;
	}

}
