import { BanBancoPK } from "./BanBancoPK";
import { BanCuenta } from "./BanCuenta";

export class BanBanco {
    banBancoPK: BanBancoPK = new BanBancoPK();
    banNombre: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    banCuentaList: Array<BanCuenta> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.banBancoPK = data.banBancoPK ? new BanBancoPK(data.banBancoPK) : this.banBancoPK;
        this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.banCuentaList = data.banCuentaList ? data.banCuentaList : this.banCuentaList;
    }
}