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
export class UtilidadDiariaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarUtilidadDiaria(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getUtilidadDiariaCorrida", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarUtilidadDiaria(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirUtilidadDiaria(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteUtilidadDiariaCorrida", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoUtilidadDiaria.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarUtilidadDiaria(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteUtilidadDiariaCorrida", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoUtilidadDiaria_");
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
        headerName: LS.TAG_DESCRIPCION,
        field: 'uDescripcion',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'uValorNumerico',
        width: 50,
        minWidth: 50,
        valueFormatter: (params) => {
          if (params.data.uValorNumerico) {
            return this.numberFormatter(params)
          }
        },
        valueGetter: (params) => {
          if (params.data.uValorNumerico == null) {
            return params.data.uValorTexto
          } else {
            return params.data.uValorNumerico
          }
        },
        cellClass: (params) => {
          if (params.data.uValorNumerico == null) {
            return 'text-whitespace'
          } else {
            return 'text-whitespace text-right'
          }
        }
      },
    ]
  }
  numberFormatter(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}

