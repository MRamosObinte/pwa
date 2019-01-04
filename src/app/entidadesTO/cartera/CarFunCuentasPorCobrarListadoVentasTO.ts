export class CarFunCuentasPorCobrarListadoVentasTO {

	id:number;
	cxcdPeriodo:string="";
	cxcdMotivo:string="";
	cxcdNumero:string="";
	cxcdCliente:string="";
	cxcdFechaEmision:string="";
	cxcdFechaVencimiento:string="";
	cxcdSaldo:number;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cxcdPeriodo = data.cxcdPeriodo ? data.cxcdPeriodo : this.cxcdPeriodo;
		this.cxcdMotivo = data.cxcdMotivo ? data.cxcdMotivo : this.cxcdMotivo;
		this.cxcdNumero = data.cxcdNumero ? data.cxcdNumero : this.cxcdNumero;
		this.cxcdCliente = data.cxcdCliente ? data.cxcdCliente : this.cxcdCliente;
		this.cxcdFechaEmision = data.cxcdFechaEmision ? data.cxcdFechaEmision : this.cxcdFechaEmision;
		this.cxcdFechaVencimiento = data.cxcdFechaVencimiento ? data.cxcdFechaVencimiento : this.cxcdFechaVencimiento;
		this.cxcdSaldo = data.cxcdSaldo ? data.cxcdSaldo : this.cxcdSaldo;
		this.id = data.id ? data.id : this.id;
	}

}
