import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { InvClienteCategoriaTO } from '../../../../entidadesTO/inventario/InvClienteCategoriaTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteCategoriaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private auth: AuthService
  ) { }

  /**
   * @param {*} parametro debe ser tipo {empresa: ''}
   * @param {*} contexto es el this
   * @param {*} empresaSelect es la empresa seleccionada en el combo
   * @memberof ClienteCategoriaService
   */
  listarInvClienteCategoriaTO(parametro, contexto, empresaSelect) {

    this.api.post("todocompuWS/inventarioWebController/getInvClienteCategoriaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvClienteCategoriaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvClienteCategoriaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  formatearInvClienteCategoria(invClienteCategoria: InvClienteCategoriaTO, contexto): InvClienteCategoriaTO {
    let invClienteCategoriaCopia = new InvClienteCategoriaTO(invClienteCategoria);
    invClienteCategoriaCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    invClienteCategoriaCopia.ccEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (contexto.accion === LS.ACCION_CREAR) {
      invClienteCategoriaCopia.usrCodigo = this.auth.getCodigoUser();
      invClienteCategoriaCopia.usrFechaInserta = null;
    }
    return invClienteCategoriaCopia;
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'ccCodigo',
        width: 60,
        minWidth: 60
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'ccDetalle',
        width: 250,
        minWidth: 250
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
