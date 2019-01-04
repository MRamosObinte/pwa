import { Injectable } from '@angular/core';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CostosMensualesService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCostosMensuales(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getCostosMensuales", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo.datos) {
          contexto.despuesDeListarCostosMensuales(respuesta.extraInfo);
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCostosMensuales(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteCostosMensuales", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoCostosMensuales_");
        } else {
          this.toastr.warning("No se encontraron resultados");
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(columnas) {
    let columnDefs: Array<object> = [];
    let width;
    if (columnas === null) {
      this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
    } else {
      for (let i = 0; i < columnas.length; i++) {
        if (i < 1) {
          width = 200;
        } else if (i == 1) {
          width = 100;
        } else {
          width = 115;
        }
        columnDefs.push(
          {
            headerName: columnas[i],
            field: i + "",
            width: width,
            minWidth: width,
            pinned: (i < 2) ? 'left' : null,
            valueFormatter: (params) => {
              return (i >= 3) ? this.numberFormatter(params) : null;
            },
            cellClass: (params) => {
              return (i >= 3) ? ' text-right' : ''
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
    }
    return columnDefs;
  };

  numberFormatter(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
