export class CarListaPagosCobrosFormaTO {

	fpSecuencial:number=0;
	ctaCodigo:string="";
	fpDetalle:string="";
	secCodigo:string="";
	fpInactivo:boolean=false;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
		this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
		this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
		this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
		this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
	}

}
