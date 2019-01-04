export class AnxVentaTO {

    venEmpresa: string = "";
	venPeriodo: string = "";
	venMotivo: string = "";
	venNumero: string = "";
	venRetencionNumero: string = "";
	venRetencionAutorizacion: string = "";
	venRetencionFechaEmision: string = "";
	venBase0: number = 0;
	venBaseImponible: number = 0;
	venBaseNoObjetoIva: number = 0;
	venMontoIva: number = 0;
	venValorRetenidoIva: number = 0;
	venValorRetenidoRenta: number = 0;
	usrEmpresa: string = "";
	usrCodigo: string = "";
    usrFechaInserta: string = "";
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.venEmpresa = data.venEmpresa ? data.venEmpresa : this.venEmpresa;
        this.venPeriodo = data.venPeriodo ? data.venPeriodo : this.venPeriodo;
        this.venMotivo = data.venMotivo ? data.venMotivo : this.venMotivo;
        this.venNumero = data.venNumero ? data.venNumero : this.venNumero;
        this.venRetencionNumero = data.venRetencionNumero ? data.venRetencionNumero : this.venRetencionNumero;
        this.venRetencionAutorizacion = data.venRetencionAutorizacion ? data.venRetencionAutorizacion : this.venRetencionAutorizacion;
        this.venRetencionFechaEmision = data.venRetencionFechaEmision ? data.venRetencionFechaEmision : this.venRetencionFechaEmision;
        this.venBase0 = data.venBase0 ? data.venBase0 : this.venBase0;
        this.venBaseImponible = data.venBaseImponible ? data.venBaseImponible : this.venBaseImponible;
        this.venBaseNoObjetoIva = data.venBaseNoObjetoIva ? data.venBaseNoObjetoIva : this.venBaseNoObjetoIva;
        this.venMontoIva = data.venMontoIva ? data.venMontoIva : this.venMontoIva;
        this.venValorRetenidoIva = data.venValorRetenidoIva ? data.venValorRetenidoIva : this.venValorRetenidoIva;
        this.venValorRetenidoRenta = data.venValorRetenidoRenta ? data.venValorRetenidoRenta : this.venValorRetenidoRenta;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}