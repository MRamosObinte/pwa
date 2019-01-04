import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarPeriodos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getListaSisPeriodos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPeriodos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarPeriodos([]);
        }
        contexto.cargando = false;
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerSisPeriodo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/obtenerSisPeriodo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerSisPeriodo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo validar fecha por el perido
  getPeriodoPorFecha(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getPeriodoPorFecha", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGetPeriodoPorFecha(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.despuesDeGetPeriodoPorFecha(null);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

}
