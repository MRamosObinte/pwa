import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TallaPescaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar;
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
  listarTallaPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdLiquidacionTalla", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarTallaPesca(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarTallaPesca([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarTallaPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdLiquidacionTalla", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeInsertarTallaPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarTallaPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdLiquidacionTalla", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeModificarTallaPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarTallaPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/eliminarPrdLiquidacionTalla", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeEliminarTallaPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoTallaPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarEstadoPrdLiquidacionTalla", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeCambiarEstadoTallaPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirTallaPesca(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePrdLiquidacionTallaTO", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoPDF('ListaLiquidacionTalla' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
          : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarTallaPesca(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePrdLiquidacionTallaTO", parametro, empresaSelect)
    .then(data => {
      (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaLiquidacionTalla_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
      contexto.cargando = false;
    }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'prdLiquidacionTallaPK.tallaCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'tallaDetalle',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_PRECIO_PROMEDIO,
        field: 'tallaPrecio',
        width: 100,
        minWidth: 100,
        valueFormatter: (params) => { return new DecimalPipe('en-US').transform(params.value, '1.2-2')},
        cellClass: ' text-right'
      },
      {
        headerName: LS.TAG_GRAMOS_DESDE,
        field: 'tallaGramosDesde',
        width: 100,
        minWidth: 100,
        valueFormatter: (params) => { return new DecimalPipe('en-US').transform(params.value, '1.6-6')},
        cellClass: ' text-right'
      },
      {
        headerName: LS.TAG_GRAMOS_HASTA,
        field: 'tallaGramosHasta',
        width: 100,
        minWidth: 100,
        valueFormatter: (params) => { return new DecimalPipe('en-US').transform(params.value, '1.6-6')},
        cellClass: ' text-right'
      },
      {
        headerName: LS.TAG_UNIDAD_MEDIDA,
        field: 'tallaUnidadMedida',
        width: 110,
        minWidth: 110,
      },
    ];
    if (isModal) {
      columnDefs.push(this.utilService.getSpanSelect())
    } else {
      columnDefs.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'tallaInactivo',
          width: 60,
          minWidth: 60,
          cellRenderer: "inputEstado",
          cellClass: 'text-md-center'
        },
        this.utilService.getColumnaOpciones()
      )
    }

    return columnDefs;
  }
}
