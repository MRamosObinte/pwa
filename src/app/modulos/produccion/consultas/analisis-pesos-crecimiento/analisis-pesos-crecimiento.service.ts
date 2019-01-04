import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class AnalisisPesosCrecimientoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarAnalisisPesosCrecimiento(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getFunAnalisisPesos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesListarAnalisisPesosCrecimiento(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirListadoAnalisisPesoCrecimiento(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteListadoFunAnalisisPesos", parametros, empresaSelect)
    .then(data => {
      if (data._body.byteLength > 0) {
        this.utilService.descargarArchivoPDF('listadoFunAnalisisPesos.pdf', data);
      } else {
        this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
      }
      contexto.cargando = false;
    }).catch(err => this.utilService.handleError(err, this));
  }

  exportarListadoAnalisisPesoCrecimiento(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteListadoFunAnalisisPesos", parametros, empresaSelect)
    .then(data => {
      if (data) {
        this.utilService.descargarArchivoExcel(data._body, "ListadoFunAnalisisPesos_");
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
        headerName: LS.TAG_PISCINA,
        field: 'apPiscina',
        width: 80,
        minWidth: 80,
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'apCorrida',
        width: 80,
        minWidth: 80,
      },
      {
        headerName: LS.TAG_FECHA_SIEMBRA,
        field: 'apFechaSiembra',
        width: 120,
        minWidth: 120,
      },
      {
        headerName: LS.SOB_MTS_CUADRADOS,
        field: 'apSobrevivenciaMetroCuadrado',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.SOBREVIVENCIA_METROS_CUADRADOS,
          text: LS.SOB_MTS_CUADRADOS
        }
      },
      {
        headerName: LS.TAG_RALEO,
        field: 'apRaleo',
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_EDAD,
        field: 'apEdad',
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_PESO_IDEAL,
        field: 'apPesoIdeal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_SEMANA_1,
        field: 'apPesoIncrementoSemana1',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_SEMANA_2,
        field: 'apPesoIncrementoSemana2',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_SEMANA_3,
        field: 'apPesoIncrementoSemana3',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_SEMANA_4,
        field: 'apPesoIncrementoSemana4',
        width: 200,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.PESO_INC_PROM,
        field: 'apPesoIncrementoPromedio',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.PESO_INCREMENTO_PROMEDIO,
          text: LS.PESO_INC_PROM
        }
      },
      {
        headerName: LS.TAG_BIOMASA_PROYECTADA,
        field: 'apBiomasaProyectada',
        width: 200,
        minWidth: 200,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_CONVERSION_ALIMENTICIA,
        field: 'apConversionAlimenticia',
        width: 200,
        minWidth: 200,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}