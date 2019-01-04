import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionBancariaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarConciliacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getBanListaConciliacionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length > 1) {
            contexto.despuesDeListarConciliacion(respuesta.extraInfo);
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

  obtenerDatosConciliacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/obtenerDatosConciliacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'concCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE_CUENTA,
        field: 'conCtaDetalle',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_CUENTA,
        field: 'concCuentaContable',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FECHA_HASTA,
        field: 'concHasta',
        width: 80,
        minWidth: 80
      }
    ];
  }

  generarColumnasConciliacionDebito() {
    return [
      {
        headerName: LS.TAG_CONTABLE,
        field: 'cbContable',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'cbFecha',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'cbDocumento',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'cbValor',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-sm-right'
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'cbObservaciones',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_SECUENCIAL,
        field: 'cbSecuencial',
        width: 100,
        minWidth: 100,
        cellClass: 'text-sm-right'
      },
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
