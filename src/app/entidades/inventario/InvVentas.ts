import { InvVentasPK } from "./InvVentasPK";
import { InvVentasRecepcion } from "./InvVentasRecepcion";
import { InvVentasComplemento } from "./InvVentasComplemento";
import { InvVentasDetalle } from "./InvVentasDetalle";
import { InvVentasMotivoAnulacion } from "./InvVentasMotivoAnulacion";
import { InvCliente } from "./InvCliente";
import { InvBodega } from "./InvBodega";
import { InvProformas } from "./InvProformas";
import { InvVentasFormaCobro } from "./InvVentasFormaCobro";

export class InvVentas {

    invVentasPK: InvVentasPK = new InvVentasPK();
    vtaNumeroAlterno: String = null;
    vtaDocumentoEmpresa: String = null;
    vtaDocumentoTipo: String = null;
    vtaDocumentoNumero: String = null;
    vtaFecha: Date = null;
    vtaFechaVencimiento: Date = null;
    vtaIvaVigente: Number = 0;
    vtaObservaciones: String = null;
    vtaInformacionAdicional: String = null;
    vtaPendiente: boolean = false;
    vtaRevisado: boolean = false;
    vtaAnulado: boolean = false;
    vtaFormaPago: String = null;
    vtaBase0: Number = 0;
    vtaBaseImponible: Number = 0;
    vtaBaseNoObjeto: Number = 0;
    vtaBaseExenta: Number = 0;
    vtaDescuentoBase0: Number = 0;
    vtaDescuentoBaseImponible: Number = 0;
    vtaDescuentoBaseNoObjeto: Number = 0;
    vtaDescuentoBaseExenta: Number = 0;
    vtaSubtotalBase0: Number = 0;
    vtaSubtotalBaseImponible: Number = 0;
    vtaSubtotalBaseNoObjeto: Number = 0;
    vtaSubtotalBaseExenta: Number = 0;
    vtaMontoiva: Number = 0;
    vtaTotal: Number = 0;
    vtaPagadoEfectivo: Number = 0;
    vtaPagadoDineroElectronico: Number = 0;
    vtaPagadoTarjetaCredito: Number = 0;
    vtaPagadoOtro: Number = 0;
    secEmpresa: String = null;
    secCodigo: String = null;
    ctaEmpresa: String = null;
    ctaCodigo: String = null;
    conEmpresa: String = null;
    conPeriodo: String = null;
    conTipo: String = null;
    conNumero: String = null;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    usrModifica: String = null;
    usrFechaModifica: Date = null;
    usrComentario: String = null;
    invVentasDetalleList: Array<InvVentasDetalle> = [];
    invVentasRecepcionList: Array<InvVentasRecepcion> = [];
    invVentasMotivoAnulacionList: Array<InvVentasMotivoAnulacion> = [];
    invVentasComplementoList: Array<InvVentasComplemento> = [];
    invCliente: InvCliente = new InvCliente();
    invBodega: InvBodega = new InvBodega();

    vtaListaDePrecios: string = "";
    vtaReembolso: boolean = false;
    fcBanco: string = "";
    fcCuenta: string = "";
    fcCheque: string = "";
    fcLote: string = "";
    fcTitular: string = "";

    invProformas: InvProformas = new InvProformas();
    fcSecuencial: InvVentasFormaCobro = new InvVentasFormaCobro();


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invVentasPK = data.invVentasPK ? data.invVentasPK : this.invVentasPK;
        this.vtaNumeroAlterno = data.vtaNumeroAlterno ? data.vtaNumeroAlterno : this.vtaNumeroAlterno;
        this.vtaDocumentoEmpresa = data.vtaDocumentoEmpresa ? data.vtaDocumentoEmpresa : this.vtaDocumentoEmpresa;
        this.vtaDocumentoTipo = data.vtaDocumentoTipo ? data.vtaDocumentoTipo : this.vtaDocumentoTipo;
        this.vtaDocumentoNumero = data.vtaDocumentoNumero ? data.vtaDocumentoNumero : this.vtaDocumentoNumero;
        this.vtaFecha = data.vtaFecha ? data.vtaFecha : this.vtaFecha;
        this.vtaFechaVencimiento = data.vtaFechaVencimiento ? data.vtaFechaVencimiento : this.vtaFechaVencimiento;
        this.vtaIvaVigente = data.vtaIvaVigente ? data.vtaIvaVigente : this.vtaIvaVigente;
        this.vtaObservaciones = data.vtaObservaciones ? data.vtaObservaciones : this.vtaObservaciones;
        this.vtaInformacionAdicional = data.vtaInformacionAdicional ? data.vtaInformacionAdicional : this.vtaInformacionAdicional;
        this.vtaPendiente = data.vtaPendiente ? data.vtaPendiente : this.vtaPendiente;
        this.vtaRevisado = data.vtaRevisado ? data.vtaRevisado : this.vtaRevisado;
        this.vtaAnulado = data.vtaAnulado ? data.vtaAnulado : this.vtaAnulado;
        this.vtaFormaPago = data.vtaFormaPago ? data.vtaFormaPago : this.vtaFormaPago;
        this.vtaBase0 = data.vtaBase0 ? data.vtaBase0 : this.vtaBase0;
        this.vtaBaseImponible = data.vtaBaseImponible ? data.vtaBaseImponible : this.vtaBaseImponible;
        this.vtaBaseNoObjeto = data.vtaBaseNoObjeto ? data.vtaBaseNoObjeto : this.vtaBaseNoObjeto;
        this.vtaBaseExenta = data.vtaBaseExenta ? data.vtaBaseExenta : this.vtaBaseExenta;
        this.vtaDescuentoBase0 = data.vtaDescuentoBase0 ? data.vtaDescuentoBase0 : this.vtaDescuentoBase0;
        this.vtaDescuentoBaseImponible = data.vtaDescuentoBaseImponible ? data.vtaDescuentoBaseImponible : this.vtaDescuentoBaseImponible;
        this.vtaDescuentoBaseNoObjeto = data.vtaDescuentoBaseNoObjeto ? data.vtaDescuentoBaseNoObjeto : this.vtaDescuentoBaseNoObjeto;
        this.vtaDescuentoBaseExenta = data.vtaDescuentoBaseExenta ? data.vtaDescuentoBaseExenta : this.vtaDescuentoBaseExenta;
        this.vtaSubtotalBase0 = data.vtaSubtotalBase0 ? data.vtaSubtotalBase0 : this.vtaSubtotalBase0;
        this.vtaSubtotalBaseImponible = data.vtaSubtotalBaseImponible ? data.vtaSubtotalBaseImponible : this.vtaSubtotalBaseImponible;
        this.vtaSubtotalBaseNoObjeto = data.vtaSubtotalBaseNoObjeto ? data.vtaSubtotalBaseNoObjeto : this.vtaSubtotalBaseNoObjeto;
        this.vtaSubtotalBaseExenta = data.vtaSubtotalBaseExenta ? data.vtaSubtotalBaseExenta : this.vtaSubtotalBaseExenta;
        this.vtaMontoiva = data.vtaMontoiva ? data.vtaMontoiva : this.vtaMontoiva;
        this.vtaTotal = data.vtaTotal ? data.vtaTotal : this.vtaTotal;
        this.vtaPagadoEfectivo = data.vtaPagadoEfectivo ? data.vtaPagadoEfectivo : this.vtaPagadoEfectivo;
        this.vtaPagadoDineroElectronico = data.vtaPagadoDineroElectronico ? data.vtaPagadoDineroElectronico : this.vtaPagadoDineroElectronico;
        this.vtaPagadoTarjetaCredito = data.vtaPagadoTarjetaCredito ? data.vtaPagadoTarjetaCredito : this.vtaPagadoTarjetaCredito;
        this.vtaPagadoOtro = data.vtaPagadoOtro ? data.vtaPagadoOtro : this.vtaPagadoOtro;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.conEmpresa = data.conEmpresa ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data.conPeriodo ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.usrModifica = data.usrModifica ? data.usrModifica : this.usrModifica;
        this.usrFechaModifica = data.usrFechaModifica ? data.usrFechaModifica : this.usrFechaModifica;
        this.usrComentario = data.usrComentario ? data.usrComentario : this.usrComentario;
        this.invVentasDetalleList = data.invVentasDetalleList ? data.invVentasDetalleList : this.invVentasDetalleList;
        this.invVentasRecepcionList = data.invVentasRecepcionList ? data.invVentasRecepcionList : this.invVentasRecepcionList;
        this.invVentasMotivoAnulacionList = data.invVentasMotivoAnulacionList ? data.invVentasMotivoAnulacionList : this.invVentasMotivoAnulacionList;
        this.invVentasComplementoList = data.invVentasComplementoList ? data.invVentasComplementoList : this.invVentasComplementoList;
        this.invCliente = data.invCliente ? data.invCliente : this.invCliente;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;

        this.vtaListaDePrecios = data.vtaListaDePrecios ? data.vtaListaDePrecios : this.vtaListaDePrecios;
        this.vtaReembolso = data.vtaReembolso ? data.vtaReembolso : this.vtaReembolso;
        this.fcBanco = data.fcBanco ? data.fcBanco : this.fcBanco;
        this.fcCuenta = data.fcCuenta ? data.fcCuenta : this.fcCuenta;
        this.fcCheque = data.fcCheque ? data.fcCheque : this.fcCheque;
        this.fcLote = data.fcLote ? data.fcLote : this.fcLote;
        this.fcTitular = data.fcTitular ? data.fcTitular : this.fcTitular;
        this.invProformas = data.invProformas ? data.invProformas : this.invProformas;
        this.fcSecuencial = data.fcSecuencial ? data.fcSecuencial : this.fcSecuencial;
    }
}