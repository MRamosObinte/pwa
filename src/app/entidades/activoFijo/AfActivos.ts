import { AfActivosPK } from './AfActivosPK';
import { AfUbicaciones } from "./AfUbicaciones";
import { PrdSector } from "../produccion/PrdSector";
import { AfCategorias } from "./AfCategorias";
import { AfActivosDatosAdjuntos } from "./AfActivosDatosAdjuntos";
import { AfDepreciaciones } from "./AfDepreciaciones";

export class AfActivos {

    afActivosPK: AfActivosPK = new AfActivosPK();
    afDescripcion: string = "";
    afFechaAdquisicion: Date = new Date();
    afValorAdquision: number = 0;
    afValorResidual: number = 0;
    afDepreciacionInicialMonto: number = 0;
    afDepreciacionInicialMeses: number = 0;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    afUbicaciones: AfUbicaciones = new AfUbicaciones();
    prdSector: PrdSector = new PrdSector();
    afCategorias: AfCategorias = new AfCategorias();
    afActivosDatosAdjuntosList: Array<AfActivosDatosAdjuntos> = [];
    afDepreciacionesList: Array<AfDepreciaciones> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.afActivosPK = data.AfActivosPK ? new AfActivosPK(data.afActivosPK) : this.afActivosPK;
        this.afDescripcion = data.afDescripcion ? data.afDescripcion : this.afDescripcion;
        this.afFechaAdquisicion = data.afFechaAdquisicion ? data.afFechaAdquisicion : this.afFechaAdquisicion;
        this.afValorAdquision = data.afValorAdquision ? data.afValorAdquision : this.afValorAdquision;
        this.afValorResidual = data.afValorResidual ? data.afValorResidual : this.afValorResidual;
        this.afDepreciacionInicialMonto = data.afDepreciacionInicialMonto ? data.afDepreciacionInicialMonto : this.afDepreciacionInicialMonto;
        this.afDepreciacionInicialMeses = data.afDepreciacionInicialMeses ? data.afDepreciacionInicialMeses : this.afDepreciacionInicialMeses;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.afUbicaciones = data.afUbicaciones ? new AfUbicaciones(data.afUbicaciones) : this.afUbicaciones;
        this.prdSector = data.prdSector ? new PrdSector(data.prdSector) : this.prdSector;
        this.afCategorias = data.afCategorias ? new AfCategorias(data.afCategorias) : this.afCategorias;
        this.afActivosDatosAdjuntosList = data.afActivosDatosAdjuntosList ? data.afActivosDatosAdjuntosList : this.afActivosDatosAdjuntosList;
        this.afDepreciacionesList = data.afDepreciacionesList ? data.afDepreciacionesList : this.afDepreciacionesList;
    }
    
}