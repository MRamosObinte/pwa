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
export class AnticipoClienteSaldoGeneralService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarListaCuentasPorCobrarAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarListaCuentasPorCobrarAnticiposTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarListaCuentasPorCobrarAnticipos(respuesta.extraInfo);
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

  imprimirCuentasPorCobrarAnticipos(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCuentasPorCobrarAnticipos", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCuentasPorCobrarAnticipos.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCuentasPorCobrarAnticiposo(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCuentasPorCobrarAnticipos", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCuentasPorCobrarAnticipos_");
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
        headerName: LS.TAG_CODIGO,
        field: 'cxpgCodigo',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'cxpgNombre',
        width: 250,
        minWidth: 200,
        cellClass: (params) => {
          if (!params.data.cxpgCodigo) {
            return 'tr-negrita ';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'cxpgSaldo',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.cxpgCodigo) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_ANTICIPOS,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'cxpgAnticipos',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.cxpgCodigo) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'cxpgTotal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.cxpgCodigo) {
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
          if (params.data.cxpgCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.ACCION_CONSULTAR_SALDOS,
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