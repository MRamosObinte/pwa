import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MotivoComprasService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService) { }

  listarInvComprasMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvComprasMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvComprasMotivoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvComprasMotivoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarInvComprasMotivoTO(parametro, contexto, invCompraMotivoTOCopia, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvComprasMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarInvComprasMotivoTO(respuesta.operacionMensaje, invCompraMotivoTOCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarInvComprasMotivoTO(parametro, contexto, invCompraMotivoTOCopia, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarInvComprasMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarInvComprasMotivoTO(respuesta.operacionMensaje, invCompraMotivoTOCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'cmCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'cmDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        field: 'tipCodigo',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'cmInactivo',
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
