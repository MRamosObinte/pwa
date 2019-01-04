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
export class CuentasCobrarDetalladoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarListaCuentasPorCobrarDetallado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarListaCuentasPorCobrarDetalladoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarListaCuentasPorCobrarDetallado(respuesta.extraInfo);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCarListaCuentasPorCobrarDetallado(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarListaCuentasPorCobrarDetallado", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarListaCuentasPorCobrarDetallado.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCarListaCuentasPorCobrarDetallado(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarListaCuentasPorCobrarDetallado", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarListaCuentasPorCobrarDetallado_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PERIODO,
        field: 'cxcdPeriodo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'cxcdMotivo',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'cxcdNumero',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'cxcdCliente',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (!params.data.cxcdPeriodo) {
            return 'tr-negrita ';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_FECHA_EMISION,
        field: 'cxcdFechaEmision',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_VENCIMIENTO,
        field: 'cxcdFechaVencimiento',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'cxcdSaldo',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.cxcdPeriodo) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.cxcdPeriodo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.ACCION_CONSULTAR_VENTAS,
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
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

