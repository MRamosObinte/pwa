import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ComprasConsolidadoProductosMensualService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }

  listarComprasPorPeriodo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getComprasPorPeriodo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          let listado = this.utilService.convertirMatrizEnLista(respuesta.extraInfo.datos)
          let objeto = { columnas: respuesta.extraInfo.columnas, listado: listado, datos: respuesta.extraInfo.datos, columnasFaltantes: respuesta.extraInfo.columnasFaltantes };
          contexto.despuesDeListarComprasPorPeriodo(objeto);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarComprasPorPeriodo(null);
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
      objeto.width = (value === 'Producto') ? 350 : 100;
      objeto.pinned = (value === 'Producto' || value === 'Código' || value === 'Medida') ? 'left' : null;
      objeto.cellClass = (params) => {
        let estilo = (value === 'Producto' || value === 'Código' || value === 'Medida') ? "text-sm-left " : "text-sm-right ";
        if (!params.data['1']) {
          estilo += 'tr-negrita ';
          return estilo;
        } else {
          estilo += 'text-whitespace';
          return estilo;
        }
      }
      objeto.valueFormatter = (value === 'Producto' || value === 'Código' || value === 'Medida') ? null : numberFormatter;
      columnas.push(objeto);
      index = index + 1;
    });

    columnas.push(
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data['1']) {
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
