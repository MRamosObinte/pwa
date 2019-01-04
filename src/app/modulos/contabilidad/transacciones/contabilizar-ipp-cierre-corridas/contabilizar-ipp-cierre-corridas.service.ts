import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ContabilizarIppCierreCorridasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaContabilizarCorridaTO(parametros, contexto, empresa) {
    this.api.post("todocompuWS/produccionWebController/getListaContabilizarCorridaTO", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length > 1) {
          contexto.despuesDeListaContabilizarCorridaTO(respuesta.extraInfo);
        } else if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length === 1) {
          this.toastr.warning(LS.MSJ_NO_RESULTADOS, LS.TAG_AVISO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarModificarContabilizarCorrida(parametros, contexto, empresa) {
    this.api.post("todocompuWS/contabilidadWebController/insertarModificarContabilizarCorrida", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.utilService.generarSwal(LS.TITULO_IPP_CONTABILIZAR_CIERRE_CORRIDAS, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
          contexto.limpiarResultado();
          contexto.enviarActivar.emit(false);
        } else {
          this.utilService.generarSwal(LS.TITULO_IPP_CONTABILIZAR_CIERRE_CORRIDAS, LS.SWAL_ERROR, respuesta.operacionMensaje);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(): any {
    return [
      { headerName: LS.TAG_SECTOR, field: 'secCodigo', width: 110, minWidth: 110, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' },
      { headerName: LS.TAG_PISCINA, field: 'pisNumero', width: 110, minWidth: 110, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' },
      {
        headerName: LS.TAG_IPP_CORRIDA,
        field: 'rcCorridaNumero',
        width: 110,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.IPP + ' ' + LS.TAG_CORRIDA,
          text: LS.TAG_IPP_CORRIDA
        },
        cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left',
      },
      {
        headerName: LS.TAG_DESDE, field: 'rcFechaDesde', width: 115, minWidth: 115, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left'
      },
      { headerName: LS.TAG_HASTA, field: 'rcFechaHasta', width: 115, minWidth: 115, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' },
      { headerName: LS.TAG_COSTO, field: 'rcCosto', width: 110, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-right', valueFormatter: this.formatearTotales },
      {
        headerName: LS.TAG_IPP_DIRECTO, field: 'rcDirecto', width: 110, minWidth: 110,
        cellClass: (params) => this.negritaSubtotales(params) + ' text-md-right', valueFormatter: this.formatearTotales,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.IPP + ' ' + LS.TAG_DIRECTO,
          text: LS.TAG_IPP_DIRECTO
        }
      },
      {
        headerName: LS.TAG_IPP_INDIRECTO, field: 'rcIndirecto', width: 110, minWidth: 110,
        cellClass: (params) => this.negritaSubtotales(params) + ' text-md-right', valueFormatter: this.formatearTotales,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.IPP + ' ' + LS.TAG_INDIRECTO,
          text: LS.TAG_IPP_INDIRECTO
        }
      },
      { headerName: LS.TAG_TRANSFERENCIA, field: 'rcCostoTransferencia', width: 110, minWidth: 110, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-right', valueFormatter: this.formatearTotales }
    ]
  }

  formatearTotales(params) {
    let a = new DecimalPipe('en-US').transform(params.value, '1.2-2');
    return a;
  }

  negritaSubtotales(params): string {
    if (!params.data || !params.data.empCodigo) {
      return 'tr-negrita';
    } else {
      return '';
    }
  }

}
