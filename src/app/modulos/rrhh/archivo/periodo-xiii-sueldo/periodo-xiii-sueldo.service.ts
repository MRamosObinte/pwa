import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PeriodoXiiiSueldoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhXiiiSueldoPeriodoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhComboXiiiSueldoPeriodoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhXiiiSueldoPeriodoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhXiiiSueldoPeriodoTO([]);
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
        field: 'xiiiDescripcion',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_FECHA_DESDE,
        field: 'xiiiDesde',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA_HASTA,
        field: 'xiiiHasta',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA_MAXIMO_PAGO,
        field: 'xiiiFechaMaximaPago',
        width: 150,
        minWidth: 150
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
