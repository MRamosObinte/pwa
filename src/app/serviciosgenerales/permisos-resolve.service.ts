import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ApiRequestService } from './api-request.service';
import { LS } from '../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PermisosResolveService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    let objJWT = JSON.parse(localStorage.getItem(LS.KEY_SISINFOTO));
    return this.api.post("todocompuWS/appWebController/validarPermisos", { item: route.routeConfig['path'] }, null)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length > 0) {
          return respuesta.extraInfo;
        } else {
          this.toastr.error("No tiene Permisos para acceder a estas opciones", 'Error');
          this.router.navigate(["/403"]);
        }
      })
      .catch(err => this.handleError(err, this));
  }

  handleError(error: any, contexto) {
    switch (error.status) {
      case 401:
      case 403:
        this.toastr.warning('No autorizado', 'Aviso');
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['login']);
        break;
      case 404:
        this.toastr.warning('página solicitada no se encuentra', 'Aviso');
        this.router.navigate(["/404"]);
        break;
      case 0:
        this.toastr.warning("No hay conexión con el servidor.", 'Aviso');
        this.router.navigate(["/0"]);
        break;
      default:
        this.toastr.error(error.message || error, 'Error');
        break;
    }
    contexto.cargando = false;
  }

}
