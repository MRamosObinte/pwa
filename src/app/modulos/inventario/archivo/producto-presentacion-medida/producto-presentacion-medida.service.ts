import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { InvProductoPresentacionUnidadesTO } from '../../../../entidadesTO/inventario/InvProductoPresentacionUnidadesTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductoPresentacionMedidaService {


  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) {
  }

  listaPresentacionUnidadTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaPresentacionUnidadComboTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPresentacionUnidadTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvProductoPresentacionUnidadesTO(invProductoPresentacionUnidadesTO: InvProductoPresentacionUnidadesTO, contexto): InvProductoPresentacionUnidadesTO {
    let ppUnidadCopia = new InvProductoPresentacionUnidadesTO(invProductoPresentacionUnidadesTO);
    ppUnidadCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    ppUnidadCopia.presuEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (contexto.accion === LS.ACCION_CREAR) {
      ppUnidadCopia.usrCodigo = this.auth.getCodigoUser();
      ppUnidadCopia.usrFechaInserta = null;
    }
    return ppUnidadCopia;
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'presuCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'presuDetalle',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_ABREVIADO,
        field: 'presuAbreviado',
        width: 100,
        minWidth: 100
      },
      this.utilService.getColumnaOpciones()
    ];
    return columnDefs;
  }
}
