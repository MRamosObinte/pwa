import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InvTransferenciaMotivoTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoTO';

@Injectable({
  providedIn: 'root'
})
export class MotivoTransferenciasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private auth: AuthService,
  ) { }

  listarInvTransferenciaMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaTransferenciaMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvTransferenciaMotivoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvTransferenciaMotivoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  setearValoresInvTransferenciaMotivo(invTransferenciaMotivoTO: InvTransferenciaMotivoTO) {
    invTransferenciaMotivoTO.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invTransferenciaMotivoTO.usrCodigo = this.auth.getCodigoUser().trim();
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'tmCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'tmDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'tmInactivo',
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
