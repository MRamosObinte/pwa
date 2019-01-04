import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MotivoConsumosService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvConsumosMotivoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvConsumosMotivoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvConsumosMotivoTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvConsumosMotivoTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  /**
   * Método que trae la lista de sectores y bodegas para llenar los combos
   *
   * @param {*} parametro
   * @param {*} contexto
   * @param {*} empresaSelect
   * @memberof MotivoConsumosService
   */
  obtenerDatosParaMotivoConsumos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosParaMotivoConsumos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaMotivoConsumos(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  /**
   * Método para llenar el combo de bodega seleccionada
   *
   * @param {*} listadoBodegas
   * @param {*} codigo
   * @returns
   * @memberof MotivoConsumosService
   */
  seleccionarBodega(listadoBodegas, codigo) {
    return listadoBodegas.find(item => item.bodCodigo == codigo);
  }

  /**
   * Método para llenar el combo de sector seleccionado
   *
   * @param {*} listaSectores
   * @param {*} codigo
   * @returns
   * @memberof MotivoConsumosService
   */
  seleccionarSector(listaSectores, codigo) {
    return listaSectores.find(item => item.secCodigo == codigo);
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'cmCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'cmDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_FORMA_CONTABILIZAR,
        field: 'cmFormaContabilizar',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'cmInactivo',
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
