import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MotivoProformasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvProformaMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvProformaMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProformaMotivoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvProformaMotivoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarInvProformasMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvProformaMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarProformasMotivoTO(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarInvProformasMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarInvProformaMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarProformasMotivoTO(respuesta);
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
        field: 'pmCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'pmDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'pmInactivo',
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
