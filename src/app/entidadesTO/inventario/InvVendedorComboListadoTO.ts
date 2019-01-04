export class InvVendedorComboListadoTO {

    vendEmpresa: string = "";
    vendCodigo: string = "";
    vendNombre: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vendEmpresa = data.vendEmpresa ? data.vendEmpresa : this.vendEmpresa;
        this.vendCodigo = data.vendCodigo ? data.vendCodigo : this.vendCodigo;
        this.vendNombre = data.vendNombre ? data.vendNombre : this.vendNombre;
    }

}