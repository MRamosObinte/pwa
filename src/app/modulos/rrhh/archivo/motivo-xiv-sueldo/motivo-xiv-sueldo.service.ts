import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class MotivoXivSueldoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhXivSueldoMotivo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhXivSueldoMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhXivSueldoMotivo(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhXivSueldoMotivo([]);
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
        field: 'rhXivSueldoMotivoPK.motDetalle',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        field: 'conTipo.tipDetalle',
        width: 150,
        minWidth: 150
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
  insertarRhXivSueldoMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhXivSueldoMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarRhXivSueldoMotivo(respuesta)
          contexto.cargando = false;
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarRhXivSueldoMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhXivSueldoMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarRhXivSueldoMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarEstadoRhXivSueldoMotivo(parametro, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/modificarEstadoRhXivSueldoMotivo", parametro, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarEstadoRhXivSueldoMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  eliminarRhXivSueldoMotivo(parametros, contexto, empresaSeleccionada) {
    this.api.post("todocompuWS/rrhhWebController/eliminarRhXivSueldoMotivo", parametros, empresaSeleccionada)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesEliminarRhXivSueldoMotivo(respuesta)
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }
}
