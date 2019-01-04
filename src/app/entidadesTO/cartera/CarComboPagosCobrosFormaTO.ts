export class CarComboPagosCobrosFormaTO {

	fpSecuencial:number=null;
	fpDetalle:string="";
	ctaCodigo:string="";
	validar:boolean=false;
	postFechados:boolean=false;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
		this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
		this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
		this.validar = data.validar ? data.validar : this.validar;
		this.postFechados = data.postFechados ? data.postFechados : this.postFechados;
	}

}
