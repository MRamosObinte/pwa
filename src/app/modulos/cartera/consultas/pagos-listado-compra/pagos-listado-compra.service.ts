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
export class PagosListadoCompraService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCuentasPorPagarListadoCompras(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarFunCuentasPorPagarListadoComprasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCuentasPorPagarListadoCompras(respuesta.extraInfo);
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

  imprimirCuentasPorPagarListadoCompras(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarFunCuentasPorPagarListadoCompras", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCuentasPorPagarListadoComprass.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCuentasPorPagarListadoCompras(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCuentasPorPagarListadoCompras", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCuentasPorPagarListadoCompras_");
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
        field: 'cxpdPeriodo',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'cxpdMotivo',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'cxpdNumero',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'cxpdProveedor',
        width: 250,
        minWidth: 200,
        cellClass: (params) => {
          if (!params.data.cxpdPeriodo) {
            return 'text-whitespace tr-negrita';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_FECHA_EMISION,
        field: 'cxpdFechaEmision',
        width: 130,
        minWidth: 130
      },
      {
        headerName: LS.TAG_FECHA_VENCIMIENTO,
        field: 'cxpdFechaVencimiento',
        width: 130,
        minWidth: 130
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'cxpdSaldo',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (!params.data.cxpdPeriodo) {
            return 'tr-negrita text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      }
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}