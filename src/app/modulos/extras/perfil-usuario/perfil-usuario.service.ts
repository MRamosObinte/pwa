import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  buscarUsuarioPorNick(parametro, contexto) {
    this.api.post("todocompuWS/sistemaWebController/buscarUsuarioPorNick", parametro, '')
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeBuscarUsuarioPorNick(respuesta.extraInfo);
        } else {
          contexto.despuesDeBuscarUsuarioPorNick([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarSisUsuarioWebTO(parametro, contexto) {
    this.api.post("todocompuWS/sistemaWebController/modificarSisUsuarioWebTO", parametro, '')
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarSisUsuarioWebTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  validarClaveActual(parametro, contexto) {
    this.api.post("todocompuWS/sistemaWebController/claveActualValida", parametro, '')
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarClaveActual(respuesta.extraInfo);
        } else {
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  guardarImagenEmpresa(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/guardarImagenEmpresa", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.guardarImagen(respuesta.extraInfo);
        } else {
          contexto.guardarImagen([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }
}
