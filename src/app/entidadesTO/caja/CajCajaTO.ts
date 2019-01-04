export class CajCajaTO {
    cajaEmpresa: string = null;
    cajaUsuarioResponsable: string = null;
    cajaUsuarioNombre: string = null;
    cajaCertificadoFirmaDigitalNombre: string = null;
    cajaCertificadoFirmaDigitalClave: string = null;
    permisoSecuencialFacturas: string = null;
    permisoSecuencialNotasCredito: string = null;
    permisoSecuencialNotasDebito: string = null;
    permisoSecuencialRetenciones: string = null;
    permisoMotivoPermitido: string = null;
    permisoBodegaPermitida: string = null;
    permisoDocumentoPermitido: string = null;
    permisoFormaPagoPermitida: string = null;
    permisoCambiarFechaVenta: boolean = false;
    permisoCambiarFechaRetencion: boolean = false;
    permisoCambiarPrecio: boolean = false;
    permisoAplicarDescuentos: boolean = false;
    permisoEliminarFilas: boolean = false;
    permisoClienteCrear: boolean = false;
    permisoClienteCredito: boolean = false;
    permisoClientePrecioPermitido: number = null;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cajaEmpresa = data.cajaEmpresa ? data.cajaEmpresa : this.cajaEmpresa;
        this.cajaUsuarioResponsable = data.cajaUsuarioResponsable ? data.cajaUsuarioResponsable : this.cajaUsuarioResponsable;
        this.cajaUsuarioNombre = data.cajaUsuarioNombre ? data.cajaUsuarioNombre : this.cajaUsuarioNombre;
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