import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  getListaSisUsuario(parametro, contexto, empresa) {
    this.api.post("todocompuWS/sistemaWebController/getListaSisUsuario", parametro, empresa)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarUsuario(data.extraInfo);
        } else {
          contexto.cargando = false;
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  listarSisUsuario(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getListaSisUsuario", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSisUsuario(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarSisUsuario([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  getIsPeriodoAbierto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getIsPeriodoAbierto", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerIsPeriodoAbierto(data.extraInfo);
        } else {
          contexto.despuesDeObtenerIsPeriodoAbierto(false);
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

}
