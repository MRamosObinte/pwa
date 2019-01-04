import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class ContabilidadCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'contabilidad':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'tipoContable':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_TIPO_CONTABLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /* Archivo */
            case 'planContable':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.CONTABILIDAD_PLAN_CUENTAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'numeraciones':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.CONTABILIDAD_NUMERACIONES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'contabilizarIPPDirecto':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CONTABILIDAD_CONTABILIZAR_IPP_MATERIAL_DIRECTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'mayorAuxiliar':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_MAYOR_AUXILIAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'contabilizarIPPIndirecto':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CONTABILIDAD_CONTABILIZAR_IPP_MATERIAL_INDIRECTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'contabilizarIPPCierreCorridas':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CONTABILIDAD_CONTABILIZAR_IPP_CIERRE_CORRIDAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'mayorAuxiliarMultiple':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_MAYOR_AUXILIAR_MULTIPLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'diarioAuxiliarCuentas':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_DIARIO_AUXILIAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'verificacionFechasCompras':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_VERIFICACION_FECHA_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'verificacionContablesErrores':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_VERIFICACION_CONTABLES_ERRORES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'verificacionCuentasSobregiradas':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_VERIFICACION_CUENTAS_SOBREGIRADAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'mayorGeneral':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_MAYOR_GENERAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'contabilizarIPPTodoProceso':
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CONTABILIDAD_CONTABILIZAR_IPP_TODO_PROCESO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'balanceResultadoIntegralMensualizado': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_RESULTADO_INTEGRAL_MENSUALIZADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consultarComprobanteContable': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_CONSULTA_COMPROBANTE_CONTABLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'estadosComprobacion': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_COMPROBACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'estadoResultadoIntegralComparativo': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_RESULTADO_INTEGRAL_COMPARATIVO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'balanceResultadosVsInventario': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_RESULTADO_VS_INVENTARIO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'estadoResultadoIntegral': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_RESULTADO_INTEGRAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'estadoSituacionFinanciera': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_SITUACION_FINANCIERA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'estadoSituacionFinancieraComparativo': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CONTABILIDAD_ESTADO_SITUACION_FINANCIERA_COMPARATIVA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            //Transacciones
            case 'contabilizarCierreCuentasResultado': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CONTABILIDAD_CONTABILIZAR_CIERRE_CUENTAS_RESULTADOS, url: "" }
                ];
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'contableListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_CONTABILIDAD, url: "./contabilidad" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CONTABILIDAD_CONTABLE_LISTADO, url: "" }
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