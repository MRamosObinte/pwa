export class InvProductoSimpleTO {

    proEmpresa: string = "";
    proCodigoPrincipal: string = "";
    proNombre: string = "";
    proDetalle: string = "";
    proInactivo: boolean = false;
    catCodigo: string = "";
    medDetalle: string = ""; 
    medCodigo: string = "";
    medEmpresa: string = "";
    proCreditoTributarioSaldo: boolean = false;
    proIva: string = "";
    proMaximo: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.proEmpresa = data.proEmpresa ? data.proEmpresa : this.proEmpresa;
        this.proCodigoPrincipal = data.proCodigoPrincipal ? data.proCodigoPrincipal : this.proCodigoPrincipal;
        this.proNombre = data.proNombre ? data.proNombre : this.proNombre;
        this.proDetalle = data.proDetalle ? data.proDetalle : this.proDetalle;
        this.proInactivo = data.proInactivo ? data.proInactivo : this.proInactivo;
        this.catCodigo = data.catCodigo ? data.catCodigo : this.catCodigo;
        this.medDetalle = data.medDetalle ? data.medDetalle : this.medDetalle;
        this.medCodigo = data.medCodigo ? data.medCodigo : this.medCodigo;
        this.medEmpresa = data.medEmpresa ? data.medEmpresa : this.medEmpresa;
        this.proCreditoTributarioSaldo = data.proCreditoTributarioSaldo ? data.proCreditoTributarioSaldo : this.proCreditoTributarioSaldo;
        this.proIva = data.proIva ? data.proIva : this.proIva;
        this.proMaximo = data.proMaximo ? data.proMaximo : this.proMaximo;
    }
}