import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoTipoDocumentoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoTipoComprobanteTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnexoTipoDocumento(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoTipoDocumento([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'tcCodigo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'tcDescripcion',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_TRANSACCION,
        field: 'tcTransaccion',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_SUSTENTO,
        field: 'tcSustento',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_ABREVIATURA,
        field: 'tcAbreviatura',
        width: 100,
        minWidth: 100
      }
    ];
  }
}
