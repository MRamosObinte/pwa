import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class RrhhCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'talentoHumano':
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /* Archivo */
            case 'categoria': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CATEGORIA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'bonoMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_MOTIVO_BONOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'conceptoBono': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CONCEPTO_BONOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'prestamoMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_MOTIVO_PRESTAMO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'anticipoMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_MOTIVO_ACTICIPO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'formaPago': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_FORMA_PAGO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'formaPagoBeneficioSocial': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_FORMA_PAGO_BENEFICIOS_SOCIALES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'empleadoListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_EMPLEADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'rolMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_MOTIVO_ROL_PAGO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'xiiiSueldoMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_MOTIVO_DECIMO_TERCER_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'xivSueldoMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.RRHH_ARCHIVO_MOTIVO_XIV_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'utilidadMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.RRHH_ARCHIVO_MOTIVO_UTILIDAD, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'periodoUtilidad': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.RRHH_ARCHIVO_PERIODO_UTILIDAD, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'periodoXiiiSueldo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.RRHH_ARCHIVO_PERIODO_XIII_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'periodoXivSueldo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.RRHH_ARCHIVO_PERIODO_XIV_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /**Consultas */
            case 'consolidadoIngresos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_CONSOLIDADO_INGRESOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'anticipoDetalle': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_DETALLE_ANTICIPO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'anticipoDetalleLote': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SOPORTE_CONTABLE_ANTICIPO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'prestamoDetalle': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_DETALLE_PRESTAMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'anticipoPrestamoDetalle': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_DETALLE_ANTICIPOS_PRESTAMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'bonoDetalle': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_DETALLE_BONO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'bonoDetalleLote': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SOPORTE_CONTABLE_BONOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consolidadosBonosViaticos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TALENTO_HUMANO_CONSOLIDADO_BONOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'prestamoDetalle': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_DETALLE_PRESTAMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consolidadosAnticiposPrestamos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_CONSOLIDADO_ANTICIPOS_PRESTAMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldosConsolidadosBonosViaticos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./rrhh" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SALDOS_CONSOLIDADOS_BONOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'xiiiSueldoListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_XIII_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'xivSueldoListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_XIV_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'utilidadesPreCalculo': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_UTILIDADES_PRECALCULO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldosConsolidadosSueldosPorPagar': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SALDO_CONSOLIDADO_SUELDO_PAGAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consolidadoIngresosTabulado': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_CONSOLIDADO_INGRESOS_TABULADOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consolidadoRol': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_CONSOLIDADO_ROL_PAGO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'detalleVacacionesPagadas': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_VACACIONES_PAGADAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'rolListado': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_ROL_PAGO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'detalleVacacionesGozadas': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_VACACIONES_GOZADAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldosConsolidadosAnticiposPrestamos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SALDO_CONSOLIDADO_ANTICIPOS_PRESTAMOS, url: "" }

                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionPorFechaXiv': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_PROVISIONES_POR_FECHA_XVI, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldosIndividualAnticipos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SALDO_INDIVIDUAL_ANTICIPOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionPorFechaXiii': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_PROVISIONES_POR_FECHA_XIII, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldosIndividualPrestamos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SALDO_INDIVIDUAL_PRESTAMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionPorFechaSecap': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_PROVISIONES_POR_FECHA_SECAP, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'saldosIndividualAnticiposPrestamos': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_SALDO_INDIVIDUAL_ANTICIPOS_PRESTAMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionPorFechaIece': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_PROVISIONES_POR_FECHA_IECE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionesComprobanteContable': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_PROVISIONES_COMPROBANTES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionPorFechaAportePatronal': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_PROVISIONES_POR_FECHA_AP, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'empleadoListadoExportar': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.RRHH_LISTADO_EMPLEADOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /**Transacciones */
            case 'bonoListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.RRHH_BONOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'xiiiSueldoListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.RRHH_XIII_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'xivSueldoListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.RRHH_XIV_SUELDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'anticipoListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_ANTICIPOS_EMPLEADOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'utilidadListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_PARTICIPACION_UTILIDADES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'contableListadoRRHHTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_CONTABLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'prestamoListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_PRESTAMO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'provisionesListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_PROVISIONES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'ordenesBancarias': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_ORDENES_BANCARIAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'chequesNoImpresosTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_NO_IMPRESOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'rolListadoTrans': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_ROL_DE_PAGOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'liquidacion': {
                camino = [
                    { label: LS.LABEL_CAMINO_TALENTO_HUMANO, url: "./talentoHumano" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TALENTO_HUMANO_LIQUIDACION, url: "" }
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