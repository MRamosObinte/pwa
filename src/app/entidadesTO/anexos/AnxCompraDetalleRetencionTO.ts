export class AnxCompraDetalleRetencionTO {
    detSecuencial: number = null;
    detConcepto: string = null;
    detBase0: number = 0;
    detBaseImponible: number = 0;
    detBaseNoObjetoIva: number = 0;
    detPorcentaje: number = 0;
    detValorRetenido: number = 0;
    detOrden: number = 0;
    compEmpresa: string = null;
    compPeriodo: string = null;
    compMotivo: string = null;
    compNumero: string = null;
    divSecuencial: number = 0;
    divFechaPago: string = null;
    divIrAsociado: number = 0;
    divAnioUtilidades: string = null;
    nombreConcepto: string = null;
    conCodigoCopia: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detConcepto = data.detConcepto ? data.detConcepto : this.detConcepto;
        this.detBase0 = data.detBase0 ? data.detBase0 : this.detBase0;
        this.detBaseImponible = data.detBaseImponible ? data.detBaseImponible : this.detBaseImponible;
        this.detBaseNoObjetoIva = data.detBaseNoObjetoIva ? data.detBaseNoObjetoIva : this.detBaseNoObjetoIva;
        this.detPorcentaje = data.detPorcentaje ? data.detPorcentaje : this.detPorcentaje;
        this.detValorRetenido = data.detValorRetenido ? data.detValorRetenido : this.detValorRetenido;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
        this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
        this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.divSecuencial = data.divSecuencial ? data.divSecuencial : this.divSecuencial;
        this.divFechaPago = data.divFechaPago ? data.divFechaPago : this.divFechaPago;
        this.divIrAsociado = data.divIrAsociado ? data.divIrAsociado : this.divIrAsociado;
        this.divAnioUtilidades = data.divAnioUtilidades ? data.divAnioUtilidades : this.divAnioUtilidades;
        this.nombreConcepto = data.nombreConcepto ? data.nombreConcepto : this.nombreConcepto;
        this.conCodigoCopia = data.conCodigoCopia ? data.conCodigoCopia : this.conCodigoCopia;
    }

}