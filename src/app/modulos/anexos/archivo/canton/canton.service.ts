import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class CantonService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarAnxDpaProvinciaTO(contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getComboAnxDpaProvinciaTO", {}, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnxDpaProvinciaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarComboAnxCantonTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getComboAnxCantonTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarComboAnxCantonTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarCiudadesAnxDpaProvinciaTO(contexto, parametro, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getComboAnxDpaCantonTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarCiudadesAnxDpaProvinciaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

}
