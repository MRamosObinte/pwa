import { AfUbicacionesTO } from "./AfUbicacionesTO";
import { AfCategoriasTO } from "./AfCategoriasTO";
import { PrdListaSectorTO } from "../Produccion/PrdListaSectorTO";

export class AfActivoTO {
    public afEmpresa: string = "";
    public afCodigo: string = "";
    public afDescripcion: string = "";
    public afFechaAdquisicion: Date = new Date();
    public afValorAdquision: number = 0;
    public afValorResidual: number = 0;
    public afDepreciacionInicialMonto: number = 0;
    public afDepreciacionInicialMeses: number = 0;
    public usrEmpresa: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: Date = new Date();
    public afUbicaciones: AfUbicacionesTO = new AfUbicacionesTO();
    public prdListaSectorTO: PrdListaSectorTO = new PrdListaSectorTO();
    public afCategorias: AfCategoriasTO = new AfCategoriasTO();
    public sectorDescripcion: string = null;
    public categoriaDescripcion: string = null;
    public ubicacionDescripcion: string = null;
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.afEmpresa = data.afEmpresa ? data.afEmpresa : this.afEmpresa;
        this.afCodigo = data.afCodigo ? data.afCodigo : this.afCodigo;
        this.afDescripcion = data.afDescripcion ? data.afDescripcion : this.afDescripcion;
        this.afFechaAdquisicion = data.afFechaAdquisicion ? data.afFechaAdquisicion : this.afFechaAdquisicion;
        this.afValorAdquision = data.afValorAdquision ? data.afValorAdquision : this.afValorAdquision;
        this.afValorResidual = data.afValorResidual ? data.afValorResidual : this.afValorResidual;
        this.afDepreciacionInicialMonto = data.afDepreciacionInicialMonto ? data.afDepreciacionInicialMonto : this.afDepreciacionInicialMonto;
        this.afDepreciacionInicialMeses = data.afDepreciacionInicialMeses ? data.afDepreciacionInicialMeses : this.afDepreciacionInicialMeses;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.afUbicaciones = data.afUbicaciones ? data.afUbicaciones : this.afUbicaciones;
        this.prdListaSectorTO = data.prdListaSectorTO ? data.prdListaSectorTO : this.prdListaSectorTO;
        this.afCategorias = data.afCategorias ? data.afCategorias : this.afCategorias;
        this.sectorDescripcion = data.sectorDescripcion ? data.sectorDescripcion : this.sectorDescripcion;
        this.categoriaDescripcion = data.categoriaDescripcion ? data.categoriaDescripcion : this.categoriaDescripcion;
        this.ubicacionDescripcion = data.ubicacionDescripcion ? data.ubicacionDescripcion : this.ubicacionDescripcion;
    }

}