import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VerificacionCuentasSobregiradasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarFunCuentasSobregiradasTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getFunCuentasSobregiradasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarFunCuentasSobregiradasTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarFunCuentasSobregiradasTO([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto) {
    return [
      {
        headerName: LS.TAG_CUENTA,
        field: 'bgCuenta',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (params.value.length < contexto.tamanioEstructura) {
            return 'tr-negrita ';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'bgDetalle',
        width: 450,
        minWidth: 450,
        cellClass: (params) => {
          if (params.data.bgCuenta.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'bgSaldo1',
        width: 150,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.bgCuenta.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace text-right';
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