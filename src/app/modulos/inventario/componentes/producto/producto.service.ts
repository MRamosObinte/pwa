import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { InvFunListadoProductosTO } from '../../../../entidadesTO/inventario/InvFunListadoProductosTO';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public resultado: any = [];

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) {
  }

  obtenerDatosParaCrudProductos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosParaCrudProductos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudProductos(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.isModal ? contexto.activeModal.close() : null;
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto))
  }

  getListaProductosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaProductosGeneralTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarProducto(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.isModal ? contexto.activeModal.dismiss() : contexto.despuesDeListarProducto([]);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto))
  }

  getListaInvFunListadoProductosTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunListadoProductosTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarInvFunListadoProductosTO(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.despuesDeListarInvFunListadoProductosTO([]);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto))
  }

  listarProductos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvProductoTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerProducto(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
          contexto.isModal ? contexto.activeModal.close() : null;
        }
      }).catch(err => this.utilService.handleError(err, contexto))
  }

  obtenerProducto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerProductoTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerProducto(data.extraInfo);
        } else {
          contexto.despuesDeObtenerProducto(null);
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto))
  }

  insertarProducto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarProductoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeInsertarProducto(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarProducto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarProductoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeModificarProducto(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarProducto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/eliminarInvProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeEliminarProducto(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoProducto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/cambiarEstadoInvProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeCambiarEstadoProducto(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  consultarImagenes(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerAdjuntosProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeConsultarImagenes(respuesta.extraInfo);
        } else {
          contexto.despuesDeConsultarImagenes([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear && contexto.empresaSeleccionada.listaSisPermisoTO.gruCrearProductos;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.empresaSeleccionada.listaSisPermisoTO.gruModificarProductos;
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

  convertirInvFunListadoProductosTOAInvListaProductosGeneralTO(objetoInvFunListadoProductosTO: InvFunListadoProductosTO): InvListaProductosGeneralTO {
    let objetoNuevo = new InvListaProductosGeneralTO();
    objetoNuevo.proCodigoPrincipal = objetoInvFunListadoProductosTO.prdCodigoPrincipal;
    objetoNuevo.proNombre = objetoInvFunListadoProductosTO.prdNombre;
    objetoNuevo.proCategoria = objetoInvFunListadoProductosTO.prdCategoria;
    objetoNuevo.proInactivo = objetoInvFunListadoProductosTO.prdInactivo;

    return objetoNuevo;
  }

  generarColumnasGenerales(contexto) {
    if (!contexto.isModal) {
      return [
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 100
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 600
        },
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'proInactivo',
          width: 100,
          cellRenderer: "inputEstado",
          cellClass: 'text-md-center'
        },
        this.utilService.getColumnaOpciones()
      ]
    } else {
      let col: any = [
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 50,
          minWidth: 50,
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 100,
          minWidth: 100,
        }
      ]
      if (contexto.isModal) {
        col.push(
          {
            headerName: LS.TAG_SALDO,
            field: 'stockSaldo',
            cellClass: 'text-right',
            valueFormatter: numberFormatter,
            width: 50,
            minWidth: 50
          }
        )
      }
      col.push(
        this.utilService.getSpanSelect()
      )
      return col;
    }
  }

  generarColumnasProductoListado() {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'prdCodigoPrincipal',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'prdNombre',
        width: 200,
        minWidth: 200,
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'prdMedida',
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'prdCategoria',
        width: 200,
        minWidth: 200,
      },
      {
        headerName: LS.TAG_PRECIO_1,
        field: 'prdPrecio1',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_2,
        field: 'prdPrecio2',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_3,
        field: 'prdPrecio3',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_4,
        field: 'prdPrecio4',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      {
        headerName: LS.TAG_PRECIO_5,
        field: 'prdPrecio5',
        width: 100,
        minWidth: 100,
        valueFormatter: numberFormatter,
        cellClass: 'text-right'
      },
      this.utilService.getColumnaOpciones()
    ]
  }
}

function numberFormatter(params) {
  if (!params.value) {
    params.value = 0;
  }
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}