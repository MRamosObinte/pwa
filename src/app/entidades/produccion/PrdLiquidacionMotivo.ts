import { PrdLiquidacionMotivoPK } from "./PrdLiquidacionMotivoPK";

export class PrdLiquidacionMotivo {

    prdLiquidacionMotivoPK: PrdLiquidacionMotivoPK = new PrdLiquidacionMotivoPK();
    lmDetalle: String = "";
    lmInactivo: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdLiquidacionMotivoPK = data.prdLiquidacionMotivoPK ? new PrdLiquidacionMotivoPK(data.prdLiquidacionMotivoPK) : this.prdLiquidacionMotivoPK;
        this.lmDetalle = data.lmDetalle ? data.lmDetalle : this.lmDetalle;
        this.lmInactivo = data.lmInactivo ? data.lmInactivo : this.lmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;

    }
}