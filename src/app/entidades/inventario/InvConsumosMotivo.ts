import { InvConsumosMotivoPK } from "./InvConsumosMotivoPK";

export class InvConsumosMotivo {
    invConsumosMotivoPK: InvConsumosMotivoPK = new InvConsumosMotivoPK();
    cmDetalle: String = null;
    cmSector: String = null;
    cmBodega: String = null;
    cmFormaContabilizar: String = null;
    cmInactivo: boolean = false;
    usrEmpresa: String = null;
    usrCodigo: String = null;
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invConsumosMotivoPK = data.invConsumosMotivoPK ? data.invConsumosMotivoPK : this.invConsumosMotivoPK;
        this.cmDetalle = data.cmDetalle ? data.cmDetalle : this.cmDetalle;
        this.cmSector = data.cmSector ? data.cmSector : this.cmSector;
        this.cmBodega = data.cmBodega ? data.cmBodega : this.cmBodega;
        this.cmFormaContabilizar = data.cmFormaContabilizar ? data.cmFormaContabilizar : this.cmFormaContabilizar;
        this.cmInactivo = data.cmInactivo ? data.cmInactivo : this.cmInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}