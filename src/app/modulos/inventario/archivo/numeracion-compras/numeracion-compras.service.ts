import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class NumeracionComprasService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarInvNumeracionCompraTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvNumeracionCompraTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvNumeracionCompraTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvNumeracionCompraTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_PERIODO,
        field: 'numPeriodo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'numMotivo',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_SECUENCIA,
        field: 'numSecuencia',
        width: 400,
        minWidth: 400
      }
    ];

    return columnDefs;
  }
}
