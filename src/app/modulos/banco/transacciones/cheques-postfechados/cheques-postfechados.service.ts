import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class ChequesPostfechadosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  insertarContableDeposito(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/insertarContableDeposito", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarContableDeposito(respuesta);
        } else {
          this.utilService.generarSwal(LS.BANCO_CONTABLE_DEPOSITO, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosParaChequesPostfechados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/obtenerDatosParaChequesPostfechados", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosParaChequesPostfechados(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarChequesPostfechados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/listarChequesPostfechados", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarChequesPostfechados(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirChequePostfechado(parametros, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/bancoWebController/generarChequesPostfechados", parametros, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('listadoChequePostfechado.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarChequePostfechado(parametros, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/bancoWebController/exportarChequesPostfechados", parametros, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "listadoChequePostfechado_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 38,
        minWidth: 38,
        maxWidth: 38,
        cellClass: (params) => {
          return 'text-center'
        },
        hide: contexto.consulta
      },
      {
        headerName: LS.TAG_BANCO,
        field: 'banNombre',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_CUENTA,
        field: 'detCuenta',
        width: 100,
        minWidth: 100,
        maxWitdh: 100
      },
      {
        headerName: LS.TAG_FECHA_VENCIMIENTO,
        field: 'detFechaVencimiento',
        width: 140,
        minWidth: 140,
        maxWitdh: 140
      },
      {
        headerName: LS.TAG_REFERENCIA,
        field: 'detReferencia',
        width: 100,
        minWidth: 100,
        hide: contexto.clienteCodigo
      },
      {
        headerName: LS.TAG_VALOR,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        field: 'detValor',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'detObservaciones',
        width: 200,
        minWidth: 200
      }
    );
    return columnas;
  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

