import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private auth: AuthService,
    private utilService: UtilService
  ) {
  }
  /**
   *
   *
   * @param {*} parametro = {empresa:}
   * @param {*} contexto
   * @param {*} empresaSelect
   * @memberof ClienteService
   * Devuelve InvFunListadoClientesTO
   */
  listarInvFunListadoClientesTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunListadoClientesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunListadoClientesTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunListadoClientesTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  validarCedula(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/appWebController/validarCedula", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarCedula(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerClienteTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerClienteTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerClienteTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  insertarCliente(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarClienteTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeInsertarCliente(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  modificarCliente(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarClienteTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO, { enableHtml: true });
          contexto.despuesDeModificarCliente(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarGrupoEmpresarial(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/listarInvClienteGrupoEmpresarial", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvClienteGrupoEmpresarial(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  eliminarCliente(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/eliminarInvCliente", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDeEliminarCliente(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarEstadoCliente(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvCliente", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
          contexto.despuesDecambiarEstadoCliente(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerPermisosDeCaja(parametro, contexto, empresaSelect) {
    parametro.usuarioCodigo = this.auth.getCodigoUser();
    this.api.post("todocompuWS/cajaWebController/getCajCajaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerPermisosDeCaja(respuesta.extraInfo);
        } else {
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerSiEsClienteRepetido(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getClienteRepetido", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerSiEsClienteRepetido(respuesta.extraInfo);
        } else {
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarLugarEntregaCliente(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarClienteLugarEntrega", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeActualizarLugarEntregaCliente(respuesta.extraInfo);
        } else {
          contexto.despuesDeActualizarLugarEntregaCliente(null);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  /**
   * Verifica los permisos
   * @param {*} accion
   * @param {*} contexto
   * @param {*} [mostrarMensaje]
   * @returns {boolean}
   */
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

  generarColumnasTodo() {
    return [
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        field: 'cliId',
        check: true
      },
      {
        headerName: LS.TAG_TIPO_ID,
        field: 'cliTipoId',
        check: true
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'cliNombre',
        check: true
      },
      {
        headerName: LS.TAG_RAZON_SOCIAL,
        field: 'cliRazonSocial',
        check: true
      },
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'cliCategoria',
        check: true
      },
      {
        headerName: LS.TAG_PROVINCIA,
        field: 'cliProvincia',
        check: true
      },
      {
        headerName: LS.TAG_CIUDAD,
        field: 'cliCiudad',
        check: true
      },
      {
        headerName: LS.TAG_ZONA,
        field: 'cliZona',
        check: true
      },
      {
        headerName: LS.TAG_DIRECCION,
        field: 'cliDireccion',
        check: true
      },
      {
        headerName: LS.TAG_TELEFONO,
        field: 'cliTelefono',
        check: true
      },
      {
        headerName: LS.TAG_TELEFONO_CELULAR,
        field: 'cliCelular',
        check: true
      },
      {
        headerName: LS.TAG_EMAIL,
        field: 'cliEmail',
        check: true
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'cliObservaciones',
        check: true
      },
      {
        headerName: LS.TAG_INACTIVO,
        field: 'cliInactivo',
        check: true
      }
    ];
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'cliId',
        width: 110,
        minWidth: 110
      },
      {
        headerName: LS.TAG_RAZON_SOCIAL,
        field: 'cliRazonSocial',
        width: 500
      },
      {
        headerName: LS.TAG_TELEFONO,
        field: 'cliTelefono',
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
          field: 'cliInactivo',
          width: 115,
          minWidth: 115,
          cellRenderer: "inputEstado",
          cellClass: 'text-md-center'
        },
        this.utilService.getColumnaOpciones()
      )
    }

    return columnDefs;
  }

  generarColumnasContacto(accionContacto: string) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CONTACTO,
        field: 'contacto',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_CARGO_O_FUNCION,
        field: 'cargo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_TELEFONO,
        field: 'telefono',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_PREDETERMINADO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'predeterminado',
        width: 125,
        minWidth: 125,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
    ];
    if (accionContacto == LS.ACCION_CONSULTAR) {
      columnDefs.push(this.utilService.getColumnaBotonAccion());
    } else {
      columnDefs.push(this.utilService.getColumnaOpciones());
    }
    return columnDefs;
  }

}
