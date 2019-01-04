import { BanCuentaPK } from "./BanCuentaPK";
import { BanConciliacion } from "./BanConciliacion";
import { BanBanco } from "./BanBanco";

export class BanCuenta {

    banCuentaPK: BanCuentaPK = new BanCuentaPK();
    ctaNumero: string = "";
    ctaTitular: string = "";
    ctaOficial: string = "";
    ctaCodigoBancario: string = "";
    ctaPrefijoBancario: string = "";
    ctaFormatoCheque: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    banBanco: BanBanco = new BanBanco();
    banConciliacionList: Array<BanConciliacion> = [];


    constructor(data) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.banCuentaPK = data.banCuentaPK ? new BanCuentaPK(data.banCuentaPK) : this.banCuentaPK;
        this.ctaNumero = data.ctaNumero ? data.ctaNumero : this.ctaNumero;
        this.ctaTitular = data.ctaTitular ? data.ctaTitular : this.ctaTitular;
        this.ctaOficial = data.ctaOficial ? data.ctaOficial : this.ctaOficial;
        this.ctaCodigoBancario = data.ctaCodigoBancario ? data.ctaCodigoBancario : this.ctaCodigoBancario;
        this.ctaPrefijoBancario = data.ctaPrefijoBancario ? data.ctaPrefijoBancario : this.ctaPrefijoBancario;
        this.ctaFormatoCheque = data.ctaFormatoCheque ? data.ctaFormatoCheque : this.ctaFormatoCheque;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.banBanco = data.banBanco ? new BanBanco(data.banBanco) : this.banBanco;
        this.banConciliacionList = data.banConciliacionList ? data.banConciliacionList : this.banConciliacionList;
    }
}