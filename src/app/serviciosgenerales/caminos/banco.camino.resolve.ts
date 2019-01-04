import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class BancoCaminoResolve implements Resolve<any> {
    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'bancos':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_BANCO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'caja':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CAJA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cuenta':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_CUENTA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'bancoBco':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_BANCO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /**Consultas */
            case 'listaChequesCobrar':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_COBRAR, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listaChequesEmision':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_EMISION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listaChequesNumero':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_NUMERO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'listaChequesVencimiento':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_CONSULTAS, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_VENCIMIENTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /**Transacciones */
            case 'chequesNoImpresos':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_NO_IMPRESOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'chequesNoRevisados':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_NO_REVISADOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'chequesNoEntregados':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_NO_ENTREGADOS, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'conciliacionBancaria':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CONCILIACION_BANCARIA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cambiarFechaVencimientoCheque':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CHEQUES_CAMBIAR_FECHA_VENCIMIENTO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cambioChequeGeneraContable':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CAMBIO_CHEQUE_GENERA_CONTABLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'cambioChequeRectificaContable':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.INVENTARIO_CAMBIO_CHEQUE_RECTIFICA_CONTABLE, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'contableDeposito':
                camino = [
                    { label: LS.LABEL_CAMINO_BANCOS, url: "./bancos" },
                    { label: LS.LABEL_TRANSACCIONES, url: "" },
                    { label: LS.BANCO_CONTABLE_DEPOSITO, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            default:
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
        }
    }
}