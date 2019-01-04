import { LS } from './../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaldoConsolidadoSueldoPagarService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhSaldoConsolidadoSueldosPorPagarTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhSaldoConsolidadoSueldosPorPagarTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhSaldoConsolidadoSueldosPorPagarTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhSaldoConsolidadoSueldosPorPagarTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'scspCategoria',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.scspId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'scspId',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          return (!params.data.scspId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'scspNombres',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          return (!params.data.scspId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'scspValor',
        width: 80,
        minWidth: 80,
        valueFormatter: this.formatearA2Decimales,
        cellClass: (params) => {
          return (!params.data.scspId) ? 'tr-negrita text-right' : 'text-right';
        }
      }
    ];

    return columnDefs;
  }


  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
