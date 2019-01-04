export class CarListaPagosCobrosDetalleFormaTO {

	id:number=0;
	fpForma:string="";
	fpBanco:string="";
	fpCuenta:string="";
	fpFecha:string="";
	fpReferencia:string="";
	fpValor:number=0;
	fpObservaciones:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.fpForma = data.fpForma ? data.fpForma : this.fpForma;
		this.fpBanco = data.fpBanco ? data.fpBanco : this.fpBanco;
		this.fpCuenta = data.fpCuenta ? data.fpCuenta : this.fpCuenta;
		this.fpFecha = data.fpFecha ? data.fpFecha : this.fpFecha;
		this.fpReferencia = data.fpReferencia ? data.fpReferencia : this.fpReferencia;
		this.fpValor = data.fpValor ? data.fpValor : this.fpValor;
		this.fpObservaciones = data.fpObservaciones ? data.fpObservaciones : this.fpObservaciones;
		this.id = data.id ? data.id : this.id;
	}

}