export class CarCuentasPorPagarGeneralTO {

	cxpgCodigo:string="";
	cxpgNombre:string="";
	cxpgSaldo:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cxpgCodigo = data.cxpgCodigo ? data.cxpgCodigo : this.cxpgCodigo;
		this.cxpgNombre = data.cxpgNombre ? data.cxpgNombre : this.cxpgNombre;
		this.cxpgSaldo = data.cxpgSaldo ? data.cxpgSaldo : this.cxpgSaldo;
	}

}
