export class CarPagosCobrosAnticipoTO {

	antValor:number=0;
	fpSecuencial:number=0;
	secCodigo:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.antValor = data.antValor ? data.antValor : this.antValor;
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
		this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
	}

}
