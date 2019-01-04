import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TipoTransaccionService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoTipoTransaccionTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoTipoListaTransaccionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnexoTipoTransaccion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoTipoTransaccion([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(){
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'ttCodigo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_TRANSACCION,
        field: 'ttTransaccion',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_ID,
        field: 'ttId',
        width: 200,
        minWidth: 200
      }
    ];
  }
}
