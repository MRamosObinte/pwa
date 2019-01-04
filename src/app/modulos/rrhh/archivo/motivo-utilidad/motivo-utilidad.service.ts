import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MotivoUtilidadService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhUtilidadMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhUtilidadMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhUtilidadMotivo(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhUtilidadMotivo([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_DETALLE,
        field: 'rhUtilidadMotivoPK.motDetalle',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        field: 'conTipo.tipDetalle',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'motInactivo',
        width: 50,
        minWidth: 50,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }

  //Operaciones
  insertarRhUtilidadMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhUtilidadMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarRhUtilidadMotivo(respuesta)
          contexto.cargando = false;
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarRhUtilidadMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhUtilidadMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarRhUtilidadMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarEstadoRhUtilidadMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/modificarEstadoRhUtilidadMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarEstadoRhUtilidadMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  eliminarRhUtilidadMotivo(parametros, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/eliminarRhUtilidadMotivo", parametros, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesEliminarRhUtilidadMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

}
