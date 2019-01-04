import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class InventarioCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'inventario':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'bodegaInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_BODEGA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'configuracionPrecios':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CONFIGURAR_PRECIOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'formaPagoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_FORMA_PAGO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'formaCobroInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_FORMA_COBRO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'motivoCompras':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_MOTIVO_COMPRA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'motivoVentas':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_MOTIVO_VENTA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'categoriaClienteInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_CATEGORIA_CLIENTE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'categoriaProveedorInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_CATEGORIA_PROVEEDOR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'clienteInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_CLIENTE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'productoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'medidaProducto':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO_MEDIDA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'tipoProducto':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_TIPO_PRODUCTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'categoriaProductoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_CATEGORIA_PRODUCTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'categoriaProductoInvPedidos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_CATEGORIA_PRODUCTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'proveedorInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_PROVEEDOR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'motivoConsumos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_MOTIVO_CONSUMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'motivoProformas':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_MOTIVO_PROFORMAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'motivoTransferencias':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_MOTIVO_TRANSFERENCIAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'numeracionCompras':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_NUMERACION_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'numeracionConsumos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_NUMERACION_CONSUMOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'numeracionVentas':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_NUMERACION_VENTAS_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'medidaProductoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO_MEDIDA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'tipoProductoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO_TIPO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /**Consultas */
            case 'kardexValorizado':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.KARDEX_VALORIZADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'saldoBodegaInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_SALDO_BODEGA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listadoCliente':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CLIENTE_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listadoProveedor':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PROVEEDORES_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'imprimirPlacasProductos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO_PLACA_IMPRIMIR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'comprasConsolProductos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTOS_COMPRA_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventasConsolProductos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTOS_VENTA_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'invKardex':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.KARDEX, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'saldoBodegaComprobacionMontos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_SALDO_BODEGA_COMPROBACION_MONTOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'saldoBodegaGeneral':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_SALDO_BODEGA_GENERAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventasConsolProductosCobertura':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTOS_VENTA_COBERTURA_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventasConsolidadoClientes':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CLIENTE_VENTA_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'comprasConsolProductosMensual':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTOS_COMPRA_MENSUAL_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'analisisVentasVsCostos':
                camino = [
                    { label: "Inventario", url: "./inventario" },
                    { label: "Consultas", url: "" },
                    { label: "Análisis ventas vs costo", url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'medidaProductoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_ANALISIS_VENTAS_VS_COSTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listadoProducto':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listadoProductosPreciosStock':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTO_PRECIO_STOCK_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'reconstruccionSaldosCostos':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_RECONSTRUCCION_SALDO_COSTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventasConsolidadoClientes':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CLIENTE_VENTA_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventasConsolProductosCobertura':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_PRODUCTOS_VENTA_COBERTURA_CONSOLIDANDO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'comprasListado':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_COMPRAS_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'consumosListadoInv':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CONSUMOS_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventasListado':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_VENTAS_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /**Transacciones */
            case 'transferenciasTrans':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_TRANSFERENCIAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventaFacturaVenta':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_VENTA_FACTURA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventaNotaCredito':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_VENTA_NOTA_CREDITO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventaNotaDebito':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_VENTA_NOTA_DEBITO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ventaNotaEntrega':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_VENTA_NOTA_ENTREGA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'comprasTrans':
                camino = [
                    { label: LS.LABEL_CAMINO_INVENTARIO, url: "./inventario" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            default:
                localStorage.removeItem(LS.KEY_CURRENT_BREADCRUM);
                this.sistemaService.caminoC$.next(true);
                break;
        }
    }

}