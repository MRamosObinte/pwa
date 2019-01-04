import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class TributacionCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'tributacion': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* Archivo */
            case 'conceptosRetencion': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CONCEPTO_DE_RETENCION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'configuracionCuentasContables': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CONFIGURACION_CUENTAS_CONTABLES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'sustentosTributarios': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_SUSTENTOS_TRIBUTARIOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'tipoDocumento': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_TIPO_DOCUMENTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'tipoIdentificacion': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_TIPO_IDENTIFICACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'tipoTransaccion': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_TIPO_TRANSACCION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'urlWebServices': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_URL_WEB_SERVICES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* CONSULTAS */
            case 'listadoDevolucionIVAcompras': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_DEVOLUCION_IVA_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'listadoDevolucionIVAventas': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_DEVOLUCION_IVA_VENTAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesIvaCompras': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_IVA_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesRentaComprasConsolidado': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_CONSOLIDADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesRentaComprasTipoDocumento': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_TIPO_DOCUMENTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesVentasConsolidadoCliente': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_VENTAS_CONSOLIDADO_CLIENTE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'talonResumenCompras': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_TALON_RESUMEN_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'talonResumenVentas': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_TALON_RESUMEN_VENTAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesRentaComprasTipoProveedor': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_TIPO_PROVEEDOR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesRentaComprasSustento': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_TIPO_SUSTENTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesRentaComprasConcepto': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_TIPO_CONCEPTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesComprasListadoSimple': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_LISTADO_SIMPLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesVentasListadoSimple': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_VENTAS_LISTADO_SIMPLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'ventasElectronicasEmitidas': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_VENTAS_ELECTRONICAS_EMITIDAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesComprasVerificarSecuencia': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_RENTA_COMPRAS_VERIFICAR_SECUENCIA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'retencionesEmitidas': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_RETENCIONES_ELECTRONICAS_EMITIDAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consultarValidezComprobanteElectronico': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.TRIBUTACION_VALIDEZ_COMPROBANTE_ELECTRONICO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* TRANSACCIONES */
            case 'generarAnexoRegistroDatosCrediticios': {
                camino = [
                    { label: LS.LABEL_CAMINO_TRIBUTACION, url: "./tributacion" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.TRIBUTACION_TRANSACCIONES_REGISTRO_DATOS_CREDITICIOS, url: "" }
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