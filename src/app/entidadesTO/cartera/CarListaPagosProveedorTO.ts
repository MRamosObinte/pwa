export class CarListaPagosProveedorTO {

	provCodigo:string="";
	provNombre:string="";
	provRuc:string="";
	provDireccion:string="";
	provObservaciones:string="";
	conFecha:string="";
	pagSaldoAnterior:number=0;
	pagValor:number=0;
	pagSaldoActual:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
		this.provNombre = data.provNombre ? data.provNombre : this.provNombre;
		this.provRuc = data.provRuc ? data.provRuc : this.provRuc;
		this.provDireccion = data.provDireccion ? data.provDireccion : this.provDireccion;
		this.provObservaciones = data.provObservaciones ? data.provObservaciones : this.provObservaciones;
		this.conFecha = data.conFecha ? data.conFecha : this.conFecha;
		this.pagSaldoAnterior = data.pagSaldoAnterior ? data.pagSaldoAnterior : this.pagSaldoAnterior;
		this.pagValor = data.pagValor ? data.pagValor : this.pagValor;
		this.pagSaldoActual = data.pagSaldoActual ? data.pagSaldoActual : this.pagSaldoActual;
	}

}