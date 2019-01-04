import { ConCuentas } from "../../entidades/contabilidad/ConCuentas";
import { PrdListaPiscinaTO } from "../Produccion/PrdListaPiscinaTO";
import { PrdListaSectorTO } from "../Produccion/PrdListaSectorTO";

export class ConListaContableDetalleTO {
    public id: number = null;
    public ctaCodigo: string = null;
    public ctaDetalle: string = null;
    public secCodigo: string = null;
    public pisNumero: string = null;
    public detDocumento: string = null;
    public detCreditos: number = 0;
    public detDebitos: number = 0;
    public detObservaciones: string = null;
    public detSecuencia: number = null;
    public detGenerado: boolean = false;
    public detReferencia: string = null;
    public conCuentas: ConCuentas = new ConCuentas();
    public conEstado: boolean = true;
    public conCuentaVacia: boolean = false;
    public conEstadoDebitoCreditoValido: boolean = true;
    public conChequeRepetido: boolean = false;
    public conChequeImprimir: boolean = false;
    public conFilaEstado: boolean = true;
    public piscinaSeleccionada: PrdListaPiscinaTO = new PrdListaPiscinaTO();
    public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
    public debidoCredito: string = '';
    public saldo: number = null;
    public listapiscinaSeleccionada: Array<PrdListaPiscinaTO> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.conCuentas = data.conCuentas ? data.conCuentas : this.conCuentas;
        this.conEstado = data.conEstado ? data.conEstado : this.conEstado;
        this.conFilaEstado = data.conFilaEstado ? data.conFilaEstado : this.conFilaEstado;
        this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
        this.ctaDetalle = data.ctaDetalle ? data.ctaDetalle : this.ctaDetalle;
        this.debidoCredito = data.debidoCredito ? data.debidoCredito : this.debidoCredito;
        this.detCreditos = data.detCreditos ? data.detCreditos : this.detCreditos;
        this.detDebitos = data.detDebitos ? data.detDebitos : this.detDebitos;
        this.detDocumento = data.detDocumento ? data.detDocumento : this.detDocumento;
        this.detGenerado = data.detGenerado ? data.detGenerado : this.detGenerado;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.detSecuencia = data.detSecuencia ? data.detSecuencia : this.detSecuencia;
        this.id = data.id ? data.id : this.id;
        this.listapiscinaSeleccionada = data.listapiscinaSeleccionada ? data.listapiscinaSeleccionada : this.listapiscinaSeleccionada;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.piscinaSeleccionada = data.piscinaSeleccionada ? data.piscinaSeleccionada : this.piscinaSeleccionada;
        this.saldo = data.saldo ? data.saldo : this.saldo;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.sectorSeleccionado = data.sectorSeleccionado ? data.sectorSeleccionado : this.sectorSeleccionado;
        this.conCuentaVacia = data.conCuentaVacia ? data.conCuentaVacia : this.conCuentaVacia;
        this.conEstadoDebitoCreditoValido = data.conEstadoDebitoCreditoValido ? data.conEstadoDebitoCreditoValido : this.conEstadoDebitoCreditoValido;
        this.conChequeRepetido = data.conChequeRepetido ? data.conChequeRepetido : this.conChequeRepetido;
        this.conChequeImprimir = data.conChequeImprimir ? data.conChequeImprimir : this.conChequeImprimir;
    }

}
