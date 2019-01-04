export class CarListaPagosDetalleFormaTO {

	fpForma:string="";
	fpReferencia:string="";
	fpValor:number=0;
	fpObservaciones:string="";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.fpForma = data.fpForma ? data.fpForma : this.fpForma;
		this.fpReferencia = data.fpReferencia ? data.fpReferencia : this.fpReferencia;
		this.fpValor = data.fpValor ? data.fpValor : this.fpValor;
		this.fpObservaciones = data.fpObservaciones ? data.fpObservaciones : this.fpObservaciones;
	}
	
}