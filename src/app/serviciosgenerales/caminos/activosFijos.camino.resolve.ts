import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LS } from '../../constantes/app-constants';
import { AppSistemaService } from '../app-sistema.service';

@Injectable()
export class ActivosFijosCaminoResolve implements Resolve<any> {

    constructor(
        private sistemaService: AppSistemaService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let camino = [];
        switch (route.routeConfig['path']) {
            case 'activo':
                camino = [
                    { label: LS.LABEL_CAMINO_ACTIVO_FIJO, url: "./activo" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            /* Archivo */
            case 'motivoDepreciacion':
                camino = [
                    { label: LS.LABEL_CAMINO_ACTIVO_FIJO, url: "./activo" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.ACTIVO_FIJO_MOTIVO_DEPRECIACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'ubicacionActivoFijo':
                camino = [
                    { label: LS.LABEL_CAMINO_ACTIVO_FIJO, url: "./activo" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.ACTIVO_FIJO_UBICACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'activoFijoGrupo':
                camino = [
                    { label: LS.LABEL_CAMINO_ACTIVO_FIJO, url: "./activo" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.ACTIVO_FIJO_GRUPO_CLASIFICACION, url: "" }
                ]
                localStorage.setItem(LS.KEY_CURRENT_BREADCRUM, JSON.stringify(camino));
                this.sistemaService.caminoC$.next(true);
                break;
            case 'activoFijo':
                camino = [
                    { label: LS.LABEL_CAMINO_ACTIVO_FIJO, url: "./activo" },
                    { label: LS.LABEL_ARCHIVO, url: "" },
                    { label: LS.ACTIVO_FIJO, url: "" }
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