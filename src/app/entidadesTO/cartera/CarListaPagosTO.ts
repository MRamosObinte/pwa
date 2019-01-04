export class CarListaPagosTO {

	id:number=0;
	cxppPeriodo:string="";
	cxppMotivo:string="";
	cxppNumero:string="";
	cxppAlterno:string="";
	cxppDocumentoNumero:string="";
	cxppSector:string="";
	cxppFechaEmision:string="";
	cxppFechaVencimiento:string="";
	cxppTotal:number=0;
	cxppAbonos:number=0;
	cxppSaldo:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cxppPeriodo = data.cxppPeriodo ? data.cxppPeriodo : this.cxppPeriodo;
		this.cxppMotivo = data.cxppMotivo ? data.cxppMotivo : this.cxppMotivo;
		this.cxppNumero = data.cxppNumero ? data.cxppNumero : this.cxppNumero;
		this.cxppAlterno = data.cxppAlterno ? data.cxppAlterno : this.cxppAlterno;
		this.cxppDocumentoNumero = data.cxppDocumentoNumero ? data.cxppDocumentoNumero : this.cxppDocumentoNumero;
		this.cxppSector = data.cxppSector ? data.cxppSector : this.cxppSector;
		this.cxppFechaEmision = data.cxppFechaEmision ? data.cxppFechaEmision : this.cxppFechaEmision;
		this.cxppFechaVencimiento = data.cxppFechaVencimiento ? data.cxppFechaVencimiento : this.cxppFechaVencimiento;
		this.cxppTotal = data.cxppTotal ? data.cxppTotal : this.cxppTotal;
		this.cxppAbonos = data.cxppAbonos ? data.cxppAbonos : this.cxppAbonos;
		this.cxppSaldo = data.cxppSaldo ? data.cxppSaldo : this.cxppSaldo;
		this.id = data.id ? data.id : this.id;
	}

}