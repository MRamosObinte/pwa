import { CarCobrosAnticipos } from "./CarCobrosAnticipos";
import { CarCobrosDetalleForma } from "./CarCobrosDetalleForma";

export class CarCobrosForma {

    fpSecuencial: number = null;
    fpDetalle: string = "";
    fpInactivo: boolean = false;
    secEmpresa: string = "";
    secCodigo: string = "";
    ctaEmpresa: string = "";
    ctaCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date;
    carCobrosAnticiposList: Array<CarCobrosAnticipos> = [];
    carCobrosDetalleFormaList: Array<CarCobrosDetalleForma> = [];

    constructor(data?) {
        this.hydrate(data);
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
        this.carCobrosAnticiposList = data.carCobrosAnticiposList ? data.carCobrosAnticiposList : this.carCobrosAnticiposList;
        this.carCobrosDetalleFormaList = data.carCobrosDetalleFormaList ? data.carCobrosDetalleFormaList : this.carCobrosDetalleFormaList;
    }
}