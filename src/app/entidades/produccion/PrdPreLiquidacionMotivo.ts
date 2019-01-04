import { PrdPreLiquidacionMotivoPK } from "./PrdPreLiquidacionMotivoPK";

export class PrdPreLiquidacionMotivo {

    prdPreLiquidacionMotivoPK: PrdPreLiquidacionMotivoPK = new PrdPreLiquidacionMotivoPK();
    plmDetalle: String = "";
    plmInactivo: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.prdPreLiquidacionMotivoPK = data.prdPreLiquidacionMotivoPK ? new PrdPreLiquidacionMotivoPK(data.prdPreLiquidacionMotivoPK) : this.prdPreLiquidacionMotivoPK;
        this.plmDetalle = data.plmDetalle ? data.plmDetalle : this.plmDetalle;
        this.plmInactivo = data.plmInactivo ? data.plmInactivo : this.plmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}