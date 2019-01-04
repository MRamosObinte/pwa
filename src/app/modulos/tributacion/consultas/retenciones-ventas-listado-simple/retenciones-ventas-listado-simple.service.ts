import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RetencionesVentasListadoSimpleService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoListadoRetencionesVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxListadoRetencionesVentasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarAnexoListadoRetencionesVentas([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarAnexoListadoRetencionesVentas(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarAnexoListadoRetencionesVentas([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerAnexoTipoComprobanteComboTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxTipoComprobanteComboTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarComprobante([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarComprobante(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarComprobante([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerAnexoEstablecimientoComboTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getEstablecimientos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarEstablecimientos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarEstablecimientos([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerAnexoPuntosEmisionComboTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getPuntosEmision", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPuntosEmision(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarPuntosEmision([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_FECHA,
        field: 'venFecha',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_N_IDENTIFICACION,
        field: 'venIdentificacion',
        width: 200,
        minWidth: 200,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_N_IDENTIFICACION
        }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'venNombre',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_COMPROBANTE_TIPO,
        field: 'venComprobanteTipo',
        width: 150,
        minWidth: 150,
      },
      {
        headerName: LS.TAG_COMPROBANTE_NUM,
        field: 'venComprobanteNumero',
        width: 150,
        minWidth: 150,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_COMPROBANTE_NUMERO,
          text: LS.TAG_COMPROBANTE_NUM
        }
      },
      {
        headerName: LS.TAG_AUTORIZACION,
        field: 'venAutorizacion',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_B_NO_OBJETO_IVA,
        field: 'venBaseNoObjetoIva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobanteTipo === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_BASE_NO_OBJETO_IVA,
          text: LS.TAG_B_NO_OBJETO_IVA
        }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'venBase0',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobanteTipo === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_BASE_IMP,
        field: 'venBaseImponible',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobanteTipo === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_BASE_IMPONIBLE,
          text: LS.TAG_BASE_IMP
        }
      },
      {
        headerName: LS.TAG_V_RETENIDO_IVA,
        field: 'venValorRetenidoIva',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobanteTipo === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_IVA,
          text: LS.TAG_V_RETENIDO_IVA
        }
      },
      {
        headerName: LS.TAG_V_RET_RENTA,
        field: 'venValorRetenidoRenta',
        width: 110,
        minWidth: 110,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if ((params.data.venComprobanteTipo === null)) {
            return ' text-whitespace text-right tr-negrita';
          } else {
            return 'text-whitespace text-right';
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_VALOR_RETENIDO_RENTA,
          text: LS.TAG_V_RET_RENTA
        }
      },
      {
        headerName: LS.NUMERO_RET,
        field: 'venRetencion',
        width: 150,
        minWidth: 150,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.NUMERO_RETENCIONES,
          text: LS.NUMERO_RET
        }
      },
      {
        headerName: LS.NUMERO_AUT,
        field: 'venRetencionAutorizacion',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.NUMERO_AUTORIZACION,
          text: LS.NUMERO_AUT
        }
      },
      {
        headerName: LS.TAG_F_EMISION,
        field: 'venRetencionFechaEmision',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_FECHA_EMISION,
          text: LS.TAG_F_EMISION
        }
      }
    ];
  }
}
function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
