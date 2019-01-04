import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GrameajeListadoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarGrameajeTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdListadoGrameajeTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarGrameajeTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirListadoGrameaje(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteListadoGramaje", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoGramajes.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarListadoGrameaje(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteListadoGramaje", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoGramajes_");
        } else {
          this.toastr.warning("No se encontraron resultados");
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  convertirGraficoBiomasa(listaGramaje) {
    let objetoEnviar =
      [{
        name: LS.TAG_BIOMASA_POR_FECHA,
        series: []
      }];
    listaGramaje.forEach(item => {
      if (item.graBiomasa) {
        let serieBiomasa = { name: "Fecha " + item.graFecha, value: item.graBiomasa }
        objetoEnviar[0].series.push(serieBiomasa)
      }
    });
    return objetoEnviar;
  }

  convertirGraficoTalla(listaGramaje) {
    let objetoEnviar =
      [{
        name: LS.TAG_TALLA_PROMEDIO_POR_FECHA,
        series: []
      }];
    listaGramaje.forEach(item => {
      if (item.graBiomasa) {
        let serieTalla = { name: "Fecha " + item.graFecha, value: item.gratPromedio }
        objetoEnviar[0].series.push(serieTalla)
      }
    });
    return objetoEnviar;
  }

  convertirGraficoBiomasaTalla(listaGramaje) {
    let objetoEnviar =
      [{
        name: LS.TAG_BIOMASA,
        series: []
      },
      {
        name: LS.TAG_TALLA_PROMEDIO,
        series: []
      }];
    listaGramaje.forEach(item => {
      if (item.graBiomasa) {
        let serieBiomasa = { name: "Fecha" + item.graFecha, value: item.graBiomasa }
        objetoEnviar[0].series.push(serieBiomasa);
        let serieTalla = { name: "Fecha" + item.graFecha, value: item.gratPromedio }
        objetoEnviar[1].series.push(serieTalla);
      }
    });
    return objetoEnviar;
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_FECHA,
        field: 'graFecha',
        width: 80,
        minWidth: 80,
      },
      {
        headerName: LS.TAG_TALLA_PROMEDIO,
        field: 'gratPromedio',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.INCREMENTO_PROMEDIO,
        field: 'graiPromedio',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.BALANCEADO_ACUMULADO,
        field: 'gratBalanceadoAcumulado',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_BIOMASA,
        field: 'graBiomasa',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.SOBREVIVENCIA,
        field: 'graSobrevivencia',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_COMENTARIO,
        field: 'graComentario',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
