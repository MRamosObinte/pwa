export class PrdLiquidacionProductoTO {
    prodEmpresa: string = "";
    prodCodigo: string = "";
    prodDetalle: string = "";
    prodTipo: string = "";
    prodClase: string = "";
    prodInactivo: boolean = false;
    usrCodigo: string;
    usrFechaInserta: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prodEmpresa = data.prodEmpresa ? data.prodEmpresa : this.prodEmpresa;
        this.prodCodigo = data.prodCodigo ? data.prodCodigo : this.prodCodigo;
        this.prodDetalle = data.prodDetalle ? data.prodDetalle : this.prodDetalle;
        this.prodTipo = data.prodTipo ? data.prodTipo : this.prodTipo;
        this.prodClase = data.prodClase ? data.prodClase : this.prodClase;
        this.prodInactivo = data.prodInactivo ? data.prodInactivo : this.prodInactivo;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}