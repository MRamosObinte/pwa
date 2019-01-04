import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TalonResumenComprasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoTalonResumen(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoTalonResumenTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length <= 18) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoTalonResumen(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoTalonResumen([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_TIPO_CONCEPTO,
        field: 'retConcepto',
        width: 300,
        minWidth: 200,
        cellClass: (params) => {
          if ((params.data.retConcepto === LS.TAG_TOTALES)) {
            return 'tr-negrita textoMayuscula';
          } else if (!params.data.retCantidad && !params.data.retBaseImponible && !params.data.retPorcentaje && !params.data.retValorRetenido) {
            return 'tr-negrita textoMayuscula';
          }
          else {
            return '';
          }
        }
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'retCantidad',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retConcepto === LS.TAG_TOTALES)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'retBaseImponible',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retConcepto === LS.TAG_TOTALES)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'retPorcentaje',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retConcepto === LS.TAG_TOTALES)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_VALOR_RETENIDO,
        field: 'retValorRetenido',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.retConcepto === LS.TAG_TOTALES)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}