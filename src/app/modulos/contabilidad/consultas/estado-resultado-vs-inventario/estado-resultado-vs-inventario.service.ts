import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EstadoResultadoVsInventarioService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }
  listarBalanceResultadosVsInventarioTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getConListaBalanceResultadosVsInventarioTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarBalanceResultadosVsInventarioTO([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarBalanceResultadosVsInventarioTO(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarBalanceResultadosVsInventarioTO([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto) {
    return [
      {
        headerName: LS.TAG_CUENTA,
        field: 'vriCuentaContable',
        width: 100,
        minWidth: 100,
        cellClass: (params) => {
          if (params.value.length < contexto.tamanioEstructura) {
            return 'tr-negrita ';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'vriNombre',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (params.data.vriCuentaContable.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_SALDO_CONTABLE,
        field: 'vriSaldoContable',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.vriCuentaContable.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_INV_INICIAL,
        field: 'vriInventarioInicial',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.vriCuentaContable.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace text-right';
          } else {
            return 'text-whitespace text-right';
          }
        }
      },
      {
        headerName: LS.TAG_DIFERENCIA,
        field: 'vriDiferencia',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          if (params.data.vriCuentaContable.length < contexto.tamanioEstructura) {
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