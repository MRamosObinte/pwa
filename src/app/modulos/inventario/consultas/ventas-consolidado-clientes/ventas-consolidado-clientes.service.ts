import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VentasConsolidadoClientesService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvFunVentasConsolidandoClientesTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunVentasConsolidandoClientesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunVentasConsolidandoClientesTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunVentasConsolidandoClientesTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_N_IDENTIFICACION,
        field: 'vtaIdentificacion',
        width: 200,
        minWidth: 200,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_IDENTIFICACION,
          text: LS.TAG_N_IDENTIFICACION
        },
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'vtaNombreCliente',
        width: 150,
        minWidth: 150,
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_N_COMPLEMENTO,
        field: 'vtaNumeroComprobantes',
        width: 200,
        minWidth: 200,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_COMPLEMENTO,
          text: LS.TAG_N_COMPLEMENTO
        },
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita' : 'text-whitespace' }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'vtaBase0',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'vtaBaseimponible',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_MONTO_IVA,
        field: 'vtaMontoiva',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'vtaTotal',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.vtaNombreCliente) ? 'tr-negrita text-right' : 'text-whitespace text-right' }
      }
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

