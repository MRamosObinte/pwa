import { PrdPiscinaPK } from "./PrdPiscinaPK";
import { PrdVehiculos } from "./PrdVehiculos";
import { PrdLiquidacion } from './PrdLiquidacion';
import { PrdCorrida } from "./PrdCorrida";
import { PrdGrameaje } from "./PrdGrameaje";
import { PrdSector } from "./PrdSector";

export class PrdPiscina {

    prdPiscinaPK: PrdPiscinaPK = new PrdPiscinaPK();
    pisNombre: string = "";
    pisHectareaje: number = 0;
    pisActiva: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    ctaCostoDirecto: string = "";
    ctaCostoIndirecto: string = "";
    ctaCostoTransferencia: string = "";
    ctaCostoProductoTerminado: string = "";
    prdVehiculosList: Array<PrdVehiculos> = [];
    prdLiquidacionList: Array<PrdLiquidacion> = [];
    prdCorridaList: Array<PrdCorrida> = [];
    prdGrameajeList: Array<PrdGrameaje> = [];
    prdSector: PrdSector = new PrdSector();
    

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdPiscinaPK = data.prdPiscinaPK ? new PrdPiscinaPK(data.prdPiscinaPK) : this.prdPiscinaPK;
        this.pisNombre = data.pisNombre ? data.pisNombre : this.pisNombre;
        this.pisHectareaje = data.pisHectareaje ? data.pisHectareaje : this.pisHectareaje;
        this.pisActiva = data.pisActiva ? data.pisActiva : this.pisActiva;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.ctaCostoDirecto = data.ctaCostoDirecto ? data.ctaCostoDirecto : this.ctaCostoDirecto;
        this.ctaCostoIndirecto = data.ctaCostoIndirecto ? data.ctaCostoIndirecto : this.ctaCostoIndirecto;
        this.ctaCostoTransferencia = data.ctaCostoTransferencia ? data.ctaCostoTransferencia : this.ctaCostoTransferencia;
        this.ctaCostoProductoTerminado = data.ctaCostoProductoTerminado ? data.ctaCostoProductoTerminado : this.ctaCostoProductoTerminado;
        this.prdVehiculosList = data.prdVehiculosList ? data.prdVehiculosList : this.prdVehiculosList;
        this.prdLiquidacionList = data.prdLiquidacionList ? data.prdLiquidacionList : this.prdLiquidacionList;
        this.prdCorridaList = data.prdCorridaList ? data.prdCorridaList : this.prdCorridaList;
        this.prdGrameajeList = data.prdGrameajeList ? data.prdGrameajeList : this.prdGrameajeList;
        this.prdSector = data.prdSector ? data.prdSector : this.prdSector;
    }

}