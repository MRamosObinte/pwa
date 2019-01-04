export class ConsultaDatosBancoCuentaTO {
    ctaNumero: string = "";
    ctaTitular: string = "";
    banNombre: string = "";
    rutaBanco: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.ctaNumero = data.ctaNumero ? data.ctaNumero : this.ctaNumero;
        this.ctaTitular = data.ctaTitular ? data.ctaTitular : this.ctaTitular;
        this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
        this.rutaBanco = data.rutaBanco ? data.rutaBanco : this.rutaBanco;
    }
}