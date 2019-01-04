import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GrameajePiscinaProcesosService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }

  listarGrameajePromedioPorPiscina(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getConsultaGrameajePromedioPorPiscina", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listado = this.utilService.convertirMatrizEnLista(respuesta.extraInfo.datos)
          let objeto = { columnas: respuesta.extraInfo.columnas, listado: listado, datos: respuesta.extraInfo.datos, columnasFaltantes: respuesta.extraInfo.columnas };
          contexto.despuesDeListarGrameajePromedioPorPiscina(objeto);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarGrameajePromedioPorPiscina(null);
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
      objeto.width = (value === 'Piscina') ? 150 : 200;
      objeto.minWidth = value === 'Piscina' ? 150 : 200;
      objeto.pinned = (value === 'Piscina' || value === 'Fecha Siembra' || value === 'Edad') ? 'left' : null;
      objeto.cellClass = (value === 'Piscina' || value === 'Fecha Siembra' || value === 'Edad') ? "text-left " : "text-right ";
      objeto.valueFormatter = (value === 'Piscina' || value === 'Fecha Siembra' || value === 'Edad') ? null : numberFormatter;
      columnas.push(objeto);
      index = index + 1;
    });
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

