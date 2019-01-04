import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PeriodoXivSueldoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhXivSueldoPeriodoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhComboXivSueldoPeriodoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhXivSueldoPeriodoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhXivSueldoPeriodoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'xivDescripcion',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_FECHA_DESDE,
        field: 'xivDesde',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA_HASTA,
        field: 'xivHasta',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA_MAXIMO_PAGO,
        field: 'xivFechaMaximaPago',
        width: 150,
        minWidth: 150
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
