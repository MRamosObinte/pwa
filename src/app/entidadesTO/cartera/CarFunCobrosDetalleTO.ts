export class CarFunCobrosDetalleTO {

	id:number=0;
	cobNumeroSistema:string="";
	cobFecha:string="";
	cobCliente:string="";
	cobFormaPago:string="";
	cobReferencia:string="";
	cobValor:number=0;
	cobObservaciones:string="";
	cobPendiente:boolean=false;
	cobAnulado:boolean=false;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cobNumeroSistema = data.cobNumeroSistema ? data.cobNumeroSistema : this.cobNumeroSistema;
		this.cobFecha = data.cobFecha ? data.cobFecha : this.cobFecha;
		this.cobCliente = data.cobCliente ? data.cobCliente : this.cobCliente;
		this.cobFormaPago = data.cobFormaPago ? data.cobFormaPago : this.cobFormaPago;
		this.cobReferencia = data.cobReferencia ? data.cobReferencia : this.cobReferencia;
		this.cobValor = data.cobValor ? data.cobValor : this.cobValor;
		this.cobObservaciones = data.cobObservaciones ? data.cobObservaciones : this.cobObservaciones;
		this.cobPendiente = data.cobPendiente ? data.cobPendiente : this.cobPendiente;
		this.cobAnulado = data.cobAnulado ? data.cobAnulado : this.cobAnulado;
		this.id = data.id ? data.id : this.id;
	}

}
