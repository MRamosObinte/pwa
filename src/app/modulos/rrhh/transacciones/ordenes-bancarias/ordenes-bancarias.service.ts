import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesBancariasService {

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private archivoService: ArchivoService,
  ) { }

  // el extraInfo retorna listas para llenar combos
  obtenerDatosParaCrudOrdenesBancarias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaCrudOrdenesBancarias", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudOrdenesBancarias(data.extraInfo);
        } else {
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarOrdenBancaria(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhListaOrdenBancariaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGenerarOrdenBancaria(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarExcelOrdenBancaria(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteOrdenBancaria", parametro, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoOrdenBancaria_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  /**Metodo para exportar el listado de plan de cuentas en formato txt */
  exportarTxtOrdenBancaria(parametro, contexto, empresaSelect) {
    this.archivoService.postTxt("todocompuWS/rrhhWebController/exportarReporteTxtOrdenBancaria", parametro, empresaSelect)
      .then(data => {
        if (data) {
          contexto.descargarArchivoTxt(data._body);
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnasBolivariano(): Array<any> { // bolivariano
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_TIPO_REGISTRO,
        width: 120,
        minWidth: 120,
        field: 'preTipoRegistro'
      },
      {
        headerName: LS.TAG_SECUENCIAL,
        width: 100,
        minWidth: 100,
        field: 'preSecuencial'
      },
      {
        headerName: LS.TAG_CODIGO_BENEFICIARIO,
        width: 140,
        minWidth: 140,
        field: 'preBeneficiarioCodigo'
      },
      {
        headerName: LS.TAG_TIPO_ID_BENEFICIARIO,
        width: 150,
        minWidth: 150,
        field: 'preBeneficiarioTipoId'
      },
      {
        headerName: LS.TAG_NUMERO_BENEFICIARIO,
        width: 150,
        minWidth: 150,
        field: 'preBeneficiarioNumeroId'
      },
      {
        headerName: LS.TAG_NOMBRE_BENEFICIARIO,
        width: 200,
        minWidth: 200,
        field: 'preBeneficiarioNombre'
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        width: 125,
        minWidth: 125,
        field: 'preFormaPago'
      },
      {
        headerName: LS.TAG_CODIGO_PAIS,
        width: 120,
        minWidth: 120,
        field: 'preCodigoPais'
      },
      {
        headerName: LS.TAG_CODIGO_BANCO,
        width: 150,
        minWidth: 150,
        field: 'preCodigoBanco'
      },
      {
        headerName: LS.TAG_TIPO_CUENTA,
        width: 120,
        minWidth: 120,
        field: 'preCuentaTipo'
      },
      {
        headerName: LS.TAG_NUMERO_CUENTA,
        width: 150,
        minWidth: 150,
        field: 'preCuentaNumero'
      },
      {
        headerName: LS.TAG_CODIGO_MONEDA,
        width: 150,
        minWidth: 150,
        field: 'preCodigoMoneda',
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
      },
      {
        headerName: LS.TAG_TOTAL_PAGADO,
        width: 150,
        minWidth: 150,
        field: 'preTotalPagado',
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        valueFormatter: (params) => {
          return params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
      },
      {
        headerName: LS.TAG_CONCEPTO,
        width: 120,
        minWidth: 120,
        field: 'preConcepto',
      },
      {
        headerName: LS.TAG_CODIGO_BANCARIO,
        width: 140,
        minWidth: 140,
        field: 'preCodigoBancario'
      },
      {
        headerName: LS.TAG_CODIGO_SERVICIO,
        width: 150,
        minWidth: 150,
        field: 'preCodigoServicio'
      },
      {
        headerName: LS.TAG_MOTIVO_PAGO,
        width: 150,
        minWidth: 150,
        field: 'preMotivoPago'
      },
    );
    return columnas;
  }

  generarFilaTotalBolivariano(): Array<any> { //  bolivariano
    return [
      {
        preTipoRegistro: null,
        preSecuencial: null,
        preBeneficiarioCodigo: null,
        preBeneficiarioTipoId: null,
        preBeneficiarioNumeroId: null,
        preBeneficiarioNombre: null,
        preFormaPago: null,
        preCodigoPais: null,
        preCodigoBanco: null,
        preCuentaTipo: null,
        preCuentaNumero: null,
        preCodigoMoneda: LS.TAG_TOTAL_PUNTOS,
        preTotalPagado: 0,
        preConcepto: null,
        preCodigoBancario: null,
        preCodigoServicio: null,
        preMotivoPago: null
      }
    ]
  }

  generarColumnasPichincha(): Array<any> { // pichincha
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_TIPO_REGISTRO,
        width: 120,
        minWidth: 120,
        field: 'preTipoRegistro'
      },
      {
        headerName: LS.TAG_SECUENCIAL,
        width: 100,
        minWidth: 100,
        field: 'preSecuencial'
      },
      {
        headerName: LS.TAG_MONEDA,
        width: 100,
        minWidth: 100,
        field: 'preMoneda',
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
      },
      {
        headerName: LS.TAG_TOTAL_PAGADO,
        width: 120,
        minWidth: 120,
        field: 'preTotalPagado',
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        valueFormatter: (params) => {
          return params.value ? this.formatearA2Decimales(params) : null
        },
      },
      {
        headerName: LS.TAG_CUENTA,
        width: 100,
        minWidth: 100,
        field: 'preCuenta'
      },
      {
        headerName: LS.TAG_CUENTA_TIPO,
        width: 120,
        minWidth: 120,
        field: 'preCuentaTipo'
      },
      {
        headerName: LS.TAG_NUMERO_CUENTA,
        width: 150,
        minWidth: 150,
        field: 'preCuentaNumero'
      },
      {
        headerName: LS.TAG_REFERENCIA,
        width: 150,
        minWidth: 150,
        field: 'preReferencia'
      },
      {
        headerName: LS.TAG_TIPO_ID_BENEFICIARIO,
        width: 150,
        minWidth: 150,
        field: 'preBeneficiarioTipoId'
      },
      {
        headerName: LS.TAG_NUMERO_BENEFICIARIO,
        width: 150,
        minWidth: 150,
        field: 'preBeneficiarioNumeroId'
      },
      {
        headerName: LS.TAG_NOMBRE_BENEFICIARIO,
        width: 200,
        minWidth: 200,
        field: 'preBeneficiarioNombre'
      },
      {
        headerName: LS.TAG_CODIGO_BANCO,
        width: 150,
        minWidth: 150,
        field: 'preCodigoBanco'
      },
    );
    return columnas;
  }

  generarFilaTotalPichincha(): Array<any> { //  pichincha
    return [
      {
        preTipoRegistro: null,
        preSecuencial: null,
        preMoneda: LS.TAG_TOTAL_PUNTOS,
        preTotalPagado: 0,
        preCuenta: null,
        preCuentaTipo: null,
        preCuentaNumero: null,
        preReferencia: null,
        preBeneficiarioTipoId: null,
        preBeneficiarioNumeroId: null,
        preBeneficiarioNombre: null,
        preCodigoBanco: null
      }
    ]
  }

  formatearA2Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return new DecimalPipe('en-US').transform(value, '1.2-2');
  }
}
