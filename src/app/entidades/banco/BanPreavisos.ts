import { BanPreavisosPK } from "./BanPreavisosPK";

export class BanPreavisos {

    banPreavisosPK: BanPreavisosPK = new BanPreavisosPK();
    preFechaRevisionUltimoCheque: Date = new Date();
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();


    constructor(data) {
        data ? this.hydrate(data) : null
    }
    hydrate(data) {
        this.banPreavisosPK = data.banPreavisosPK ? new BanPreavisosPK(data.banPreavisosPK) : this.banPreavisosPK;
        this.preFechaRevisionUltimoCheque = data.preFechaRevisionUltimoCheque ? data.preFechaRevisionUltimoCheque : this.preFechaRevisionUltimoCheque;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}