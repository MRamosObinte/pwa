import { PrdProductoPK } from './PrdProductoPK';
import { PrdLiquidacionDetalle } from './PrdLiquidacionDetalle';
export class PrdProducto {

    prdLiquidacionProductoPK: PrdProductoPK = new PrdProductoPK();
    prodDetalle: string = "";
    prodTipo: string = "";
    prodClase: string = "";
    prodInactivo: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    prdLiquidacionDetalleList: Array<PrdLiquidacionDetalle> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdLiquidacionProductoPK = data.prdLiquidacionProductoPK ? new PrdProductoPK(data.prdLiquidacionProductoPK) : this.prdLiquidacionProductoPK;
        this.prodDetalle = data.prodDetalle ? data.prodDetalle : this.prodDetalle;
        this.prodTipo = data.prodTipo ? data.prodTipo : this.prodTipo;
        this.prodClase = data.prodClase ? data.prodClase : this.prodClase;
        this.prodInactivo = data.prodInactivo ? data.prodInactivo : this.prodInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdLiquidacionDetalleList = data.prdLiquidacionDetalleList ? data.prdLiquidacionDetalleList : this.prdLiquidacionDetalleList;
    }
    
}