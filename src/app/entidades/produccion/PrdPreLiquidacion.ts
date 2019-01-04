import { PrdPreLiquidacionPK } from "./PrdPreLiquidacionPK";
import { InvCliente } from '../inventario/InvCliente';
import { PrdPiscina } from "./PrdPiscina";
import { PrdPreLiquidacionDetalle } from "./PrdPreLiquidacionDetalle";
import { PrdCorrida } from "./PrdCorrida";

export class PrdPreLiquidacion {

    prdPreLiquidacionPK: PrdPreLiquidacionPK = new PrdPreLiquidacionPK();
    plLote: string = "";
    plFecha: any = new Date();
    plLibrasEnviadas: number = 0;
    plLibrasRecibidas: number = 0;
    plLibrasBasura: number = 0;
    plLibrasRetiradas: number = 0;
    plLibrasNetas: number = 0;
    plLibrasEntero: number = 0;
    plLibrasCola: number = 0;
    plLibrasColaProcesadas: number = 0;
    plAnimalesCosechados: number = 0;
    plTotalMonto: number = 0;
    plPendiente: boolean = false;
    plAnulado: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    invCliente: InvCliente = new InvCliente();
    prdPiscina: PrdPiscina = new PrdPiscina();
    prdPreLiquidacionDetalleList: Array<PrdPreLiquidacionDetalle> = [];
    prdCorrida: PrdCorrida = new PrdCorrida();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdPreLiquidacionPK = data.prdPreLiquidacionPK ? new PrdPreLiquidacionPK(data.prdPreLiquidacionPK) : this.prdPreLiquidacionPK;
        this.plLote = data.plLote ? data.plLote : this.plLote;
        this.plFecha = data.plFecha ? data.plFecha : this.plFecha;
        this.plLibrasEnviadas = data.plLibrasEnviadas ? data.plLibrasEnviadas : this.plLibrasEnviadas;
        this.plLibrasRecibidas = data.plLibrasRecibidas ? data.plLibrasRecibidas : this.plLibrasRecibidas;
        this.plLibrasBasura = data.plLibrasBasura ? data.plLibrasBasura : this.plLibrasBasura;
        this.plLibrasRetiradas = data.plLibrasRetiradas ? data.plLibrasRetiradas : this.plLibrasRetiradas;
        this.plLibrasNetas = data.plLibrasNetas ? data.plLibrasNetas : this.plLibrasNetas;
        this.plLibrasEntero = data.plLibrasEntero ? data.plLibrasEntero : this.plLibrasEntero;
        this.plLibrasCola = data.plLibrasCola ? data.plLibrasCola : this.plLibrasCola;
        this.plLibrasColaProcesadas = data.plLibrasColaProcesadas ? data.plLibrasColaProcesadas : this.plLibrasColaProcesadas;
        this.plAnimalesCosechados = data.plAnimalesCosechados ? data.plAnimalesCosechados : this.plAnimalesCosechados;
        this.plTotalMonto = data.plTotalMonto ? data.plTotalMonto : this.plTotalMonto;
        this.plPendiente = data.plPendiente ? data.plPendiente : this.plPendiente;
        this.plAnulado = data.plAnulado ? data.plAnulado : this.plAnulado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invCliente = data.invCliente ? new InvCliente(data.invCliente) : this.invCliente;
        this.prdPiscina = data.prdPiscina ? new PrdPiscina(data.prdPiscina) : this.prdPiscina;
        this.prdPreLiquidacionDetalleList = data.prdPreLiquidacionDetalleList ? data.prdPreLiquidacionDetalleList : this.prdPreLiquidacionDetalleList;
        this.prdCorrida = data.prdCorrida ? data.prdCorrida : this.prdCorrida;
    }

}