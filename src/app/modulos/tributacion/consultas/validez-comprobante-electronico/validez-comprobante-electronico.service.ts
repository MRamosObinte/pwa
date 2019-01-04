import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ValidezComprobanteElectronicoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAutorizadocionComprobantesE(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAutorizadocionComprobantes", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAutorizadocionComprobantes([]);
            contexto.cargando = false;
            contexto.vistaFormulario = false;
          } else {
            contexto.despuesDeListarAutorizadocionComprobantes(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAutorizadocionComprobantes([]);
          contexto.cargando = false;
          contexto.vistaFormulario = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
}
