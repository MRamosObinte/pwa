import { ConTipoPK } from "./ConTipoPK";

export class ConTipo {
    public conTipoPK: ConTipoPK = new ConTipoPK();
    public tipDetalle: string = null;
    public tipInactivo: boolean = false;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.conTipoPK = data.conTipoPK ? data.conTipoPK : this.conTipoPK;
        this.tipDetalle = data.tipDetalle ? data.tipDetalle : this.tipDetalle;
        this.tipInactivo = data.tipInactivo ? data.tipInactivo : this.tipInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}