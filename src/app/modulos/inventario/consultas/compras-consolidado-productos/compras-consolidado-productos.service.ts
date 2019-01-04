import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ComprasConsolidadoProductosService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvFunComprasConsolidandoProductosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunComprasConsolidandoProductosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunComprasConsolidandoProductosTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunComprasConsolidandoProductosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'ccpProducto',
        width: 250,
        minWidth: 250,
        cellClass: (params) => { return (!params.data.ccpCodigo) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'ccpCodigo',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.ccpCodigo) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'ccpMedida',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.ccpCodigo) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'ccpCantidad',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.ccpCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'ccpTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.ccpCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'ccpPorcentaje',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.ccpCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.ccpCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_KARDEX,
              accion: LS.ACCION_CONSULTAR
            };
          } else {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
