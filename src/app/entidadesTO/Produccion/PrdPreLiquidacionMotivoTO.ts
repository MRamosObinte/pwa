import { PrdPreLiquidacionMotivoPKTO } from "./PrdPreLiquidacionMotivoPKTO";

export class PrdPreLiquidacionMotivoTO {

    prdPreLiquidacionMotivoPK: PrdPreLiquidacionMotivoPKTO = new PrdPreLiquidacionMotivoPKTO();
    plmDetalle: string = "";
    plmInactivo: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {

        this.prdPreLiquidacionMotivoPK = data.prdPreLiquidacionMotivoPK ? data.prdPreLiquidacionMotivoPK : this.prdPreLiquidacionMotivoPK;
        this.plmDetalle = data.plmDetalle ? data.plmDetalle : this.plmDetalle;
        this.plmInactivo = data.plmInactivo ? data.plmInactivo : this.plmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}