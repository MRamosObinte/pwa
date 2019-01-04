export class CarFunPagosDetalleTO {

	id:number=0;
	pagNumeroSistema:string="";
	pagFecha:string="";
	pagProveedor:string="";
	pagFormaPago:string="";
	pagReferencia:string="";
	pagValor:number=0;
	pagObservaciones:string="";
	pagPendiente:boolean=false;
	pagAnulado:boolean=false;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.pagNumeroSistema = data.pagNumeroSistema ? data.pagNumeroSistema : this.pagNumeroSistema;
		this.pagFecha = data.pagFecha ? data.pagFecha : this.pagFecha;
		this.pagProveedor = data.pagProveedor ? data.pagProveedor : this.pagProveedor;
		this.pagFormaPago = data.pagFormaPago ? data.pagFormaPago : this.pagFormaPago;
		this.pagReferencia = data.pagReferencia ? data.pagReferencia : this.pagReferencia;
		this.pagValor = data.pagValor ? data.pagValor : this.pagValor;
		this.pagObservaciones = data.pagObservaciones ? data.pagObservaciones : this.pagObservaciones;
		this.pagPendiente = data.pagPendiente ? data.pagPendiente : this.pagPendiente;
		this.pagAnulado = data.pagAnulado ? data.pagAnulado : this.pagAnulado;
		this.id = data.id ? data.id : this.id;
	}

}
