import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoTipoIdentificacionTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxTipoIdentificacionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnexoTipoIdentificacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoTipoIdentificacion([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'tiCodigo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'tiDetalle',
        width: 400,
        minWidth: 400
      }
    ];
  }
}
