import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  /**
   * Retorna el listado de motivos de pedido
   * @param parametro debe ser tipo {empresa: '', busqueda:'', activoProveedor: true} By default true
   */
  listarProveedores(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaProveedoresTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarProveedores(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarProveedores([]);
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  listarInvProveedorTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListInvProveedorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProveedorTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvProveedorTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarInvFunListadoProveedorTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunListadoProveedoresTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunListadoProveedorTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunListadoProveedorTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  insertarProveedor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarProveedorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, 'Correcto', { enableHtml: true });
          contexto.despuesDeInsertarProveedor(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarProveedor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarProveedorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.info(respuesta.operacionMensaje, 'Correcto', { enableHtml: true });
          contexto.despuesDeModificarProveedor(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  eliminarProveedor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/eliminarInvProveedorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, 'Correcto');
          contexto.despuesDeEliminarProveedor();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoProveedor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvProveedor", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, 'Correcto');
          contexto.despuesDecambiarEstadoProveedor();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerSiEsProveedorRepetido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getProveedorRepetido", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta) {
          contexto.despuesDeObtenerSiEsProveedorRepetido(respuesta.extraInfo);
        } else {
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  validarCedula(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/appWebController/validarCedula", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarCedula(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  buscaCedulaProveedorTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getBuscaCedulaProveedorTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeBuscaCedulaProveedorTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeBuscaCedulaProveedorTO(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  buscarConteoProveedor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/buscarConteoProveedor", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeBuscarConteoProveedor(respuesta.extraInfo);
        } else {
          contexto.despuesDeBuscarConteoProveedor(null);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear && contexto.empresaSeleccionada.listaSisPermisoTO.gruCrearProveedores;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruModificar && contexto.empresaSeleccionada.listaSisPermisoTO.gruModificarProveedores;
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

  generarColumnas() {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_NUMERO,
        field: 'provId',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_RAZON_SOCIAL,
        field: 'provRazonSocial',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_NOMBRE_COMERCIAL,
        field: 'provNombreComercial',
        width: 400,
        minWidth: 400
      },
      /*{
        headerName: LS.TAG_RELACIONADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'provRelacionado',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },*/
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'provInactivo',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }

  generarColumnasGenerales() {
    return [
      {
        headerName: LS.TAG_NUMERO,
        field: 'provId',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_RAZON_SOCIAL,
        field: 'provRazonSocial',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_NOMBRE_COMERCIAL,
        field: 'provNombreComercial',
        width: 400,
        minWidth: 400
      },
      {
        headerName: LS.TAG_RELACIONADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'provRelacionado',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'provInactivo',
        width: 115,
        minWidth: 115,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    ];
  }

  generarColumnasTodo() {
    return [
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        field: 'provCodigo',
        check: true
      },
      {
        headerName: LS.TAG_TIPO_ID,
        field: 'provTipoId',
        check: true
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'provNombreComercial',
        check: true
      },
      {
        headerName: LS.TAG_RAZON_SOCIAL,
        field: 'provRazonSocial',
        check: true
      },
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'provCategoria',
        check: true
      },
      {
        headerName: LS.TAG_PROVINCIA,
        field: 'provProvincia',
        check: true
      },
      {
        headerName: LS.TAG_CIUDAD,
        field: 'provCiudad',
        check: true
      },
      {
        headerName: LS.TAG_ZONA,
        field: 'provZona',
        check: true
      },
      {
        headerName: LS.TAG_DIRECCION,
        field: 'provDireccion',
        check: true
      },
      {
        headerName: LS.TAG_TELEFONO,
        field: 'provTelefono',
        check: true
      },
      {
        headerName: LS.TAG_TELEFONO_CELULAR,
        field: 'provCelular',
        check: true
      },
      {
        headerName: LS.TAG_EMAIL,
        field: 'provEmail',
        check: true
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'provObservaciones',
        check: true
      },
      {
        headerName: LS.TAG_INACTIVO,
        field: 'provInactivo',
        check: true
      }
    ];
  }
}
