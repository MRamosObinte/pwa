import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { InvProductoTipoTO } from '../../../../entidadesTO/inventario/InvProductoTipoTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductoTipoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) { }

  listarInvProductoTipoTO(parametro, contexto, empresaSelect) {

    this.api.post("todocompuWS/inventarioWebController/getInvProductoTipoComboListadoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProductoTipoTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvProductoTipoTO(invProductoTipoTO: InvProductoTipoTO, contexto): InvProductoTipoTO {
    let invProductoTipoTOCopia = new InvProductoTipoTO(invProductoTipoTO);
    invProductoTipoTOCopia.tipActivo = true;
    invProductoTipoTOCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    invProductoTipoTOCopia.tipEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (contexto.accion === LS.ACCION_CREAR) {
      invProductoTipoTOCopia.usrCodigo = this.auth.getCodigoUser();
      invProductoTipoTOCopia.usrFechaInserta = null;
    }
    return invProductoTipoTOCopia;
  }

  generarColumnas(esModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'tipCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'tipDetalle',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'tipTipo',
        width: 100,
        minWidth: 100
      },
      !esModal ? this.utilService.getColumnaOpciones(): null
    ];

    return columnDefs;
  }

}
