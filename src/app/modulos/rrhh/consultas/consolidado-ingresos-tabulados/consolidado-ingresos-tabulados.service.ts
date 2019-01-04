import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoIngresosTabuladosService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }

  listarConsolidadoIngresosTabulado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getConsolidadoIngresosTabulado", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listado = this.utilService.convertirMatrizEnLista(respuesta.extraInfo.datos)
          let objeto = { columnas: respuesta.extraInfo.columnas, listado: listado, datos: respuesta.extraInfo.datos, columnasFaltantes: respuesta.extraInfo.columnas };
          contexto.despuesDeListarConsolidadoIngresosTabulado(objeto);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarConsolidadoIngresosTabulado(null);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  convertirCabeceraObjetoConEstilo(array) {
    let columnas = [];
    let index = 0;
    array.forEach(value => {
      let objeto = { headerName: null, width: null, field: null, cellClass: null, valueFormatter: null, pinned: null, minWidth: null };
      objeto.headerName = value;
      objeto.field = index + "";
      objeto.width = (value === 'Nombres') ? 300 : 150;
      objeto.minWidth = value === 'Nombres' ? 300 : 150;
      objeto.pinned = (value === 'Nombres' || value === 'Cédula' || value === 'Fecha Ingreso' || value === 'Fecha Salida') ? 'left' : null;
      objeto.cellClass = (params) => {
        let estilo = (value === 'Nombres' || value === 'Cédula' || value === 'Fecha Ingreso' || value === 'Fecha Salida') ? "text-left " : "text-right ";
        if (!params.data['0']) {
          estilo += ' tr-negrita';
        }
        return estilo;
      }
      objeto.valueFormatter = (value === 'Nombres' || value === 'Cédula' || value === 'Fecha Ingreso' || value === 'Fecha Salida') ? null : numberFormatter;
      columnas.push(objeto);
      index = index + 1;
    });
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
