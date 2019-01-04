import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ReconstruccionSaldosCostosService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvProductosConErrorTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListadoProductosConError", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProductosConErrorTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvProductosConErrorTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_BODEGA,
        field: 'errBodega',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'errProductoCodigo',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'errProductoNombre',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'errCantidad',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_DESDE,
        field: 'errDesde',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_HASTA,
        field: 'errHasta',
        width: 100,
        minWidth: 100
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
          if (params.data.errProductoCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_KARDEX_VALORIZADO,
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
