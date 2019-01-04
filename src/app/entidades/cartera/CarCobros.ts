import { CarCobrosPK } from "./CarCobrosPK";
import { CarCobrosDetalleForma } from "./CarCobrosDetalleForma";
import { CarCobrosDetalleVentas } from "./CarCobrosDetalleVentas";
import { CarCobrosDetalleAnticipos } from "./CarCobrosDetalleAnticipos";

export class CarCobros {

    carCobrosPK: CarCobrosPK = new CarCobrosPK();
    cobAuxiliar: boolean = false;
    cobSaldoAnterior: number = 0;
    cobValor: number = 0;
    cobSaldoActual: number = 0;
    cliEmpresa: string = "";
    cliCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    carCobrosDetalleFormaArray: Array<CarCobrosDetalleForma> = [];
    carCobrosDetalleVentasArray: Array<CarCobrosDetalleVentas> = [];
    carCobrosDetalleAnticiposArray: Array<CarCobrosDetalleAnticipos> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.carCobrosPK = data.carCobrosPK ? data.carCobrosPK : this.carCobrosPK;
        this.cobAuxiliar = data.cobAuxiliar ? data.cobAuxiliar : this.cobAuxiliar;
        this.cobSaldoAnterior = data.cobSaldoAnterior ? this.cobSaldoAnterior : this.cobSaldoAnterior;
        this.cobValor = data.cobValor ? data.cobValor : this.cobValor;
        this.cobSaldoActual = data.cobSaldoActual ? data.cobSaldoActual : this.cobSaldoActual;
        this.cliEmpresa = data.cliEmpresa ? data.cliEmpresa : this.cliEmpresa;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo :this.cliCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo :this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.carCobrosDetalleFormaArray = data.carCobrosDetalleFormaArray ? data.carCobrosDetalleFormaArray : this.carCobrosDetalleFormaArray;
        this.carCobrosDetalleVentasArray = data.carCobrosDetalleVentasArray ? data.carCobrosDetalleVentasArray : this.carCobrosDetalleVentasArray;
        this.carCobrosDetalleAnticiposArray = data.carCobrosDetalleAnticiposArray ? data.carCobrosDetalleAnticiposArray : this.carCobrosDetalleAnticiposArray;
    }
}