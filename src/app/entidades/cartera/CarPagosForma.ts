import { CarPagosAnticipos } from "./CarPagosAnticipos";
import { CarPagosDetalleForma } from "./CarPagosDetalleForma";

export class CarPagosForma {

    fpSecuencial:number=null;
	fpDetalle:string="";
	fpInactivo:boolean=false;
	secEmpresa:string="";
	secCodigo:string="";
	ctaEmpresa:string="";
	ctaCodigo:string="";
	usrEmpresa:string="";
	usrCodigo:string="";
	usrFechaInserta:Date=new Date();
	carPagosAnticiposList:Array<CarPagosAnticipos>=[];
    carPagosDetalleFormaList:Array<CarPagosDetalleForma>=[];
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
        this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.carPagosAnticiposList = data.carPagosAnticiposList ? data.carPagosAnticiposList : this.carPagosAnticiposList;
        this.carPagosDetalleFormaList = data.carPagosDetalleFormaList ? data.carPagosDetalleFormaList : this.carPagosDetalleFormaList;
    }

}