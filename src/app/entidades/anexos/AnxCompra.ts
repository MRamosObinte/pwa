import { AnxCompraPK } from "./AnxCompraPK";
import { AnxCompraReembolso } from "./AnxCompraReembolso";
import { AnxCompraDividendo } from "./AnxCompraDividendo";
import { AnxCompraFormaPago } from "./AnxCompraFormaPago";
import { AnxCompraElectronica } from "./AnxCompraElectronica";
import { AnxCompraDetalle } from "./AnxCompraDetalle";
import { AnxSustento } from "./AnxSustento";

export class AnxCompra {

    anxCompraPK: AnxCompraPK = new AnxCompraPK();
    compAutorizacion: String = "";
    compFechaEmision: Date = new Date ();
    compFechaCaduca: Date = new Date ();
    compFechaRecepcion: Date = new Date ();
    compBase0: number = 0;
    compBaseimponible: number = 0;
    compBasenoobjetoiva: number = 0;
    compMontoice: number = 0;
    compMontoiva: number = 0;
    compBaseivabienes: number = 0;
    compBaseivaservicios: number = 0;
    compBaseivaserviciosprofesionales: number = 0;
    compPorcentajebienes: number = 0;
    compPorcentajeservicios: number = 0;
    compPorcentajeserviciosprofesionales: number = 0;
    compValorbienes: number = 0;
    compValorservicios: number = 0;
    compValorserviciosprofesionales: number = 0;
    compRetencionEmpresa: String = "";
    compRetencionNumero: String = "";
    compRetencionAutorizacion: String = "";
    compRetencionFechaEmision: Date = new Date ();
    compModificadoDocumentoEmpresa: String = "";
    compModificadoDocumentoTipo: String = "";
    compModificadoDocumentoNumero: String = "";
    compModificadoAutorizacion: String = "";
    retImpresa: boolean = false;
    retEntregada: boolean = false;
    retElectronica: boolean = false;
    anxCompraReembolsoList: Array<AnxCompraReembolso> = [];
    anxCompraDividendoList: Array<AnxCompraDividendo> = [];
    anxCompraFormaPagoList: Array<AnxCompraFormaPago> = [];
    anxCompraElectronicaList: Array<AnxCompraElectronica> = [];
    anxCompraDetalleList: Array<AnxCompraDetalle> = [];
    compSustentotributario: AnxSustento = new AnxSustento();


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anxCompraPK = data.anxCompraPK ? data.anxCompraPK : this.anxCompraPK;
        this.compAutorizacion = data.compAutorizacion ? data.compAutorizacion : this.compAutorizacion;
        this.compFechaEmision = data.compFechaEmision ? data.compFechaEmision : this.compFechaEmision;
        this.compFechaCaduca = data.compFechaCaduca ? data.compFechaCaduca : this.compFechaCaduca;
        this.compFechaRecepcion = data.compFechaRecepcion ? data.compFechaRecepcion : this.compFechaRecepcion;
        this.compBase0 = data.compBase0 ? data.compBase0 : this.compBase0;
        this.compBaseimponible = data.compBaseimponible ? data.compBaseimponible : this.compBaseimponible;
        this.compBasenoobjetoiva = data.compBasenoobjetoiva ? data.compBasenoobjetoiva : this.compBasenoobjetoiva;
        this.compMontoice = data.compMontoice ? data.compMontoice : this.compMontoice;
        this.compMontoiva = data.compMontoiva ? data.compMontoiva : this.compMontoiva;
        this.compBaseivabienes = data.compBaseivabienes ? data.compBaseivabienes : this.compBaseivabienes;
        this.compBaseivaservicios = data.compBaseivaservicios ? data.compBaseivaservicios : this.compBaseivaservicios;
        this.compBaseivaserviciosprofesionales = data.compBaseivaserviciosprofesionales ? data.compBaseivaserviciosprofesionales : this.compBaseivaserviciosprofesionales;
        this.compPorcentajebienes = data.compPorcentajebienes ? data.compPorcentajebienes : this.compPorcentajebienes;
        this.compPorcentajeservicios = data.compPorcentajeservicios ? data.compPorcentajeservicios : this.compPorcentajeservicios;
        this.compPorcentajeserviciosprofesionales = data.compPorcentajeserviciosprofesionales ? data.compPorcentajeserviciosprofesionales : this.compPorcentajeserviciosprofesionales;
        this.compValorbienes = data.compValorbienes ? data.compValorbienes : this.compValorbienes;
        this.compValorservicios = data.compValorservicios ? data.compValorservicios : this.compValorservicios;
        this.compValorserviciosprofesionales = data.compValorserviciosprofesionales ? data.compValorserviciosprofesionales : this.compValorserviciosprofesionales;
        this.compRetencionEmpresa = data.compRetencionEmpresa ? data.compRetencionEmpresa : this.compRetencionEmpresa;
        this.compRetencionNumero = data.compRetencionNumero ? data.compRetencionNumero : this.compRetencionNumero;
        this.compRetencionAutorizacion = data.compRetencionAutorizacion ? data.compRetencionAutorizacion : this.compRetencionAutorizacion;
        this.compRetencionFechaEmision = data.compRetencionFechaEmision ? data.compRetencionFechaEmision : this.compRetencionFechaEmision;
        this.compModificadoDocumentoEmpresa = data.compModificadoDocumentoEmpresa ? data.compModificadoDocumentoEmpresa : this.compModificadoDocumentoEmpresa;
        this.compModificadoDocumentoTipo = data.compModificadoDocumentoTipo ? data.compModificadoDocumentoTipo : this.compModificadoDocumentoTipo;
        this.compModificadoDocumentoNumero = data.compModificadoDocumentoNumero ? data.compModificadoDocumentoNumero : this.compModificadoDocumentoNumero;
        this.compModificadoAutorizacion = data.compModificadoAutorizacion ? data.compModificadoAutorizacion : this.compModificadoAutorizacion;
        this.retImpresa = data.retImpresa ? data.retImpresa : this.retImpresa;
        this.retEntregada = data.retEntregada ? data.retEntregada : this.retEntregada;
        this.retElectronica = data.retElectronica ? data.retElectronica : this.retElectronica;
        this.anxCompraReembolsoList = data.anxCompraReembolsoList ? data.anxCompraReembolsoList : this.anxCompraReembolsoList;
        this.anxCompraDividendoList = data.anxCompraDividendoList ? data.anxCompraDividendoList : this.anxCompraDividendoList;
        this.anxCompraFormaPagoList = data.anxCompraFormaPagoList ? data.anxCompraFormaPagoList : this.anxCompraFormaPagoList;
        this.anxCompraElectronicaList = data.anxCompraElectronicaList ? data.anxCompraElectronicaList : this.anxCompraElectronicaList;
        this.anxCompraDetalleList = data.anxCompraDetalleList ? data.anxCompraDetalleList : this.anxCompraDetalleList;
        this.compSustentotributario = data.compSustentotributario ? data.compSustentotributario : this.compSustentotributario;
    }
}