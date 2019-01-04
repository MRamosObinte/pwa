import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InvProductoPresentacionCajasTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionCajasTO';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductoPresentacionCajasService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) {
  }

  listarPresentacionCajaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaPresentacionCajaComboTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPresentacionCajaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvProductoPresentacionCajasTO(invVendedor: InvProductoPresentacionCajasTO, contexto): InvProductoPresentacionCajasTO {
    let ppCajaCopia = new InvProductoPresentacionCajasTO(invVendedor);
    ppCajaCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    ppCajaCopia.prescEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (contexto.accion === LS.ACCION_CREAR) {
      ppCajaCopia.usrCodigo = this.auth.getCodigoUser();
      ppCajaCopia.usrFechaInserta = null;
    }
    return ppCajaCopia;
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'prescCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'prescDetalle',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_ABREVIADO,
        field: 'prescAbreviado',
        width: 100,
        minWidth: 100
      },
      this.utilService.getColumnaOpciones()
    ];
    return columnDefs;
  }
}
