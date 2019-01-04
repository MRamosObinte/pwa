import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class SoporteCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'soporte': {
                camino = [
                    { label: LS.LABEL_CAMINO_SOPORTE, url: "./soporte" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            }
            case 'aplicacion': {
                camino = [
                    { label: LS.LABEL_CAMINO_SOPORTE, url: "./soporte" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.SOPORTE_APLICACION, url: "" }
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