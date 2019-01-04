import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class SucesosService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }


  listarSisSucesoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getListaSisSucesoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSisSucesoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarSisSucesoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarSisSusTablaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getListaSisSusTablaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSisSusTablaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarSisSusTablaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(){
    return [
      {
        headerName: LS.TAG_SECUENCIA,
        field: 'susSecuencia',
        width: 200
      },
      {
        headerName: LS.TAG_TABLA,
        field: 'susTabla',
        width: 200
      },
      {
        headerName: LS.TAG_CLAVE,
        field: 'susClave',
        width: 200
      },
      {
        headerName: LS.TAG_SUCESOS,
        field: 'susSuceso',
        width: 200
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'susDetalle',
        width: 200
      },
      {
        headerName: LS.TAG_USUARIO,
        field: 'usrCodigo',
        width: 200
      }
    ];
  }
}
