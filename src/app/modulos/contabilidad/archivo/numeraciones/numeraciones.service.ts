import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class NumeracionesService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }
  listarNumeraciones(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/contabilidadWebController/getListaConNumeracionTO", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarNumeraciones(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarNumeraciones([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PERIODO,
        field: 'numPeriodo',
        width: 200
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'numTipo',
        width: 200
      },
      {
        headerName: LS.TAG_SECUENCIA,
        field: 'numSecuencia',
        width: 200
      }
    ];
  }
}
