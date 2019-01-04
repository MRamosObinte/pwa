import { AfCategoriasPK } from "./AfCategoriasPK";
import { AfActivos } from "./AfActivos";

export class AfCategorias {

    afCategoriasPK: AfCategoriasPK = new AfCategoriasPK();
    catDescripcion: string = "";
    catVidaUtil: number = 0;
    catPorcentajeDepreciacion: number = 0;
    catInactivo: boolean;
    catCuentaActivo: string = "";
    catCuentaDepreciacion: string = "";
    catCuentaDepreciacionAcumulada: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    afActivosList: Array<AfActivos> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.afCategoriasPK = data.afCategoriasPK ? new AfCategoriasPK(data.afCategoriasPK) : this.afCategoriasPK;
        this.catDescripcion = data.catDescripcion ? data.catDescripcion : this.catDescripcion;
        this.catPorcentajeDepreciacion = data.catPorcentajeDepreciacion ? data.catPorcentajeDepreciacion : this.catPorcentajeDepreciacion;
        this.catInactivo = data.catInactivo ? data.catInactivo : this.catInactivo;
        this.catCuentaActivo = data.catCuentaActivo ? data.catCuentaActivo : this.catCuentaActivo;
        this.catCuentaDepreciacion = data.catCuentaDepreciacion ? data.catCuentaDepreciacion : this.catCuentaDepreciacion;
        this.catCuentaDepreciacionAcumulada = data.catCuentaDepreciacionAcumulada ? data.catCuentaDepreciacionAcumulada : this.catCuentaDepreciacionAcumulada;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.afActivosList = data.afActivosList ? data.afActivosList : this.afActivosList;
    }

}