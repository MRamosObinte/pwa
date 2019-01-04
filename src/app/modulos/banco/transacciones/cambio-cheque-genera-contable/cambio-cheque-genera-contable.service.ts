import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class CambioChequeGeneraContableService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  verificarPermiso(accion, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = true;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  cambioDeCheque(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/cambioDeCheque", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesCambioDeCheque(respuesta.extraInfo);
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
        } else {
          contexto.despuesCambioDeCheque(respuesta.extraInfo);
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
}
