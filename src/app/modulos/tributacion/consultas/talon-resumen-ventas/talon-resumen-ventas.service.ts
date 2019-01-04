import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TalonResumenVentasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoTalonResumenVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoTalonResumenVentaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoTalonResumenVentas([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoTalonResumenVentas(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoTalonResumenVentas([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_COMPROBANTE,
        field: 'venComprobante',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return 'tr-negrita textoMayuscula';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_ESTALECIMIENTO,
        field: 'venEstablecimiento',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_PUNTO_EMISION,
        field: 'venPuntoEmision',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return ' ';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_NO_OBJETO_IVA,
        field: 'venBaseNoObjetoIva',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'venBase0',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'venBaseImponible',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_MONTO_IVA,
        field: 'venMotoIva',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_V_RETENIDO_IVA,
        field: 'venValorRetenidoIva',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENCION_IVA,
          text: LS.TAG_V_RETENIDO_IVA
        }
      },
      {
        headerName: LS.TAG_V_RET_RENTA,
        field: 'venValorRetenidoRenta',
        width: 100,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobante === LS.TAG_M_TOTAL)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENCION_RENTA,
          text: LS.TAG_V_RET_RENTA
        }
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}