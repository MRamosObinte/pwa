export class CarCobrosDetalleFormaPostfechadoTO {

	detSecuencial: number = 0;
	banNombre: string = null;
	detCuenta: string = null;
	detFechaVencimiento: string = "";
	detReferencia: string = "";
	detValor: number = 0;
	detObservaciones: string = "";

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
		this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
		this.detCuenta = data.detCuenta ? data.detCuenta : this.detCuenta;
		this.detFechaVencimiento = data.detFechaVencimiento ? data.detFechaVencimiento : this.detFechaVencimiento;
		this.detReferencia = data.detReferencia ? data.detReferencia : this.detReferencia;
		this.detValor = data.detValor ? data.detValor : this.detValor;
		this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
	}

}
