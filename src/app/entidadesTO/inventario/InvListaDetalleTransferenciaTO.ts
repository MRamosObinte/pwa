export class InvListaDetalleTransferenciaTO {
    detSecuencial: number = 0;
    detOrden: number = 0;
    detCantidad: number = 0;
    bodOrigenEmpresa: string = "";
    bodOrigenCodigo: string = "";
    bodDestinoEmpresa: string = "";
    bodDestinoCodigo: string = "";
    secOrigenEmpresa: string = "";
    secOrigenCodigo: string = "";
    secDestinoEmpresa: string = "";
    secDestinoCodigo: string = "";
    proEmpresa: string = "";
    proCodigoPrincipal: string = "";
    transEmpresa: string = "";
    transPeriodo: string = "";
    transMotivo: string = "";
    transNumero: string = "";
    
    proNombre: string = "";
    medDetalle: string = "";
    proCodigoPrincipalCopia: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detOrden = data.detOrden ? data.detOrden : this.detOrden;
        this.detCantidad = data.detCantidad ? data.detCantidad : this.detCantidad;
        this.bodOrigenEmpresa = data.bodOrigenEmpresa ? data.bodOrigenEmpresa : this.bodOrigenEmpresa;
        this.bodOrigenCodigo = data.bodOrigenCodigo ? data.bodOrigenCodigo : this.bodOrigenCodigo;
        this.bodDestinoEmpresa = data.bodDestinoEmpresa ? data.bodDestinoEmpresa : this.bodDestinoEmpresa;
        this.bodDestinoCodigo = data.bodDestinoCodigo ? data.bodDestinoCodigo : this.bodDestinoCodigo;
        this.secOrigenEmpresa = data.secOrigenEmpresa ? data.secOrigenEmpresa : this.secOrigenEmpresa;
        this.secOrigenCodigo = data.secOrigenCodigo ? data.secOrigenCodigo : this.secOrigenCodigo;
        this.secDestinoEmpresa = data.secDestinoEmpresa ? data.secDestinoEmpresa : this.secDestinoEmpresa;
        this.secDestinoCodigo = data.secDestinoCodigo ? data.secDestinoCodigo : this.secDestinoCodigo;
        this.proEmpresa = data.proEmpresa ? data.proEmpresa : this.proEmpresa;
        this.proCodigoPrincipal = data.proCodigoPrincipal ? data.proCodigoPrincipal : this.proCodigoPrincipal;
        this.transEmpresa = data.transEmpresa ? data.transEmpresa : this.transEmpresa;
        this.transPeriodo = data.transPeriodo ? data.transPeriodo : this.transPeriodo;
        this.transMotivo = data.transMotivo ? data.transMotivo : this.transMotivo;
        this.transNumero = data.transNumero ? data.transNumero : this.transNumero;
    }

}