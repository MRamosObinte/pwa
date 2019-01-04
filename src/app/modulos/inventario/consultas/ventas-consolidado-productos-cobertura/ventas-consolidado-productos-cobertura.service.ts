import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VentasConsolidadoProductosCoberturaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvFunVentasConsolidandoProductosCoberturaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunVentasConsolidandoProductosCoberturaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunVentasConsolidandoProductosCoberturaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunVentasConsolidandoProductosCoberturaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'vcpProducto',
        width: 200,
        minWidth: 200,
        cellClass: (params) => { return (!params.data.vcpCodigo) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'vcpCodigo',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vcpCodigo) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'vcpMedida',
        width: 200,
        minWidth: 200,
        cellClass: (params) => { return (!params.data.vcpCodigo) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'vcpCantidad',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vcpCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'vcpTotal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vcpCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'vcpPorcentaje',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vcpCodigo) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
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
          if (params.data.vcpCodigo) {
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


