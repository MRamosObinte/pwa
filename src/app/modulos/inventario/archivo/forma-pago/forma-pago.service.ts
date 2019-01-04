import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarInvListaComprasFormaPagoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvComprasFormaPagoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvListaComprasFormaPagoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvListaComprasFormaPagoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarComboFormaPagoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getComboFormaPagoCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarComboFormaPagoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarComboFormaPagoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


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
        field: 'fpDetalle',
        width: 400,
        minWidth: 400
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
        field: 'fpInactivo',
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
