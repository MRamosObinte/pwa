import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PeriodoUtilidadService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhUtilidadesPeriodoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhComboUtilidadesPeriodoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhUtilidadesPeriodoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhUtilidadesPeriodoTO([]);
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
        field: 'utiDescripcion',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_FECHA_DESDE,
        field: 'utiDesde',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA_HASTA,
        field: 'utiHasta',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA_MAXIMO_PAGO,
        field: 'utiFechaMaximaPago',
        width: 150,
        minWidth: 150
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
