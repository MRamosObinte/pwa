import { CarCobrosAnticiposPK } from "./CarCobrosAnticiposPK";
import { CarCobrosDetalleAnticipos } from "./CarCobrosDetalleAnticipos";
import { CarCobrosForma } from "./CarCobrosForma";

export class CarCobrosAnticipos {

    carCobrosAnticiposPK: CarCobrosAnticiposPK = new CarCobrosAnticiposPK();;
    antValor: number = 0;
    antCobrado: boolean = false;
    antAuxiliar: boolean = false;
    cliEmpresa: string = "";
    cliCodigo: string = "";
    secEmpresa: string = "";
    secCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    fpSecuencial: CarCobrosForma = new CarCobrosForma();
    carCobrosDetalleAnticiposList: Array<CarCobrosDetalleAnticipos> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.carCobrosAnticiposPK = data.carCobrosAnticiposPK ? data.carCobrosAnticiposPK : this.carCobrosAnticiposPK;
        this.antValor = data.antValor ? data.antValor : this.antValor;
        this.antCobrado = data.antCobrado ? data.antCobrado : this.antCobrado;
        this.antAuxiliar = data.antAuxiliar ? data.antAuxiliar : this.antAuxiliar;
        this.cliEmpresa = data.cliEmpresa ? data.cliEmpresa : this.cliEmpresa;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.carCobrosDetalleAnticiposList = data.carCobrosDetalleAnticiposList ? data.carCobrosDetalleAnticiposList : this.carCobrosDetalleAnticiposList;
    }
}