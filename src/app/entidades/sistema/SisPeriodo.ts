import { SisPeriodoPK } from "./SisPeriodoPK";
import { SisEmpresa } from "./SisEmpresa";

export class SisPeriodo {

    public sisPeriodoPK: SisPeriodoPK = new SisPeriodoPK();
    public perDetalle: string = "";
    public perDesde: Date = new Date();
    public perHasta: Date = new Date();
    public perCerrado: boolean = false;
    public usrCodigo: string = "";
    public usrFechaInsertaPeriodo: Date = new Date();
    public empCodigo: SisEmpresa = new SisEmpresa();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.sisPeriodoPK = data.sisPeriodoPK ? data.sisPeriodoPK : this.sisPeriodoPK;
        this.perDetalle = data.perDetalle ? data.perDetalle : this.perDetalle;
        this.perDesde = data.perDesde ? data.perDesde : this.perDesde;
        this.perHasta = data.perHasta ? data.perHasta : this.perHasta;
        this.perCerrado = data.perCerrado ? data.perCerrado : this.perCerrado;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaPeriodo = data.usrFechaInsertaPeriodo ? data.usrFechaInsertaPeriodo : this.usrFechaInsertaPeriodo;
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
    }
}