export class AnxCompraReembolsoTO {
    reembSecuencial: number = null;
    reembDocumentoTipo: string = null;
    reembDocumentoNumero: string = null;
    reembFechaemision: any = null;
    reembAutorizacion: string = null;
    reembBaseimponible: number = 0;
    reembBaseimpgrav: number = 0;
    reembBasenograiva: number = 0;
    reembMontoice: number = 0;
    reembMontoiva: number = 0;
    provEmpresa: string = null;
    provCodigo: string = null;
    compEmpresa: string = null;
    compPeriodo: string = null;
    compMotivo: string = null;
    compNumero: string = null;
    auxDocTipo_Abreviatura: string = null;
    auxProvRazonSocial: string = null;
    auxProvRUC: string = null;
    provCodigoCopia: string = null;//Temporal

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.reembSecuencial = data.reembSecuencial ? data.reembSecuencial : this.reembSecuencial;
        this.reembDocumentoTipo = data.reembDocumentoTipo ? data.reembDocumentoTipo : this.reembDocumentoTipo;
        this.reembDocumentoNumero = data.reembDocumentoNumero ? data.reembDocumentoNumero : this.reembDocumentoNumero;
        this.reembFechaemision = data.reembFechaemision ? data.reembFechaemision : this.reembFechaemision;
        this.reembAutorizacion = data.reembAutorizacion ? data.reembAutorizacion : this.reembAutorizacion;
        this.reembBaseimponible = data.reembBaseimponible ? data.reembBaseimponible : this.reembBaseimponible;
        this.reembBaseimpgrav = data.reembBaseimpgrav ? data.reembBaseimpgrav : this.reembBaseimpgrav;
        this.reembBasenograiva = data.reembBasenograiva ? data.reembBasenograiva : this.reembBasenograiva;
        this.provEmpresa = data.provEmpresa ? data.provEmpresa : this.provEmpresa;
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
        this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
        this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
        this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.auxDocTipo_Abreviatura = data.auxDocTipo_Abreviatura ? data.auxDocTipo_Abreviatura : this.auxDocTipo_Abreviatura;
        this.auxProvRazonSocial = data.auxProvRazonSocial ? data.auxProvRazonSocial : this.auxProvRazonSocial;
        this.auxProvRUC = data.auxProvRUC ? data.auxProvRUC : this.auxProvRUC;
    }

}