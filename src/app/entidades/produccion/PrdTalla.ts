import { PrdTallaPK } from './PrdTallaPK';
import { PrdLiquidacionDetalle } from './PrdLiquidacionDetalle';
export class PrdTalla {

    prdLiquidacionTallaPK: PrdTallaPK = new PrdTallaPK();
    tallaDetalle: string = "";
    tallaGramosDesde: number = 0;
    tallaGramosHasta: number = 0;
    tallaPrecio: number = 0;
    tallaUnidadMedida: string = "";
    tallaInactivo: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    prdLiquidacionDetalleList: Array<PrdLiquidacionDetalle> = []

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdLiquidacionTallaPK = data.prdLiquidacionTallaPK ? new PrdTallaPK(data.prdLiquidacionTallaPK) : this.prdLiquidacionTallaPK;
        this.tallaDetalle = data.tallaDetalle ? data.tallaDetalle : this.tallaDetalle;
        this.tallaGramosDesde = data.tallaGramosDesde ? data.tallaGramosDesde : this.tallaGramosDesde;
        this.tallaGramosHasta = data.tallaGramosHasta ? data.tallaGramosHasta : this.tallaGramosHasta;
        this.tallaPrecio = data.tallaPrecio ? data.tallaPrecio : this.tallaPrecio;
        this.tallaUnidadMedida = data.tallaUnidadMedida ? data.tallaUnidadMedida : this.tallaUnidadMedida;
        this.tallaInactivo = data.tallaInactivo ? data.tallaInactivo : this.tallaInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdLiquidacionDetalleList = data.prdLiquidacionDetalleList ? data.prdLiquidacionDetalleList : this.prdLiquidacionDetalleList;
    }
}