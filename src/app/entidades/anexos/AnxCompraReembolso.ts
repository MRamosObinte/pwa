import { AnxCompra } from "./AnxCompra";

export class AnxCompraReembolso {

    reembSecuencial: number = 0;
    reembDocumentoEmpresa: String = "";
    reembDocumentoProveedor: String = "";
    reembDocumentoTipo: String = "";
    reembDocumentoNumero: String = "";
    reembFechaemision: Date = new Date();
    reembAutorizacion: String = "";
    reembBaseimponible: number = 0;
    reembBaseimpgrav: number = 0;
    reembBasenograiva: number = 0;
    reembMontoice: number = 0;
    reembMontoiva: number = 0;
    provEmpresa: String = "";
    provCodigo: String = "";
    anxCompra: AnxCompra = new AnxCompra();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.reembSecuencial = data.reembSecuencial ? data.reembSecuencial : this.reembSecuencial;
        this.reembDocumentoEmpresa = data.reembDocumentoEmpresa ? data.reembDocumentoEmpresa : this.reembDocumentoEmpresa;
        this.reembDocumentoProveedor = data.reembDocumentoProveedor ? data.reembDocumentoProveedor : this.reembDocumentoProveedor;
        this.reembDocumentoTipo = data.reembDocumentoTipo ? data.reembDocumentoTipo : this.reembDocumentoTipo;
        this.reembDocumentoNumero = data.reembDocumentoNumero ? data.reembDocumentoNumero : this.reembDocumentoNumero;
        this.reembFechaemision = data.reembFechaemision ? data.reembFechaemision : this.reembFechaemision;
        this.reembAutorizacion = data.reembAutorizacion ? data.reembAutorizacion : this.reembAutorizacion;
        this.reembBaseimponible = data.reembBaseimponible ? data.reembBaseimponible : this.reembBaseimponible;
        this.reembBaseimpgrav = data.reembBaseimpgrav ? data.reembBaseimpgrav : this.reembBaseimpgrav;
        this.reembBasenograiva = data.reembBasenograiva ? data.reembBasenograiva : this.reembBasenograiva;
        this.reembMontoice = data.reembMontoice ? data.reembMontoice : this.reembMontoice;
        this.reembMontoiva = data.reembMontoiva ? data.reembMontoiva : this.reembMontoiva;
        this.provEmpresa = data.provEmpresa ? data.provEmpresa : this.provEmpresa;
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.anxCompra = data.anxCompra ? data.anxCompra : this.anxCompra;
    }
}