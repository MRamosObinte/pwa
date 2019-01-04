import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {
  constructor(
    private api: ApiRequestService,
    private utilService: UtilService
  ) { }

  insertarLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarLiquidacion(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.cargando = false
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
  
  modificarRhLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarLiquidacion(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.cargando = false
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
}
