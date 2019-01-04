import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ContabilizarMaterialDirectoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  existenConsumosPendientes(parametros, contexto, empresa): Promise<any> {
    return this.api.post("todocompuWS/contabilidadWebController/getListaInvConsultaConsumosPendientes", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          return false;//No hay pendientes
        } else if (respuesta && respuesta.estadoOperacion === LS.KEY_ADVERTENCIA && respuesta.extraInfo) {
          return respuesta;//Hay pendientes
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          return [];//No hay respuesta
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarIPP(parametros, contexto, empresa) {
    this.api.post("todocompuWS/contabilidadWebController/getFunListaIPP", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length > 1) {
          contexto.despuesDeListarIPP(respuesta.extraInfo);
        } else if (respuesta && respuesta.extraInfo && respuesta.extraInfo.length === 1) {
          this.toastr.warning(LS.MSJ_NO_RESULTADOS, LS.TAG_AVISO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarTodoProceso(parametros, contexto, empresa) {
    this.api.post("todocompuWS/contabilidadWebController/listarTodoProceso", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo ) {
          contexto.despuesDeListarTodoProceso(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarModificarIPP(parametros, contexto, empresa) {
    this.api.post("todocompuWS/contabilidadWebController/insertarModificarIPP", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          this.utilService.generarSwal(LS.TITULO_IPP_CONTABILIZAR_CIERRE_CORRIDAS, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
          contexto.limpiarResultado();
          contexto.enviarActivar.emit(false);
        } else {
          this.utilService.generarSwal(LS.TITULO_IPP_CONTABILIZAR, LS.SWAL_ERROR, respuesta.operacionMensaje);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  contabilizarTodoProceso(parametros, contexto, empresa) {
    this.api.post("todocompuWS/contabilidadWebController/insertarModificarContablesIPPTodo", parametros, empresa)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.utilService.generarSwal(LS.TITULO_IPP_CONTABILIZAR_CIERRE_CORRIDAS, LS.SWAL_SUCCESS, respuesta.operacionMensaje);
          contexto.limpiarResultado();
          contexto.enviarActivar.emit(false);
        } else {
          this.utilService.generarSwal(LS.TITULO_IPP_CONTABILIZAR, LS.SWAL_ERROR, respuesta.operacionMensaje);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(): any {
    return [
      { headerName: LS.TAG_SECTOR, field: 'costoSector', width: 150, minWidth: 150, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' },
      { headerName: LS.TAG_PISCINA, field: 'costoPiscina', width: 150, minWidth: 150, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' },
      { headerName: LS.TAG_TOTAL, field: 'costoTotal', width: 200, minWidth: 200, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-right', valueFormatter: this.formatearTotales },
      { headerName: LS.TAG_CUENTA_DESDE, field: 'costoCuentaOrigen', width: 200, minWidth: 200, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' },
      { headerName: LS.TAG_CUENTA_HASTA, field: 'costoCuentaDestino', width: 200, minWidth: 200, cellClass: (params) => this.negritaSubtotales(params) + ' text-md-left' }
    ];
  }

  formatearTotales(params) {
    let a = new DecimalPipe('en-US').transform(params.value, '1.2-2');
    return a;
  }

  negritaSubtotales(params): string {
    if (params.data.costoSector === null) {
      return 'tr-negrita';
    } else {
      return '';
    }
  }

  mostrarSwalError(mensaje) {
    let parametros = {
      title: LS.TOAST_INFORMACION,
      texto: mensaje,
      type: LS.SWAL_INFO,
      confirmButtonText: "<i class='" + LS.ICON_AGREGAR + "'></i>  " + LS.LABEL_MAS_INFORMACION,
      cancelButtonText: LS.MSJ_ACEPTAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      window.open(LS.ENLACE_MANUAL_USUARIO, '_blank');
    });
  }

}
