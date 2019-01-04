import { CarPagosDetalleCompras } from "./CarPagosDetalleCompras";
import { CarPagosDetalleAnticipos } from "./CarPagosDetalleAnticipos";
import { CarPagosDetalleForma } from "./CarPagosDetalleForma";
import { CarPagosPK } from "./CarPagosPK";

export class CarPagos {

    carPagosPK: CarPagosPK = new CarPagosPK();
    pagAuxiliar: boolean = false;
    pagSaldoAnterior: number = 0;
    pagValo: number = 0;
    pagSaldoActual: number = 0;
    provEmpresa: string = "";
    provCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    carPagosDetalleComprasList: Array<CarPagosDetalleCompras> = [];
    carPagosDetalleAnticiposList: Array<CarPagosDetalleAnticipos> = [];
    carPagosDetalleFormaList: Array<CarPagosDetalleForma> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.carPagosPK = data.carPagosPK ? data.carPagosPK : this.carPagosPK;
        this.pagAuxiliar = data.pagAuxiliar ? data.pagAuxiliar : this.pagAuxiliar;
        this.pagSaldoAnterior = data.pagSaldoAnterior ? data.pagSaldoAnterior : this.pagSaldoAnterior;
        this.pagValo = data.pagValo ? data.pagValo : this.pagValo;
        this.pagSaldoActual = data.pagSaldoActual ? data.pagSaldoActual : this.pagSaldoActual;
        this.provEmpresa = data.provEmpresa ? data.provEmpresa : this.provEmpresa;
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.carPagosDetalleComprasList = data.carPagosDetalleComprasList ? data.carPagosDetalleComprasList : this.carPagosDetalleComprasList;
        this.carPagosDetalleAnticiposList = data.carPagosDetalleAnticiposList ? data.carPagosDetalleAnticiposList : this.carPagosDetalleAnticiposList;
        this.carPagosDetalleFormaList = data.carPagosDetalleFormaList ? data.carPagosDetalleFormaList : this.carPagosDetalleFormaList;
    }
}