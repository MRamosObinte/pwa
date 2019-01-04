import { PrdCorridaPK } from './PrdCorridaPK';
import { PrdPiscina } from "./PrdPiscina";
import { PrdCorridaDetalle } from "./PrdCorridaDetalle";
import { ConContable } from "../contabilidad/ConContable";
export class PrdCorrida {

    prdCorridaPK: PrdCorridaPK = new PrdCorridaPK();
    corHectareas: number = null;
    corFechaDesde: any = new Date();
    corFechaSiembra: any = null;
    corFechaPesca: any = null;
    corFechaHasta: any = null;
    corTipoSiembra: string = null;
    corNumeroLarvas: number = null;
    corLaboratorio: string = "";
    corNauplio: string = "";
    corPellet: number = null;
    corBiomasa: number = null;
    corCostoDirecto: number = null;
    corCostoIndirecto: number = null;
    corCostoTransferencia: number = null;
    corValorVenta: number = null;
    corObservaciones: string = "";
    corActiva: boolean = false;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = null;
    prdPiscina: PrdPiscina = new PrdPiscina();
    prdCorridaDetalleList: Array<PrdCorridaDetalle> = [];
    conContable: ConContable = new ConContable();

    

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdCorridaPK = data.prdCorridaPK ? new PrdCorridaPK(data.prdCorridaPK) : this.prdCorridaPK;
        this.corHectareas = data.corHectareas ? data.corHectareas : this.corHectareas;
        this.corFechaDesde = data.corFechaDesde ? data.corFechaDesde : this.corFechaDesde;
        this.corFechaSiembra = data.corFechaSiembra ? data.corFechaSiembra : this.corFechaSiembra;
        this.corFechaPesca = data.corFechaPesca ? data.corFechaPesca : this.corFechaPesca;
        this.corFechaHasta = data.corFechaHasta ? data.corFechaHasta : this.corFechaHasta;
        this.corTipoSiembra = data.corTipoSiembra ? data.corTipoSiembra : this.corTipoSiembra;
        this.corNumeroLarvas = data.corNumeroLarvas ? data.corNumeroLarvas : this.corNumeroLarvas;
        this.corLaboratorio = data.corLaboratorio ? data.corLaboratorio : this.corLaboratorio;
        this.corNauplio = data.corNauplio ? data.corNauplio : this.corNauplio;
        this.corPellet = data.corPellet ? data.corPellet : this.corPellet;
        this.corBiomasa = data.corBiomasa ? data.corBiomasa : this.corBiomasa;
        this.corCostoDirecto = data.corCostoDirecto ? data.corCostoDirecto : this.corCostoDirecto;
        this.corCostoIndirecto = data.corCostoIndirecto ? data.corCostoIndirecto : this.corCostoIndirecto;
        this.corCostoTransferencia = data.corCostoTransferencia ? data.corCostoTransferencia : this.corCostoTransferencia;
        this.corValorVenta = data.corValorVenta ? data.corValorVenta : this.corValorVenta;
        this.corObservaciones = data.corObservaciones ? data.corObservaciones : this.corObservaciones;
        this.corActiva = data.corActiva ? data.corActiva : this.corActiva;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdPiscina = data.prdPiscina ? new PrdPiscina(data.prdPiscina) : this.prdPiscina;
        this.prdCorridaDetalleList = data.prdCorridaDetalleList ? data.prdCorridaDetalleList : this.prdCorridaDetalleList;
        this.conContable = data.conContable ? new ConContable(data.conContable) : this.conContable;
    }

}