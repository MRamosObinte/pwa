import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SaldoBodegaGeneralService {
  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }

  listarInvFunListaProductosSaldosGeneralTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunListaProductosSaldosGeneralTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listado = this.utilService.convertirMatrizEnLista(respuesta.extraInfo.datos)
          let objeto = { columnas: respuesta.extraInfo.columnas, listado: listado, datos: respuesta.extraInfo.datos, columnasFaltantes: respuesta.extraInfo.columnasFaltantes };
          contexto.despuesDeListarInvFunListaProductosSaldosGeneralTO(objeto);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarInvFunListaProductosSaldosGeneralTO(null);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  convertirCabeceraObjetoConEstilo(array) {
    let columnas = [];
    let index = 0;
    array.forEach(value => {
      let objeto = { headerName: null, width: null, field: null, cellClass: null, valueFormatter: null, pinned: null };
      objeto.headerName = value;
      objeto.field = index + "";
      objeto.width = (value === 'Producto') ? 30 : 10;
      objeto.cellClass = (value === 'Producto' || value === 'Código') ? "text-sm-left " : "text-sm-right ";
      objeto.valueFormatter = (value === 'Producto' || value === 'Código') ? null : numberFormatter;
      columnas.push(objeto);
      index = index + 1;
    });
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}