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
export class CobrosListadoVentasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarCarFunCuentasPorCobrarListadoVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/carteraWebController/getCarFunCuentasPorCobrarListadoVentasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarCarFunCuentasPorCobrarListadoVentas(respuesta.extraInfo);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
          }
        } else {
          contexto.despuesDeListarCarFunCuentasPorCobrarListadoVentas([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirCarFunCuentasPorCobrarListadoVentas(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/carteraWebController/generarReporteCarFunCuentasPorCobrarListadoVentas", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoCarFunCuentasPorCobrarListadoVentas.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarCarFunCuentasPorCobrarListadoVentas(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/carteraWebController/exportarReporteCarFunCuentasPorCobrarListadoVentas", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoCarFunCuentasPorCobrarListadoVentas_");
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
        width: 80,
        minWidth: 80
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
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'cxcdCliente',
        width: 250,
        minWidth: 200,
        cellClass: (params) => {
          if (!params.data.cxcdPeriodo) {
            return 'text-whitespace tr-negrita';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_FECHA_EMISION,
        field: 'cxcdFechaEmision',
        width: 130,
        minWidth: 130
      },
      {
        headerName: LS.TAG_FECHA_VENCIMIENTO,
        field: 'cxcdFechaVencimiento',
        width: 130,
        minWidth: 130
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
      }
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
