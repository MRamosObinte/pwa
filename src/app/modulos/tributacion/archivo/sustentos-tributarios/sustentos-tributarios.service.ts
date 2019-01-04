import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class SustentosTributariosService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }
  
  obtenerAnexoSustentoTO(parametro, contexto, empresaSelect){
    this.api.post("todocompuWS/anexosWebController/getAnexoSustentoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnexoSustento(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoSustento([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(){
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'susCodigo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'susDescripcion',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_COMPROBANTE,
        field: 'susComprobante',
        width: 200,
        minWidth: 200
      }
    ];
  }
}
