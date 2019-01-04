import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { InvVendedorTO } from '../../../../entidadesTO/inventario/InvVendedorTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InvVendedorComboListadoTO } from '../../../../entidadesTO/inventario/InvVendedorComboListadoTO';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {


  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) {
  }

  listarComboinvListaVendedorTOs(contexto, parametro, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getComboinvListaVendedorTOs", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarVendedorTOs(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarVendedorTOs([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvVendedor(invVendedor: InvVendedorTO, contexto): InvVendedorTO {
    let invVendedorCopia = new InvVendedorTO(invVendedor);
    invVendedorCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    invVendedorCopia.vendEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (contexto.accion === LS.ACCION_CREAR) {
      invVendedorCopia.usrCodigo = this.auth.getCodigoUser();
      invVendedorCopia.usrFechaInserta = null;
    }    
    return invVendedorCopia;
  }

  convertirInvVendedorTODeInvVendedorComboListadoTO(invVendedorComboListadoTO: InvVendedorComboListadoTO): InvVendedorTO {
    let invVendedorTO = new InvVendedorTO(invVendedorComboListadoTO);
    invVendedorTO.usrEmpresa = invVendedorComboListadoTO.vendEmpresa;
    invVendedorTO.usrCodigo = this.auth.getCodigoUser();
    invVendedorTO.usrFechaInserta = null;
    return invVendedorTO;
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'vendCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'vendNombre',
        width: 200,
        minWidth: 200
      },
      this.utilService.getColumnaOpciones()
    ];
    return columnDefs;
  }
}
