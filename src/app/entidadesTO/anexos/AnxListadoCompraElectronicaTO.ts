export class AnxListadoCompraElectronicaTO {

    compPeriodo: string = "";
    compMotivo: string = "";
    compNumero: string = "";
    compProveedorRazonSocial: string = "";
    compRetencionNumero: string = "";
    compRetencionFechaEmision: string = "";
    compAutorizacionFecha: string = "";
    compAutorizacionNumero: string = "";
    email: boolean = false;
    emailEnviado: boolean = false;
    emailEntregado: boolean = false;
    emailLeido: boolean = false;
    emailRebotado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
        this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.compProveedorRazonSocial = data.compProveedorRazonSocial ? data.compProveedorRazonSocial : this.compProveedorRazonSocial;
        this.compRetencionNumero = data.compRetencionNumero ? data.compRetencionNumero : this.compRetencionNumero;
        this.compRetencionFechaEmision = data.compRetencionFechaEmision ? data.compRetencionFechaEmision : this.compRetencionFechaEmision;
        this.compAutorizacionFecha = data.compAutorizacionFecha ? data.compAutorizacionFecha : this.compAutorizacionFecha;
        this.compAutorizacionNumero = data.compAutorizacionNumero ? data.compAutorizacionNumero : this.compAutorizacionNumero;
        this.email = data.email ? data.email : this.email;
        this.emailEnviado = data.emailEnviado ? data.emailEnviado : this.emailEnviado;
        this.emailEntregado = data.emailEntregado ? data.emailEntregado : this.emailEntregado;
        this.emailLeido = data.emailLeido ? data.emailLeido : this.emailLeido;
        this.emailRebotado = data.emailRebotado ? data.emailRebotado : this.emailRebotado;
    }
}