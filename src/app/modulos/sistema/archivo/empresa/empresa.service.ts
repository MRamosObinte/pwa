import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  getColumnasEstadosFinancieros(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getColumnasEstadosFinancieros", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetColumnasEstadosFinancieros(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerEmpresa(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/obtenerEmpresa", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerEmpresa(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarEmpresasParaAdministracion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/getListaSisEmpresaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarEmpresasParaAdministracion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarSisEmpresa(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/sistemaWebController/modificarSisEmpresa", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarSisEmpresa(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(): Array<any> {
    return [
      {
        headerName: LS.TAG_RUC_ID,
        field: 'empRuc',
        width: 250
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'empNombre',
        width: 300,
      },
      {
        headerName: LS.TAG_ACTIVIDAD,
        width: 250,
        valueGetter: (params) => {
          return params.data.parametros && params.data.parametros[0] ? params.data.parametros[0].parActividad : params.data.parActividad;
        }
      },
      {
        headerName: LS.TAG_TELEFONO,
        field: 'empTelefono',
        width: 250
      },
      this.utilService.getColumnaOpciones()
    ];
  }

  verificarPermiso(accion, contexto, mostrarMensaje){
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
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
      case LS.ACCION_IMPRIMIR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }
  
}
