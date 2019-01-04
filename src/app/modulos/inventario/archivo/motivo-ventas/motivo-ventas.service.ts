import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MotivoVentasService {
  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService) { }

  listarInvVentaMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvVentasMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvVentaMotivoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvVentaMotivoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarVentaMotivoComboTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaVentaMotivoComboTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarVentaMotivoComboTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarVentaMotivoComboTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarInvVentasMotivoTO(parametro, contexto, invVentaMotivoTOCopia, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvVentasMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarInvVentasMotivoTO(respuesta.operacionMensaje, invVentaMotivoTOCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarInvVentaMotivoTO(parametro, contexto, invVentaMotivoTOCopia, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarInvVentasMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarInvVentasMotivoTO(respuesta.operacionMensaje, invVentaMotivoTOCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'vmCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'vmDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        field: 'tipCodigo',
        width: 300,
        minWidth: 300
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'vmInactivo',
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
