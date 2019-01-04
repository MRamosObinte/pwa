export class CarCuentasPorPagarCobrarAnticiposTO {

	id:number=0;
	cxpgCodigo:string="";
	cxpgNombre:string="";
	cxpgSaldo:number=0;
	cxpgAnticipos:number=0;
	cxpgTotal:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cxpgCodigo = data.cxpgCodigo ? data.cxpgCodigo : this.cxpgCodigo;
		this.cxpgNombre = data.cxpgNombre ? data.cxpgNombre : this.cxpgNombre;
		this.cxpgSaldo = data.cxpgSaldo ? data.cxpgSaldo : this.cxpgSaldo;
		this.cxpgAnticipos = data.cxpgAnticipos ? data.cxpgAnticipos : this.cxpgAnticipos;
		this.cxpgTotal = data.cxpgTotal ? data.cxpgTotal : this.cxpgTotal;
		this.id = data.id ? data.id : this.id;
	}

}
