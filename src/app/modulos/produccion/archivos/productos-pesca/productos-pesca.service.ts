import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductosPescaService {

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
  listarProductoPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdLiquidacionProductos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarProductoPesca(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarProductoPesca([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarProductoPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdLiquidacionProductoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeInsertarProductoPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarProductoPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdLiquidacionProductoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeModificarProductoPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarProductoPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/eliminarPrdLiquidacionProductoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeEliminarProductoPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoProductoPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarEstadoPrdLiquidacionProductoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeCambiarEstadoProductoPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  imprimirProductoPesca(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePrdLiquidacionProductoTO", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoPDF('ListaLiquidacionProducto' + this.utilService.obtenerHorayFechaActual() + '.pdf', data)
          : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  exportarProductoPesca(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePrdLiquidacionProductoTO", parametro, empresaSelect)
    .then(data => {
      (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaLiquidacionProducto_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
      contexto.cargando = false;
    }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'prdLiquidacionProductoPK.prodCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'prodDetalle',
        width: 270,
        minWidth: 270
      },
      {
        headerName: LS.TAG_TIPO,
        field: 'prodTipo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_CLASE,
        field: 'prodClase',
        width: 80,
        minWidth: 80
      }
    ];
    if (isModal) {
      columnDefs.push(this.utilService.getSpanSelect())
    } else {
      columnDefs.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'prodInactivo',
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
