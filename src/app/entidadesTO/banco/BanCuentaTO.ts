export class BanCuentaTO {
    ctaEmpresa: string = "";
    ctaContable: string = "";
    ctaNumero: string = "";
    ctaTitular: string = "";
    ctaOficial: string = "";
    ctaCodigoBancario: string = "";
    ctaPrefijoBancario: string = "";
    ctaFormatoCheque: string = "";
    usrInsertaCuenta: string = "";
    usrInsertaEmpresa: string = "";
    usrFechaInsertaCuenta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
        this.ctaContable = data.ctaContable ? data.ctaContable : this.ctaContable;
        this.ctaNumero = data.ctaNumero ? data.ctaNumero : this.ctaNumero;
        this.ctaTitular = data.ctaTitular ? data.ctaTitular : this.ctaTitular;
        this.ctaOficial = data.ctaOficial ? data.ctaOficial : this.ctaOficial;
        this.ctaCodigoBancario = data.ctaCodigoBancario ? data.ctaCodigoBancario : this.ctaCodigoBancario;
        this.ctaPrefijoBancario = data.ctaPrefijoBancario ? data.ctaPrefijoBancario : this.ctaPrefijoBancario;
        this.ctaFormatoCheque = data.ctaFormatoCheque ? data.ctaFormatoCheque : this.ctaFormatoCheque;
        this.usrInsertaCuenta = data.usrInsertaCuenta ? data.usrInsertaCuenta : this.usrInsertaCuenta;
        this.usrInsertaEmpresa = data.usrInsertaEmpresa ? data.usrInsertaEmpresa : this.usrInsertaEmpresa;
        this.usrFechaInsertaCuenta = data.usrFechaInsertaCuenta ? data.usrFechaInsertaCuenta : this.usrFechaInsertaCuenta;
    }
}