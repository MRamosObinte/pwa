import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class ProduccionCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            /**Archivo */
            case 'sector': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.LABEL_CAMINO_SECTOR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'sobrevivencia': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.LABEL_CAMINO_SOBREVIVENCIA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'piscina': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.LABEL_CAMINO_PISCINA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'corrida': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.LABEL_CAMINO_CORRIDA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'presupuestoPescaMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.PRODUCCION_PRESUPUESTO_PESCA_MOTIVO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'preLiquidacionMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.PRODUCCION_PRE_LIQUIDACION_MOTIVO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'liquidacionMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.PRODUCCION_LIQUIDACION_MOTIVO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'produccion': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'talla': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.LABEL_CAMINO_TALLA_PESCA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'producto': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.LABEL_CAMINO_PRODUCTO_PESCA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* Consultas */
            case 'kardex': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_KARDEX, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldoBodegaProd': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_SALDO_BODEGA_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldoBodegaGeneralProd': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_SALDO_BODEGA_GENERAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldoBodegaComprobacionMontosProd': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_SALDO_BODEGA_COMPROBACION_MONTOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'grameajeListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_GRAMAJE_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'analisisPesosCrecimiento': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_ANALISIS_PESOS_Y_CRECIMIENTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'resumenEconomicoPesca': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_RESUMEN_ECONOMICO_PESCA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'utilidadDiaria': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_UTILIDAD_DIARIA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosPiscina': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_COSTOS_POR_PISCINA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosPiscinaSemanal': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_COSTOS_PISCINA_SEMANAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosPiscinaMultiple': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_COSTOS_PISCINA_MULTIPLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosFechaProrrateado': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_COSTOS_FECHAS_PRORRATEADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosFecha': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_COSTOS_POR_FECHA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosMensuales': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_COSTOS_MENSUALES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosFechaSimple': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_COSTOS_POR_FECHA_SIMPLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'costosProductosProcesos': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_COSTOS_PRODUCTOS_PROCESO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosPiscina': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_PISCINA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosPiscinaPeriodo': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_PISCINA_PERIODO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosPiscinaMultiple': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_PISCINA_MULTIPLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosFecha': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_FECHA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosMensuales': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_MENSUALES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosFechaDesglosado': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_FECHA_DESGLOZADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consumosProductoProceso': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_PRODUCTOS_PROCESO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'grameajePiscinaProcesos': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_GRAMAJE_PISCINA_PROCESO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'resumenEconomicoSiembra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_RESUMEN_ECONOMICO_SIEMBRA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'resumenSiembra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_RESUMEN_SIEMBRA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'resumenPesca': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.PRODUCCION_RESUMEN_PESCA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* Transacciones*/
            case 'consumosListado': {
                camino = [
                    { label: "Producción", url: "./produccion" },
                    { label: "Transacciones", url: "" },
                    { label: "Consumo de listado", url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'grameaje': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PRODUCCION_GRAMAJE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'liquidacionPescaListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PRODUCCION_LIQUIDACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'preLiquidacionPescaListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_PRODUCCION, url: "./produccion" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PRODUCCION_PRE_LIQUIDACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            default:
                localStorage.removeItem(LS.KEY_CURRENT_BREADCRUM);
                this.sistemaService.caminoC$.next(true);
                break;
        }
    }

}