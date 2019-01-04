import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Injectable({
  providedIn: 'root'
})
export class MotivoXiiiSueldoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear && contexto.empresaSeleccionada.listaSisPermisoTO.gruCrearClientes;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.empresaSeleccionada.listaSisPermisoTO.gruModificarClientes;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  /**
 * Retorna el listado de sectores
 * @param parametro debe ser tipo {empresa: '', activo:''}
 */
  listarMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhXiiiSueldoMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarMotivoXiiiSueldo(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarMotivoXiiiSueldo([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhXiiiSueldoMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeInsertarMotivoXiiiSueldo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhXiiiSueldoMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeModificarMotivoXiiiSueldo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarEstadoMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarEstadoRhXiiiSueldoMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeModificarEstadoMotivoXiiiSueldo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/eliminarRhXiiiSueldoMotivo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeEliminarMotivoXiiiSueldo(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/imprimirReporteMotivoXiiiSueldo", parametro, empresaSelect)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('ListadoMotivoXiiiSueldo_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarMotivoXiiiSueldo(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteMotivoXiiiSueldo", parametro, empresaSelect)
      .then(data => {
        if (data) {
          this.utilService.descargarArchivoExcel(data._body, "ListadoMotivoXiiiSueldo_");
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_DETALLE,
        field: 'rhXiiiSueldoMotivoPK.motDetalle',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        field: 'conTipo.conTipoPK.tipCodigo',
        width: 110,
        minWidth: 110
      },
    ];
    if (isModal) {
      columnDefs.push(this.utilService.getSpanSelect())
    }
    if (!isModal) {
      columnDefs.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'motInactivo',
          width: 110,
          minWidth: 110,
          cellRenderer: "inputEstado",
          cellClass: 'text-md-center'
        },
        this.utilService.getColumnaOpciones()
      )
    }

    return columnDefs;
  }
}
