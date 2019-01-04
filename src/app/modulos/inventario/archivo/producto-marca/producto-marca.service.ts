import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { InvProductoMarcaTO } from '../../../../entidadesTO/inventario/InvProductoMarcaTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductoMarcaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) { }

  listarInvMarcaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvMarcaComboListadoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvMarcaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvProductoMarcaTO(invProductoMarcaTO: InvProductoMarcaTO, contexto): InvProductoMarcaTO {
    let invProductoMarcaTOCopia = new InvProductoMarcaTO(invProductoMarcaTO);
    invProductoMarcaTOCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    invProductoMarcaTOCopia.marEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (contexto.accion === LS.ACCION_CREAR) {
      invProductoMarcaTOCopia.usrFechaInserta = null;
      invProductoMarcaTOCopia.usrCodigo = this.auth.getCodigoUser();
    }
    return invProductoMarcaTOCopia;
  }
  
  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'marCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'marDetalle',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_ABREVIADO,
        field: 'marAbreviado',
        width: 100,
        minWidth: 100
      },
      this.utilService.getColumnaOpciones()
    ];
    return columnDefs;
  }
}
