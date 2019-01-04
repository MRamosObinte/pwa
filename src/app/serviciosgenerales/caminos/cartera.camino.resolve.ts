import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class CarteraCaminoResolve implements Resolve<any> {
    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'cartera':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'formaPagoCartera':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.CARTERA_FORMA_PAGO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'formaCobroCartera':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.CARTERA_FORMA_COBRO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            //Transacciones
            case 'anticipoProveedores':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CARTERA_ANTICIPO_PROVEEDORES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'anticipoClientes':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CARTERA_ANTICIPO_CLIENTES, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cobrosCartera':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CARTERA_COBROS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'pagosCartera':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.CARTERA_PAGOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /* CONSULTAS */
            case 'cobrosIndividual':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_COBROS_INDIVIDUAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cobrosDetalle':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_DETALLE_DE_COBROS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cobrosListado':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_LISTADO_DE_COBROS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cobrosListadoVentas':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_COBROS_LISTADO_DE_VENTAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cobrosMayorAuxiliarCliente':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_COBROS_MAYOR_AUXILIAR_CLIENTE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cuentasPorCobrarDetallado':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_CUENTAS_POR_COBRAR_DETALLADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cuentasPorCobrarGeneral':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_CUENTAS_POR_COBRAR_GENERAL, url: "" }
                ]
                localStorage.removeItem(LS.KEY_CURRENT_BREADCRUM);
                this.sistemaService.caminoC$.next(true);
                break;
            case 'anticipoClienteSaldoDetallado':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_ANTICIPO_CLIENTES_SALDO_DETALLADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'anticipoProveedorSaldoDetallado':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_ANTICIPO_PROVEEDORES_SALDO_DETALLADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'anticipoClienteSaldoGeneral':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_ANTICIPO_CLIENTE_SALDO_GENERAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'pagosIndividual':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_PAGOS_INDIVIDUAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'pagosListado':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_PAGOS_LISTADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'pagosDetalle':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_PAGOS_DETALLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'pagosListadoCompra':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_PAGOS_LISTADO_COMPRAS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'pagosMayorAuxiliarProveedor':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_PAGOS_MAYOR_AUXILIAR_PROVEEDOR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cuentasPorPagarDetallado':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_CUENTAS_POR_PAGAR_DETALLADO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cuentasPorPagarGeneral':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_CUENTAS_POR_PAGAR_GENERAL, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'anticipoProveedorSaldoGeneral':
                camino = [
                    { label: LS.LABEL_CAMINO_CARTERA, url: "./cartera" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.CARTERA_ANTICIPO_PROVEEDOR_SALDO_GENERAL, url: "" }
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