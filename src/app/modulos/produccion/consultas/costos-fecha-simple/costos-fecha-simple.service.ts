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
export class CostosFechaSimpleService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCostoFechaSimple(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdFunCostosPorFechaSimpleTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarCostoFechaSimple(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCostoFechaSimple(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePrdFunCostosPorFechaSimpleTO", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoPrdFunCostosPorFechaSimple.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarCostoFechaSimple(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePrdFunCostosPorFechaSimpleTO", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoCostoPorFechaSimple_");
        } else {
          this.toastr.warning("No se encontraron resultados");
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_SECTOR,
        field: 'costo_sector',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if (!params.data.costo_piscina) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_PISCINA,
        field: 'costo_piscina',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'costo_corrida',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'costo_total',
        width: 50,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.costo_piscina) {
            return 'text-whitespace tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      }
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}