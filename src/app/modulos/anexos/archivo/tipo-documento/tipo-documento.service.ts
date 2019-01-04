import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarAnxTipoComprobanteComboTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxTipoComprobanteComboTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnxTipoComprobanteComboTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarAnxTipoComprobanteComboTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
        contexto.cargando = false;
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

}
