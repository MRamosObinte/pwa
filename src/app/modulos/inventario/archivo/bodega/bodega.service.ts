import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class BodegaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarInvListaBodegasTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaBodegasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvListaBodegasTO(respuesta.extraInfo);
        } else {
          if (contexto.isModal && !contexto.esKardex) {
            contexto.activeModal.dismiss();
          }
          contexto.despuesDeListarInvListaBodegasTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarInvListaBodegasPorSector(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaBodegasPorSector", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvListaBodegasPorSector(respuesta.extraInfo);
        } else {
          if (contexto.isModal && !contexto.esKardex) {
            contexto.activeModal.dismiss();
          }
          contexto.despuesDeListarInvListaBodegasPorSector([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  getBodegaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getBodegaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetBodegaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarInvComboBodegaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvComboBodegaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvComboBodegaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvComboBodegaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  insertarBodegaTO(parametro, contexto, bodegaCopia, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarBodegaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarBodega(respuesta.operacionMensaje, bodegaCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarBodegaTO(parametro, contexto, bodegaCopia, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarBodegaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarBodega(respuesta.operacionMensaje, bodegaCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  seleccionarSector(listaSectores, codigo) {
    return listaSectores.find(item => item.secCodigo == codigo);
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
        field: 'bodCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'bodNombre',
        width: 500,
        minWidth: 500
      },
      {
        headerName: LS.TAG_CP,
        field: 'codigoCP',
        width: 150,
        minWidth: 150,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CENTRO_PRODUCCION,
          text: LS.TAG_CP,
          enableSorting: true
        }
      },
    ];
    if (!isModal) {
      columnDefs.push({
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'bodInactiva',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      })
      columnDefs.push(this.utilService.getColumnaOpciones())
    }

    return columnDefs;
  }
}
