import { PrdLiquidacionPK } from "./PrdLiquidacionPK";
import { PrdPiscina } from './PrdPiscina';
import { InvCliente } from "../inventario/InvCliente";
import { PrdLiquidacionDetalle } from './PrdLiquidacionDetalle';
import { PrdCorrida } from "./PrdCorrida";

export class PrdLiquidacion {

    prdLiquidacionPK: PrdLiquidacionPK = new PrdLiquidacionPK();
    liqLote: string = null;
    liqFecha: any;
    liqLibrasEnviadas: number = 0;
    liqLibrasRecibidas: number = 0;
    liqLibrasBasura: number = 0;
    liqLibrasRetiradas: number = 0;
    liqLibrasNetas: number = 0;
    liqLibrasEntero: number = 0;
    liqLibrasCola: number = 0;
    liqLibrasColaProcesadas: number = 0;
    liqAnimalesCosechados: number = 0;
    liqTotalMonto: number = 0;
    liqPendiente: boolean = false;
    liqAnulado: boolean = false;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: Date = new Date();
    prdPiscina: PrdPiscina = new PrdPiscina();
    invCliente: InvCliente = new InvCliente();
    prdLiquidacionDetalleList: Array<PrdLiquidacionDetalle> = [];
    prdCorrida: PrdCorrida = new PrdCorrida();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdLiquidacionPK = data.prdLiquidacionPK ? data.prdLiquidacionPK : this.prdLiquidacionPK;
        this.liqLote = data.liqLote ? data.liqLote : this.liqLote;
        this.liqFecha = data.liqFecha ? data.liqFecha : this.liqFecha;
        this.liqLibrasEnviadas = data.liqLibrasEnviadas ? data.liqLibrasEnviadas : this.liqLibrasEnviadas;
        this.liqLibrasRecibidas = data.liqLibrasRecibidas ? data.liqLibrasRecibidas : this.liqLibrasRecibidas;
        this.liqLibrasBasura = data.liqLibrasBasura ? data.liqLibrasBasura : this.liqLibrasBasura;
        this.liqLibrasRetiradas = data.liqLibrasRetiradas ? data.liqLibrasRetiradas : this.liqLibrasRetiradas;
        this.liqLibrasNetas = data.liqLibrasNetas ? data.liqLibrasNetas : this.liqLibrasNetas;
        this.liqLibrasEntero = data.liqLibrasEntero ? data.liqLibrasEntero : this.liqLibrasEntero;
        this.liqLibrasCola = data.liqLibrasCola ? data.liqLibrasCola : this.liqLibrasCola;
        this.liqLibrasColaProcesadas = data.liqLibrasColaProcesadas ? data.liqLibrasColaProcesadas : this.liqLibrasColaProcesadas;
        this.liqAnimalesCosechados = data.liqAnimalesCosechados ? data.liqAnimalesCosechados : this.liqAnimalesCosechados;
        this.liqTotalMonto = data.liqTotalMonto ? data.liqTotalMonto : this.liqTotalMonto;
        this.liqPendiente = data.liqPendiente ? data.liqPendiente : this.liqPendiente;
        this.liqAnulado = data.liqAnulado ? data.liqAnulado : this.liqAnulado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdPiscina = data.prdPiscina ? new PrdPiscina(data.prdPiscina) : this.prdPiscina;
        this.invCliente = data.invCliente ? new InvCliente(data.invCliente) : this.invCliente;
        this.prdLiquidacionDetalleList = data.prdLiquidacionDetalleList ? data.prdLiquidacionDetalleList : this.prdLiquidacionDetalleList;
        this.prdCorrida = data.prdCorrida ? data.prdCorrida : this.prdCorrida;
    }

}