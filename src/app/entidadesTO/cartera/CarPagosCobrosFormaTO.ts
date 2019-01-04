export class CarPagosCobrosFormaTO {
	fpSecuencial: number = 0;
	fpDetalle: string = null;
	fpInactivo: boolean = false;
	secCodigo: string = null;
	ctaCodigo: string = null;
	usrEmpresa: string = null;
	usrCodigo: string = null;
	usrFechaInserta: string = null;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
		this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
		this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
		this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
		this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
		this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
		this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
		this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
	}

}
