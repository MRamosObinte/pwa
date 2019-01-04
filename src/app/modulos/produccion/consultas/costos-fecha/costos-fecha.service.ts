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
export class CostosFechaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCostosFecha(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdListadoCostoDetalleFechaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarCostosFecha(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCostoFecha(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteCostoDetalleFecha", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoPrdFunCostosPorFecha.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarCostoFecha(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteCostoDetalleFecha", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoCostoPorFecha_");
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
        headerName: LS.TAG_PRODUCTO,
        field: 'costoProducto',
        width: 200,
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
        width: 70,
        minWidth: 70,
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'costoMedida',
        width: 70,
        minWidth: 70,
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
        width: 80,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: 'text-whitespace text-right',
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'costoTotal',
        width: 80,
        minWidth: 80,
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
        width: 80,
        minWidth: 80,
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
