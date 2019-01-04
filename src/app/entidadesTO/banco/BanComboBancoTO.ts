export class BanComboBancoTO {
    banNombre: string = "";
    ctaNumero: string = "";
    ctaTitular: string = "";
    ctaContable: string = "";
    ctaCodigoBancario: string = "";
    ctaPrefijoBancario: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
        this.ctaNumero = data.ctaNumero ? data.ctaNumero : this.ctaNumero;
        this.ctaTitular = data.ctaTitular ? data.ctaTitular : this.ctaTitular;
        this.ctaContable = data.ctaContable ? data.ctaContable : this.ctaContable;
        this.ctaCodigoBancario = data.ctaCodigoBancario ? data.ctaCodigoBancario : this.ctaCodigoBancario;
        this.ctaPrefijoBancario = data.ctaPrefijoBancario ? data.ctaPrefijoBancario : this.ctaPrefijoBancario;
    }
}