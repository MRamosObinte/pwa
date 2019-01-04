import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class ResumenSiembraService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  consultarFechaMaxMinSiembra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/consultarFechaMaxMinSiembra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeconsultarFechaMaxMinSiembra(respuesta.extraInfo);
        } else {
          contexto.despuesDeconsultarFechaMaxMinSiembra(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarResumenCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaResumenCorridaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarResumenCorrida(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarResumenCorrida([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirResumenSiembra(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteResumenSiembra", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoResumenSiembra.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarResumenSiembra(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteResumenSiembra", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoResumenSiembra_");
        } else {
          this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  convertirGrafico(listaResumenSiembra) {
    let objetoEnviar =
      [{
        name: LS.TAG_COSTOS_POR_HECTAREA,
        series: []
      }];
    listaResumenSiembra.forEach(item => {
      if (item.pisNumero) {
        let objeto = {name: "P" + item.pisNumero + "C-" + item.rcCorridaNumero, value: item.rcCostoHectarea
        }
        objetoEnviar[0].series.push(objeto)
      }
    });

    return objetoEnviar;
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PISCINA,
        field: 'pisNumero',
        width: 120,
        minWidth: 120,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'rcCorridaNumero',
        width: 120,
        minWidth: 120,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_FECHA_SIEMBRA,
        field: 'rcFechaSiembra',
        width: 120,
        minWidth: 120,
        pinned: 'left',
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita ' : '' }
      },
      {
        headerName: LS.TAG_HECTAREAJE,
        field: 'rcHectareaje',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },

      {
        headerName: LS.TAG_EDAD,
        field: 'rcEdad',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
      },
      {
        headerName: LS.TAG_DIAS_MUERTOS,
        field: 'rcDiasMuertos',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
      },
      {
        headerName: LS.TAG_LARVAS,
        field: 'rcNumeroLarvas',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
      },
      {
        headerName: LS.TAG_DENSIDAD,
        field: 'rcDensidad',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
      },
      {
        headerName: LS.TAG_LABORATORIO,
        field: 'rcLaboratorio',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_NAUPLIO,
        field: 'rcNauplio',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_BALANCEADO,
        field: 'rcLibrasBalanceados',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_BIOMASA,
        field: 'rcBiomasa',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_BIOMASA_REAL,
        field: 'rcBiomasaReal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_CONVERSION,
        field: 'rcConversion',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_TAMANIO_PROMEDIO,
        field: 'rcTPromedio',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_PESO_IDEAL,
        field: 'rcPesoIdeal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_SOBREVIVENCIA,
        field: 'rcSobrevivencia',
        width: 100,
        minWidth: 100,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita' : '' }
      },
      {
        headerName: LS.TAG_COSTO,
        field: 'rcCosto',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita ' : '' }
      },
      {
        headerName: LS.TAG_DIRECTO,
        field: 'rcDirecto',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_INDIRECTO,
        field: 'rcIndirecto',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_COSTO_TRANSFERENCIA,
        field: 'rcCostoTransferencia',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_TOTAL_DIAS,
        field: 'rcCostoTotalDia',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_DIA_DIRECTO,
        field: 'rcCostoDirectoDia',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_DIA_INDIRECTO,
        field: 'rcCostoindirectoDia',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_HECTAREAS,
        field: 'rcResultadoHectarea',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'd-none' : 'text-center' },
        cellRendererFramework: BotonOpcionesComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: '',
          enableSorting: false
        }
      }
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
