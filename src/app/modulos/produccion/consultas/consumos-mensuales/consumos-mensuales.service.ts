import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ConsumosMensualesService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  /**
 * Retorna el listado de piscina
 * @param parametro debe ser tipo {empresa: '', sector:''}
 */
  listarConsumosMensuales(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getConsumosMensuales", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarConsumosMensuales(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarConsumosMensuales(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteConsumosMensuales", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaConsumosMensuales_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(columnas) {
    let columnDefs: Array<object> = [];
    let width;
    for (let i = 0; i < columnas.length; i++) {
      if (i < 1) {
        width = 200;
      } else {
        width = 115;
      }
      columnDefs.push(
        {
          headerName: columnas[i],
          field: i + "",
          width: width,
          minWidth: width,
          pinned: (i < 3) ? 'left' : null,
          valueFormatter: (params) => {
            return (i > 2) ? new DecimalPipe('en-US').transform(params.value, '1.2-2') : null;
          },
          cellClass: (params) => {
            return (i > 2) ? ' text-right' : ''
          }
        },
      );
      if (i === columnas.length - 1) {
        columnDefs.push(
          {
            headerName: LS.TAG_OPCIONES,
            headerClass: 'cell-header-center',
            field: '',
            width: LS.WIDTH_OPCIONES,
            minWidth: LS.WIDTH_OPCIONES,
            cellRenderer: "botonOpciones",
            cellClass: 'text-md-center',
            cellRendererParams: (params) => {
              if (params.data[1] !== "") {
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
        );
      }
    }

    return columnDefs;
  }
}
