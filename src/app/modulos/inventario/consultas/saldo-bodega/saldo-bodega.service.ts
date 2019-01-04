import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SaldoBodegaService {
  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService) { }

  listarInvListaSaldoBodegaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaSaldoBodegaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvListaSaldoBodegaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvListaSaldoBodegaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnas = [];
    columnas.push(
      {
        headerName: LS.TAG_BODEGA,
        field: 'sbBodega',
        width: 100,
        minWidth: 100,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita' : 'text-whitespace' },
        hide: (params) => { return (!params.data.sbProducto) ? true : false }
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'sbProducto',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'sbNombre',
        width: 250,
        minWidth: 250,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'sbMedida',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_STOCK,
        field: 'sbStock',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_COSTO,
        field: 'sbCosto',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'sbTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbProducto) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
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
          if (params.data.sbProducto) {
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
    )
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

