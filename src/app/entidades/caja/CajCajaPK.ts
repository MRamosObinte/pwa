export class CajCajaPK {

    cajaEmpresa: string = "";
    cajaUsuarioResponsable: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cajaEmpresa = data.cajaEmpresa ? data.cajaEmpresa : this.cajaEmpresa;
        this.cajaUsuarioResponsable = data.cajaUsuarioResponsable ? data.cajaUsuarioResponsable : this.cajaUsuarioResponsable;
    }
    
}