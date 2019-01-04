import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RetencionesVentasConsolidadoClienteService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoListaConsolidadoRetencionesVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxListaConsolidadoRetencionesVentasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListaConsolidadoRetencionesVentas([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListaConsolidadoRetencionesVentas(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListaConsolidadoRetencionesVentas([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_TRANSACCION,
        field: 'rvcTransaccion',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        field: 'rvcIdentificacion',
        width: 150,
        minWidth: 100
      },
      {
        headerName: LS.TAG_COMPR_TIPO,
        field: 'rvcComprobanteTipo',
        width: 70,
        minWidth: 70,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_COMPROBANTE_TIPO,
          text: LS.TAG_COMPR_TIPO
        }
      },
      {
        headerName: LS.NUMERO_RETENCIONES,
        field: 'rvcNumeroRetenciones',
        width: 70,
        minWidth: 70,
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_NO_OBJETO_IVA,
        field: 'rvcBaseNoObjetoIva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'rvcBase0',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
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
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_MONTO_IVA,
        field: 'venMontoIva',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_VALOR_RET_IVA,
        field: 'venValorRetenidoIva',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_IVA,
          text: LS.TAG_VALOR_RET_IVA
        },
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      }
      ,
      {
        headerName: LS.TAG_VALOR_RET_RENTA,
        field: 'venValorRetenidoRenta',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_RENTA,
          text: LS.TAG_VALOR_RET_RENTA
        },
        cellClass: (params) => {
          if ((params.data.rvcTransaccion === null)) {
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
