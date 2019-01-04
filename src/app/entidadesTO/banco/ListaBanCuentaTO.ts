export class ListaBanCuentaTO {
    id: string = "";
    banBanco: string = ""; // ban_codigo
    ctaNumero: string = "";
    ctaTitular: string = "";
    ctaOficial: string = "";
    ctaFormatoCheque: string = "";
    ctaCuentaContable: string = "";
    ctaCodigoBancario: string = "";
    ctaPrefijoBancario: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.banBanco = data.banBanco ? data.banBanco : this.banBanco;
        this.ctaNumero = data.ctaNumero ? data.ctaNumero : this.ctaNumero;
        this.ctaTitular = data.ctaTitular ? data.ctaTitular : this.ctaTitular;
        this.ctaOficial = data.ctaOficial ? data.ctaOficial : this.ctaOficial;
        this.ctaFormatoCheque = data.ctaFormatoCheque ? data.ctaFormatoCheque : this.ctaFormatoCheque;
        this.ctaCuentaContable = data.ctaCuentaContable ? data.ctaCuentaContable : this.ctaCuentaContable;
        this.ctaCodigoBancario = data.ctaCodigoBancario ? data.ctaCodigoBancario : this.ctaCodigoBancario;
        this.ctaPrefijoBancario = data.ctaPrefijoBancario ? data.ctaPrefijoBancario : this.ctaPrefijoBancario;
    }
}