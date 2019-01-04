import { InvComprasPK } from "./InvComprasPK";
import { InvComprasMotivoAnulacion } from "./InvComprasMotivoAnulacion";
import { InvComprasRecepcion } from "./InvComprasRecepcion";
import { InvProveedor } from "./InvProveedor";
import { InvBodega } from "./InvBodega";
import { InvComprasDetalle } from "./InvComprasDetalle";
import { InvAdjuntosCompras } from "./InvAdjuntosCompras";

export class InvCompras {

    invComprasPK: InvComprasPK = new InvComprasPK();
    compNumeroAlterno: String = null;
    compDocumentoEmpresa: String = null;
    compDocumentoProveedor: String = null;
    compDocumentoTipo: String = null;
    compDocumentoNumero: String = null;
    compFecha: Date = null;
    compFechaVencimiento: Date = null;
    compIvaVigente: Number = 0;
    compObservaciones: String = null;
    compElectronica: boolean = false;
    compActivoFijo: boolean = false;
    compImportacion: boolean = false;
    compPendiente: boolean = false;
    compRevisado: boolean = false;
    compAnulado: boolean = false;
    compFormaPago: String = null;
    compDocumentoFormaPago: String = null;
    compBase0: Number = 0;
    compBaseImponible: Number = 0;
    compBaseNoObjeto: Number = 0;
    compBaseExenta: Number = 0;
    compIce: Number = 0;
    compMontoIva: Number = 0;
    compOtrosImpuestos: Number = 0;
    // comp_propina
    compPropina: Number = 0;
    compTotal: Number = 0;
    compValorRetenido: Number = 0;
    compRetencionAsumida: boolean = false;
    compSaldo: Number = 0;
    secEmpresa: String = null;
    secCodigo: String = null;
    ctaEmpresa: String = null;
    ctaCodigo: String = null;
    conEmpresa: String = null;
    conPeriodo: String = null;
    conTipo: String = null;
    conNumero: String = null;
    empCodigo: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;
    invComprasRecepcionList: Array<InvComprasRecepcion> = [];
    invComprasMotivoAnulacionList: Array<InvComprasMotivoAnulacion> = [];
    invProveedor: InvProveedor = new InvProveedor();
    invBodega: InvBodega = new InvBodega();
    invComprasDetalleList: Array<InvComprasDetalle> = [];
    invAdjuntoCompras: Array<InvAdjuntosCompras> = [];
    //orden de compra
    ocEmpresa: string = null;
    ocSector: string = null;
    ocMotivo: string = null;
    ocNumero: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invComprasPK = data.invComprasPK ? data.invComprasPK : this.invComprasPK;
        this.compNumeroAlterno = data.compNumeroAlterno ? data.compNumeroAlterno : this.compNumeroAlterno;
        this.compDocumentoEmpresa = data.compDocumentoEmpresa ? data.compDocumentoEmpresa : this.compDocumentoEmpresa;
        this.compDocumentoProveedor = data.compDocumentoProveedor ? data.compDocumentoProveedor : this.compDocumentoProveedor;
        this.compDocumentoTipo = data.compDocumentoTipo ? data.compDocumentoTipo : this.compDocumentoTipo;
        this.compDocumentoNumero = data.compDocumentoNumero ? data.compDocumentoNumero : this.compDocumentoNumero;
        this.compFecha = data.compFecha ? data.compFecha : this.compFecha;
        this.compFechaVencimiento = data.compFechaVencimiento ? data.compFechaVencimiento : this.compFechaVencimiento;
        this.compIvaVigente = data.compIvaVigente ? data.compIvaVigente : this.compIvaVigente;
        this.compObservaciones = data.compObservaciones ? data.compObservaciones : this.compObservaciones;
        this.compElectronica = data.compElectronica ? data.compElectronica : this.compElectronica;
        this.compActivoFijo = data.compActivoFijo ? data.compActivoFijo : this.compActivoFijo;
        this.compImportacion = data.compImportacion ? data.compImportacion : this.compImportacion;
        this.compPendiente = data.compPendiente ? data.compPendiente : this.compPendiente;
        this.compRevisado = data.compRevisado ? data.compRevisado : this.compRevisado;
        this.compAnulado = data.compAnulado ? data.compAnulado : this.compAnulado;
        this.compFormaPago = data.compFormaPago ? data.compFormaPago : this.compFormaPago;
        this.compDocumentoFormaPago = data.compDocumentoFormaPago ? data.compDocumentoFormaPago : this.compDocumentoFormaPago;
        this.compBase0 = data.compBase0 ? data.compBase0 : this.compBase0;
        this.compBaseImponible = data.compBaseImponible ? data.compBaseImponible : this.compBaseImponible;
        this.compBaseNoObjeto = data.compBaseNoObjeto ? data.compBaseNoObjeto : this.compBaseNoObjeto;
        this.compBaseExenta = data.compBaseExenta ? data.compBaseExenta : this.compBaseExenta;
        this.compIce = data.compIce ? data.compIce : this.compIce;
        this.compMontoIva = data.compMontoIva ? data.compMontoIva : this.compMontoIva;
        this.compOtrosImpuestos = data.compOtrosImpuestos ? data.compOtrosImpuestos : this.compOtrosImpuestos;
        this.compPropina = data.compPropina ? data.compPropina : this.compPropina;
        this.compTotal = data.compTotal ? data.compTotal : this.compTotal;
        this.compValorRetenido = data.compValorRetenido ? data.compValorRetenido : this.compValorRetenido;
        this.compRetencionAsumida = data.compRetencionAsumida ? data.compRetencionAsumida : this.compRetencionAsumida;
        this.compSaldo = data.compSaldo ? data.compSaldo : this.compSaldo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.conEmpresa = data.conEmpresa ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data.conPeriodo ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invComprasRecepcionList = data.invComprasRecepcionList ? data.invComprasRecepcionList : this.invComprasRecepcionList;
        this.invComprasMotivoAnulacionList = data.invComprasMotivoAnulacionList ? data.invComprasMotivoAnulacionList : this.invComprasMotivoAnulacionList;
        this.invProveedor = data.invProveedor ? data.invProveedor : this.invProveedor;
        this.invBodega = data.invBodega ? data.invBodega : this.invBodega;
        this.invComprasDetalleList = data.invComprasDetalleList ? data.invComprasDetalleList : this.invComprasDetalleList;
        this.invAdjuntoCompras = data.invAdjuntoCompras ? data.invAdjuntoCompras : this.invAdjuntoCompras;
        this.ocEmpresa = data.ocEmpresa ? data.ocEmpresa : this.ocEmpresa;
        this.ocSector = data.ocSector ? data.ocSector : this.ocSector;
        this.ocMotivo = data.ocMotivo ? data.ocMotivo : this.ocMotivo;
        this.ocNumero = data.ocNumero ? data.ocNumero : this.ocNumero;
    }


}