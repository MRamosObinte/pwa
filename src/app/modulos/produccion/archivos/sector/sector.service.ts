import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

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
  listarPrdListaSectorTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaSectorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSectores(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarSectores([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarSector(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdSectorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeInsertarPiscina(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarSector(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdSectorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeModificarPiscina(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarSector(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/eliminarPrdSectorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeEliminarSector(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoSector(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarEstadoPrdSector", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeCambiarEstadoSector(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirSectores(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteSector", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoPDF('ListaSectores' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
          : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarSectores(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReporteSector", parametro, empresaSelect)
    .then(data => {
      (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaSectores_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
      contexto.cargando = false;
    }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'secCodigo',
        width: 110,
        minWidth: 110
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'secNombre',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_LATITUD,
        field: 'secLatitud',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_LONGITUD,
        field: 'secLongitud',
        width: 150,
        minWidth: 150
      }
    ];
    if (isModal) {
      columnDefs.push(this.utilService.getSpanSelect())
    }
    if (!isModal) {
      columnDefs.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          width: 110,
          minWidth: 110,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center',
          valueGetter: (params) => {
            return !params.data.secActivo;
          }
        },
        this.utilService.getColumnaOpciones()
      )
    }

    return columnDefs;
  }
}
