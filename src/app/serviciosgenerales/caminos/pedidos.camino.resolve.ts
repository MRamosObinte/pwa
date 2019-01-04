import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class PedidosCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'pedidos': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'pedidoProductoCategoria': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_CATEGORIA_PRODUCTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'pedidoProductoUnidaMedida': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_UNIDAD_MEDIDA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'pedidoProducto': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_PRODUCTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;

            }
            case 'configuracionPedido': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.PEDIDOS_CONFIGURACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'pedidoMotivo': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.PEDIDOS_MOTIVO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'configuracionOrdenCompra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CONFIGURACION_ORDEN_COMPRA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'generarOrdenPedido': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PEDIDOS_ORDEN, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'aprobarOrdenPedido': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PEDIDOS_ORDEN_APROBAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'generarOrdenCompra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PEDIDOS_ORDEN_COMPRA_GENERAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'aprobarOrdenCompra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PEDIDOS_ORDEN_COMPRA_APROBAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'ordenCompra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.PEDIDOS_ORDEN_COMPRA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consultaOrdenesPedido': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: "Consultas", url: "" },
                    { label: LS.PEDIDOS_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'consultaOrdenesCompra': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: "Consultas", url: "" },
                    { label: LS.PEDIDOS_ORDEN_COMPRA_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'configuracionCorreo': {
                camino = [
                    { label: LS.LABEL_CAMINO_PEDIDOS, url: "./pedidos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.PEDIDOS_CONFIGURACION_CORREO, url: "" }
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