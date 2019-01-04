import { CarPagosAnticiposPK } from "./CarPagosAnticiposPK";
import { CarPagosForma } from "./CarPagosForma";
import { CarPagosDetalleAnticipos } from "./CarPagosDetalleAnticipos";

export class CarPagosAnticipos {

    carPagosAnticiposPK: CarPagosAnticiposPK = new CarPagosAnticiposPK();
    antValor: number = 0;
    antPagado: boolean = false;
    antAuxiliar: boolean = false;
    provEmpresa: string = "";
    provCodigo: string = "";
    secEmpresa: string = "";
    secCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    fpSecuencial: CarPagosForma = new CarPagosForma();
    carPagosDetalleAnticiposList: Array<CarPagosDetalleAnticipos> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.carPagosAnticiposPK = data.carPagosAnticiposPK ? data.carPagosAnticiposPK : this.carPagosAnticiposPK;
        this.antValor = data.antValor ? data.antValor : this.antValor;
        this.antPagado = data.antPagado ? data.antPagado : this.antPagado;
        this.antAuxiliar = data.antAuxiliar ? data.antAuxiliar : this.antAuxiliar;
        this.provEmpresa = data.provEmpresa ? data.provEmpresa : this.provEmpresa;
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.carPagosDetalleAnticiposList = data.carPagosDetalleAnticiposList ? data.carPagosDetalleAnticiposList : this.carPagosDetalleAnticiposList;
    }
}