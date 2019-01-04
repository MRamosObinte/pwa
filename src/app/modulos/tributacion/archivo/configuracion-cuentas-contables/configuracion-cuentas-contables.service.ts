import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionCuentasContablesService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerAnexoCuentasContables(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxCuentasContablesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeObtenerAnexoCuentasContables(null);
            contexto.cargando = false;
            contexto.vistaFormulario = false;
          } else {
            contexto.despuesDeObtenerAnexoCuentasContables(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeObtenerAnexoCuentasContables(null);
          contexto.cargando = false;
          contexto.vistaFormulario = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerAnxCuentasContablesObjetosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxCuentasContablesObjetosTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeObtenerAnxCuentasContablesObjetosTO(null);
            contexto.cargando = false;
            contexto.vistaFormulario = false;
          } else {
            contexto.despuesDeObtenerAnxCuentasContablesObjetosTO(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeObtenerAnxCuentasContablesObjetosTO(null);
          contexto.cargando = false;
          contexto.vistaFormulario = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
  actualizarAnexoCuentasContables(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/actualizarAnxCuentasContables", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.cargando = false;
            contexto.vistaFormulario = false;
          } else {
            contexto.despuesDeActualizarAnexoListaConsolidadoRetencionesVentas(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
}
