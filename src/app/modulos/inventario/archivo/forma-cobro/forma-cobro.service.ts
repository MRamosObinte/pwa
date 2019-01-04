import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class FormaCobroService {
  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService) { }

  listarInvListaInvVentasFormaCobroTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvVentasFormaCobroTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvListarInvVentasFormaCobroTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvListarInvVentasFormaCobroTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
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

  seleccionarSector(listaSectores, codigo) {
    return listaSectores.find(item => item.secCodigo == codigo);
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CUENTA,
        field: 'ctaCodigo',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'fcDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'fcTipoPrincipal',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'secCodigo',
        width: 90,
        minWidth: 90
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'fcInactivo',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
