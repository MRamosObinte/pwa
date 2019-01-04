import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class SistemaCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'sistema': {
                camino = [
                    { label: LS.LABEL_CAMINO_SISTEMA, url: "./sistema" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* Archivo */
            case 'perfilFacturacion': {
                camino = [
                    { label: LS.LABEL_CAMINO_SISTEMA, url: "./sistema" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_PERFIL_FACTURACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'administracionEmpresa': {
                camino = [
                    { label: LS.LABEL_CAMINO_SISTEMA, url: "./sistema" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.TAG_EMPRESA, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            /* Consultas */
            case 'sucesos': {
                camino = [
                    { label: "Sistema", url: "./sistema" },
                    { label: "Consultas", url: "" },
                    { label: "Sucesos", url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'perfil': {
                camino = [
                    { label: "Perfil de usuario", url: "" },
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'atajo': {
                camino = [
                    { label: "Atajos de teclado", url: "" },
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