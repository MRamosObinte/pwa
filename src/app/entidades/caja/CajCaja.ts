import { CajCajaPK } from "./CajCajaPK";

export class CajCaja {

	cajCajaPK: CajCajaPK = new CajCajaPK();
	cajaCertificadoFirmaDigitalNombre: String = "";
	cajaCertificadoFirmaDigitalClave: String = "";
	permisoSecuencialFacturas: String = "";
	permisoSecuencialNotasCredito: String = "";
	permisoSecuencialNotasDebito: String = "";
	permisoSecuencialRetenciones: String = "";
	permisoMotivoPermitido: String = "";
	permisoBodegaPermitida: String = "";
	permisoDocumentoPermitido: String = "";
	permisoFormaPagoPermitida: String = "";
	permisoCambiarFechaVenta: boolean = false;
	permisoCambiarFechaRetencion: boolean = false;
	permisoCambiarPrecio: boolean = false;
	permisoAplicarDescuentos: boolean = false;
	permisoEliminarFilas: boolean = false;
	permisoClienteCrear: boolean = false;
	permisoClienteCredito: boolean = false;
	permisoClientePrecioPermitido: number = 0;
	usrEmpresa: String = "";
	usrCodigo: String = "";
	usrFechaInserta: Date = new Date();

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.cajCajaPK = data.cajCajaPK ? new CajCajaPK(data.cajCajaPK) : this.cajCajaPK;
		this.cajaCertificadoFirmaDigitalNombre = data.cajaCertificadoFirmaDigitalNombre ? data.cajaCertificadoFirmaDigitalNombre : this.cajaCertificadoFirmaDigitalNombre;
		this.cajaCertificadoFirmaDigitalClave = data.cajaCertificadoFirmaDigitalClave ? data.cajaCertificadoFirmaDigitalClave : this.cajaCertificadoFirmaDigitalClave;
		this.permisoSecuencialFacturas = data.permisoSecuencialFacturas ? data.permisoSecuencialFacturas : this.permisoSecuencialFacturas;
		this.permisoSecuencialNotasCredito = data.permisoSecuencialNotasCredito ? data.permisoSecuencialNotasCredito : this.permisoSecuencialNotasCredito;
		this.permisoSecuencialNotasDebito = data.permisoSecuencialNotasDebito ? data.permisoSecuencialNotasDebito : this.permisoSecuencialNotasDebito;
		this.permisoSecuencialRetenciones = data.permisoSecuencialRetenciones ? data.permisoSecuencialRetenciones : this.permisoSecuencialRetenciones;
		this.permisoMotivoPermitido = data.permisoMotivoPermitido ? data.permisoMotivoPermitido : this.permisoMotivoPermitido;
		this.permisoBodegaPermitida = data.permisoBodegaPermitida ? data.permisoBodegaPermitida : this.permisoBodegaPermitida;
		this.permisoDocumentoPermitido = data.permisoDocumentoPermitido ? data.permisoDocumentoPermitido : this.permisoDocumentoPermitido;
		this.permisoFormaPagoPermitida = data.permisoFormaPagoPermitida ? data.permisoFormaPagoPermitida : this.permisoFormaPagoPermitida;
		this.permisoCambiarFechaVenta = data.permisoCambiarFechaVenta ? data.permisoCambiarFechaVenta : this.permisoCambiarFechaVenta;
		this.permisoCambiarFechaRetencion = data.permisoCambiarFechaRetencion ? data.permisoCambiarFechaRetencion : this.permisoCambiarFechaRetencion;
		this.permisoCambiarPrecio = data.permisoCambiarPrecio ? data.permisoCambiarPrecio : this.permisoCambiarPrecio;
		this.permisoAplicarDescuentos = data.permisoAplicarDescuentos ? data.permisoAplicarDescuentos : this.permisoAplicarDescuentos;
		this.permisoEliminarFilas = data.permisoEliminarFilas ? data.permisoEliminarFilas : this.permisoEliminarFilas;
		this.permisoClienteCrear = data.permisoClienteCrear ? data.permisoClienteCrear : this.permisoClienteCrear;
		this.permisoClienteCredito = data.permisoClienteCredito ? data.permisoClienteCredito : this.permisoClienteCredito;
		this.permisoClientePrecioPermitido = data.permisoClientePrecioPermitido ? data.permisoClientePrecioPermitido : this.permisoClientePrecioPermitido;
		this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
		this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
		this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
	}

}