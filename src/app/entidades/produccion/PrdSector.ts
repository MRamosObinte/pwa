import { PrdSectorPK } from './PrdSectorPK';
import { PrdSobrevivencia } from './PrdSobrevivencia';
import { PrdPiscina } from './PrdPiscina';
export class PrdSector {

    prdSectorPK: PrdSectorPK = new PrdSectorPK();
    secNombre: String = "";
    secLatitud: String = "";
    secLongitud: String = "";
    secActivo: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();
    prdSobrevivenciaList: Array<PrdSobrevivencia> = [];
    prdPiscinaList: Array<PrdPiscina> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdSectorPK = data.prdSectorPK ? data.prdSectorPK : this.prdSectorPK;
        this.secNombre = data.secNombre ? data.secNombre : this.secNombre;
        this.secLatitud = data.secLatitud ? data.secLatitud : this.secLatitud;
        this.secLongitud = data.secLongitud ? data.secLongitud : this.secLongitud;
        this.secActivo = data.secActivo ? data.secActivo : this.secActivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdSobrevivenciaList = data.prdSobrevivenciaList ? data.prdSobrevivenciaList : this.prdSobrevivenciaList;
        this.prdPiscinaList = data.prdPiscinaList ? data.prdPiscinaList : this.prdPiscinaList;
    }

}