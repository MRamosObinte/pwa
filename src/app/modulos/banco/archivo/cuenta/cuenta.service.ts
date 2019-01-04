import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  obtenerDatosParaCrudCuentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/obtenerDatosParaCrudCuentas", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudCuentas(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.isModal ? contexto.activeModal.close() : null;
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto))
  }

  listarInvListaCuentasTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getListaBanCuentaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta) {
          contexto.despuesDeListarInvListaCuentasTO(respuesta);
        } else {
          contexto.despuesDeListarInvListaCuentasTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarGetBanComboBancoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getBanComboBancoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta) {
          contexto.despuesDeGetBanComboBancoTO(respuesta);
        } else {
          contexto.despuesDeGetBanComboBancoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  getCuentaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/bancoWebController/getBancoCuentaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetCuentaTO(respuesta.extraInfo);
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
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
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
        headerName: LS.TAG_BANCO,
        field: 'banBanco',
        width: 80,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'ctaNumero',
        width: 80,
        minWidth: 100
      },
      {
        headerName: LS.TAG_TITULAR,
        field: 'ctaTitular',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_OFICIAL,
        field: 'ctaOficial',
        width: 120,
        minWidth: 100
      },
      {
        headerName: LS.TAG_FORMATO_CHEQUE,
        field: 'ctaFormatoCheque',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_CUENTA_CONTABLE,
        field: 'ctaCuentaContable',
        width: 100,
        minWidth: 100
      },
      !isModal ? this.utilService.getColumnaOpciones() : null
    ];

    return columnDefs;
  }
}
