export class CarListaCobrosTO {

	id:number=0;
	cxccPeriodo:string="";
	cxccMotivo:string="";
	cxccNumero:string="";
	cxccAlterno:string="";
	cxccDocumentoNumero:string="";
	cxccSector:string="";
	cxccFechaEmision:string="";
	cxccFechaVencimiento:string="";
	cxccTotal:number=0;
	cxccAbonos:number=0;
	cxccSaldo:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cxccPeriodo = data.cxccPeriodo ? data.cxccPeriodo : this.cxccPeriodo;
		this.cxccMotivo = data.cxccMotivo ? data.cxccMotivo : this.cxccMotivo;
		this.cxccNumero = data.cxccNumero ? data.cxccNumero : this.cxccNumero;
		this.cxccAlterno = data.cxccAlterno ? data.cxccAlterno : this.cxccAlterno;
		this.cxccDocumentoNumero = data.cxccDocumentoNumero ? data.cxccDocumentoNumero : this.cxccDocumentoNumero;
		this.cxccSector = data.cxccSector ? data.cxccSector : this.cxccSector;
		this.cxccFechaEmision = data.cxccFechaEmision ? data.cxccFechaEmision : this.cxccFechaEmision;
		this.cxccFechaVencimiento = data.cxccFechaVencimiento ? data.cxccFechaVencimiento : this.cxccFechaVencimiento;
		this.cxccTotal = data.cxccTotal ? data.cxccTotal : this.cxccTotal;
		this.cxccAbonos = data.cxccAbonos ? data.cxccAbonos : this.cxccAbonos;
		this.cxccSaldo = data.cxccSaldo ? data.cxccSaldo : this.cxccSaldo;
		this.id = data.id ? data.id : this.id;
	}

}