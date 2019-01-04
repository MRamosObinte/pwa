import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProveedorCategoriaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  /**
   * @param {*} parametro debe ser tipo {empresa: ''}
   * @param {*} contexto es el this
   * @param {*} empresaSelect es la empresa seleccionada en el combo
   * @memberof ClienteCategoriaService
   */
  listarInvProveedorCategoria(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/inventarioWebController/getInvProveedorCategoriaTO", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProveedorCategoriaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvProveedorCategoriaTO([]);
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
        field: 'pcCodigo',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'pcDetalle',
        width: 300,
        minWidth: 300
      },
      {
        headerName: LS.TAG_APLICA_RETENCION_IVA,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'pcAplicaRetencionIva',
        width: 120,
        minWidth: 120,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }
}
