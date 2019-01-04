import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarInvListaBancosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getListaBanBancoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta) {
          contexto.despuesDeListarInvListaBancosTO(respuesta);
        } else {
          contexto.despuesDeListarInvListaBancosTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  getBancoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getBancoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetBancoTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  /**
* Verifica los permisos
* @param {*} accion
* @param {*} contexto
* @param {*} [mostrarMensaje]
* @returns {boolean}
* @memberof UnidadMedidaService
*/
  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'banCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'banNombre',
        width: 500,
        minWidth: 500
      },
      !isModal ? this.utilService.getColumnaOpciones() : null
    ];

    return columnDefs;
  }
}
