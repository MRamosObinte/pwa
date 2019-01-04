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
export class CostosPiscinaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCostosPiscina(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdListaCostosDetalleCorridaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarCostosPiscina(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarCostosPiscina([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCostosPiscina(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteEconomicoPorPiscinas", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoEconomicoPorPiscinas.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cambiarCargando ? contexto.cambiarCargando() : contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarCostosPiscina(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteEconomicoPorPiscinas", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoEconomicoPorPiscinas_");
        } else {
          this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cambiarCargando ? contexto.cambiarCargando() : contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'costoProducto',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          if (!params.data.costoCodigo) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'costoCodigo',
        width: 50,
        minWidth: 50,
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'costoMedida',
        width: 50,
        minWidth: 50,
        cellClass: (params) => {
          if (!params.data.costoCodigo) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'costoCantidad',
        width: 50,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'costoTotal',
        width: 50,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.costoCodigo) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'costoPorcentaje',
        width: 50,
        minWidth: 50,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.costoCodigo) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.costoCodigo) {
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
    ]
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
