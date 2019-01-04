import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class TipoContableService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarTipoContable(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getConTipo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarTipoContable(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarTipoContable([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  getListaConTipoReferencia(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListaConTipoReferencia", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGetListaConTipoReferencia(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarTipoSegunCodigo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListaConTipoCodigo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarTipoSegunCodigo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarTipoSegunCodigo([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  //devuelve un listado List<ConTipo>
  listarConTipo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListaConTipo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarConTipo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarTipoContable(parametro, contexto, tipoCopia, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/insertarConTipo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarTipoContable(respuesta.operacionMensaje, tipoCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarTipoContable(parametro, contexto, tipoCopia, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/modificarConTipo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarTipoContable(respuesta.operacionMensaje, tipoCopia);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'tipCodigo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'tipDetalle',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'tipTipoPrincipal',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_MODULO,
        field: 'tipModulo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'tipInactivo',
        width: 100,
        minWidth: 100,
        cellRenderer: "inputEstado",
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'cuentaCodigo',
        width: 100,
        minWidth: 100,
        cellRenderer: "botonOpciones",
        cellClass: 'text-center',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      },
    ];
  }
}
