import { Injectable } from '@angular/core';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class ResumenPescasService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  consultarFechaMaxMinPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/consultarFechaMaxMinPesca", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeconsultarFechaMaxMinPesca(respuesta.extraInfo);
        } else {
          contexto.despuesDeconsultarFechaMaxMinPesca(null);
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

  imprimirResumenPesca(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteResumenPesca", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoResumenPesca.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarResumenPesca(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteResumenPesca", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoResumenPesca_");
        } else {
          this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  convertirGrafico(listaResumenPesca) {
    let objetoEnviar =
      [{
        name: LS.TAG_COSTOS_POR_HECTAREA,
        series: []
      },
      {
        name: LS.TAG_UTILIZADA_POR_HECTAREA,
        series: []
      }];
    listaResumenPesca.forEach(item => {
      if (item.pisNumero) {
        let serieCH = { name: "P" + item.pisNumero + "C-" + item.rcCorridaNumero, value: item.rcCostoHectarea }
        objetoEnviar[0].series.push(serieCH);

        let serieUH = { name: "P" + item.pisNumero + "C-" + item.rcCorridaNumero, value: item.rcResultadoHectarea }
        objetoEnviar[1].series.push(serieUH);
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
        headerName: LS.TAG_FECHA_PESCA,
        field: 'rcFechaPesca',
        width: 120,
        minWidth: 120,
        pinned: 'left',
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita' : '' }
      },
      {
        headerName: LS.TAG_EDAD,
        field: 'rcEdad',
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
        headerName: LS.TAG_BIOMASA_REAL,
        field: 'rcBiomasaReal',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_PESO,
        field: 'rcTPromedio',
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
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_COSTO,
        field: 'rcCosto',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
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
        headerName: LS.TAG_VENTA,
        field: 'rcValorVenta',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_RESULTADO,
        field: 'rcResultado',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_COSTO_HECTAREAS,
        field: 'rcCostoHectarea',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_VENTA_HECTAREAS,
        field: 'rcVentaHectarea',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_RESULTADO_HECTAREAS,
        field: 'rcResultadoHectarea',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_COSTO_LIBRA,
        field: 'rcCostoLibra',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      },
      {
        headerName: LS.TAG_VENTA_LIBRA,
        field: 'rcVentaLibra',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.pisNumero) ? 'tr-negrita text-right' : 'text-right' }
      }, {
        headerName: LS.TAG_RESULTADO_LIBRA,
        field: 'rcResultadoLibra',
        width: 100,
        minWidth: 100,
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
        headerName: LS.TAG_TOTAL_DIAS,
        field: 'rcCostoTotalDia',
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
