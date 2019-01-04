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
export class ConsumosPiscinaMultipleService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarConsumosPiscinaMultiple(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarCorridaActivoSeleccionMultiple", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarConsumosPiscinaMultiple(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarConsumosPiscinaMultiple(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteConsumosPiscinaMultiple", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaConsumosPiscinaMultiple_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
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
            let clase = '';
            if (params.data[1] === "") {
              clase = 'tr-negrita';
            }
            if (i > 2) {
              clase += ' text-right';
            }
            return clase;
          }
        }
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

  generarColumnasPiscinasSeleccionadas(contexto, data?) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_SECTOR,
        field: 'sector',
        width: 100,
        minWidth: 75
      },
      {
        headerName: LS.TAG_PISCINA,
        field: 'piscina',
        width: 100,
        minWidth: 80
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'corrida',
        width: 100,
        minWidth: 79
      },
      {
        headerName: LS.TAG_DESDE,
        field: 'desde',
        width: 150,
        minWidth: 85
      },
      {
        headerName: LS.TAG_HASTA,
        field: 'hasta',
        width: 150,
        minWidth: 85
      },
    ];

    // columnDefs.push(this.utilService.getColumnaBotonAccionEliminar());
    columnDefs.push(this.utilService.getColumnaEliminar(data, contexto));

    return columnDefs;
  }
}
