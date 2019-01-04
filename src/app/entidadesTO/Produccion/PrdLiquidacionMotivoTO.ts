import { PrdLiquidacionMotivoTOPK } from "./PrdLiquidacionMotivoTOPK";

export class PrdLiquidacionMotivoTO {

    prdLiquidacionMotivoPK: PrdLiquidacionMotivoTOPK = new PrdLiquidacionMotivoTOPK();
    lmDetalle: string = "";
    lmInactivo: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {

        this.prdLiquidacionMotivoPK = data.prdLiquidacionMotivoPK ? data.prdLiquidacionMotivoPK : this.prdLiquidacionMotivoPK;
        this.lmDetalle = data.lmDetalle ? data.lmDetalle : this.lmDetalle;
        this.lmInactivo = data.lmInactivo ? data.lmInactivo : this.lmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}