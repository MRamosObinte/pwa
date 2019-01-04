import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ListadoProductosPreciosStockService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarListadoProductosPreciosStock(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaProductosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarListadoProductosPreciosStock(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarListadoProductosPreciosStock([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'proCodigoPrincipal',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'proNombre',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'proCategoria',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_STOCK,
        field: 'stockSaldo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (params.data.stockSaldo ? params.data.stockSaldo : 0) },
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'detalleMedida',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_PRECIO_1,
        field: 'stockPrecio1',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_2,
        field: 'stockPrecio2',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_3,
        field: 'stockPrecio3',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      }
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
