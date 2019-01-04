import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private atajoService: HotkeysService
  ) { }

  /**
   * Verifica los permisos
   * @param {*} accion
   * @param {*} contexto
   * @param {*} [mostrarMensaje]
   * @returns {boolean}
   */
  verificarPermiso(accion, empresaSeleccionada: PermisosEmpresaMenuTO, mostrarMensaje?): boolean {
    let permiso: boolean = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR:
      case LS.ACCION_RESTAURAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruEliminar;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.mostrarSwalNoPermiso();
    }
    return permiso;
  }

  definirAtajosDeTeclado(contexto): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element = document.getElementById('btnActivar');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element = document.getElementById('btnGuardar');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element = document.getElementById('btnCancelar');
      element ? element.click() : null;
      return false;
    }))
  }

  autonumeric30() {
    return {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '999',
      minimumValue: '0',
    }
  }

  autonumeric92() {
    return {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999.99',
      minimumValue: '0',
    }
  }

  mostrarSwalNoPermiso() {
    let parametros = {
      title: LS.TOAST_INFORMACION,
      texto: LS.ERROR_403_TEXTO,
      type: LS.SWAL_INFO,
      confirmButtonText: "<i class='" + LS.ICON_AGREGAR + "'></i>  " + LS.LABEL_MAS_INFORMACION,
      cancelButtonText: LS.MSJ_ACEPTAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {
        window.open(LS.ENLACE_MANUAL_USUARIO, '_blank');
      }
    });
  }

  // el extraInfo retorna List<RhEmpleadoTO>
  listarEmpleados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaEmpleado", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarEmpleados(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarEmpleados([]);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna List<RhFunListadoEmpleadosTO>
  listarFunEmpleados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhFunListadoEmpleadosTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarFunEmpleados(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeListarEmpleados([]);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna listas para llenar combos
  obtenerDatosParaBusquedaEmpleados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaBusquedaEmpleados", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaBusquedaEmpleados(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna listas para llenar combos
  obtenerDatosParaCrudEmpleados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaCrudEmpleados", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudEmpleados(data.extraInfo);
        } else {
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna List<RhListaEmpleadoLoteTO>
  getListaEmpleadoLote(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaEmpleadoLote", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGetListaEmpleadoLote(data.extraInfo);
        } else {
          contexto.despuesDeGetListaEmpleadoLote(data.extraInfo);
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  accionEmpleados(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/accionRhEmpleado", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeAccionEmpleados(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  insertarModificarRhEmpleado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarModificarRhEmpleado", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeInsertarModificarRhEmpleado(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  cambiarEstadoRhEmpleado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/cambiarEstadoRhEmpleado", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeCambiarEstadoRhEmpleado(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  eliminarRhEmpleado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/eliminarRhEmpleado", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeEliminarRhEmpleado(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un RhParametros
  getRhParametros(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhParametros", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGetRhParametros(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un List<RhEmpleadoDescuentosFijos>
  getEmpleadoDescuentosFijos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getEmpleadoDescuentosFijos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGetEmpleadoDescuentosFijos(data.extraInfo);
        } else {
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un List<RhEmpleadoDescuentosFijos> y la foto en base 64
  obtenerComplementosEmpleado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerComplementosEmpleado", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerComplementosEmpleado(data.extraInfo);
        } else {
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(isModal): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.rhEmpleadoPK ? params.data.rhEmpleadoPK.empId : "";
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 500,
        minWidth: 500,
        valueGetter: (params) => {
          return params.data.empApellidos + " " + params.data.empNombres;
        }
      },
      {
        headerName: LS.TAG_CARGO,
        width: 200,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.empCargo;
        }
      },
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.rhCategoria && params.data.rhCategoria.rhCategoriaPK ? params.data.rhCategoria.rhCategoriaPK.catNombre : "";
        }
      }
    );
    if (!isModal) {
      columnas.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'empInactivo',
          width: 115,
          minWidth: 115,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center'
        },
        this.utilService.getColumnaOpciones()
      );
    } else {
      columnas.push(
        this.utilService.getSpanSelect()
      )
    }
    return columnas;
  }

  generarColumnasConsulta(isModal): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.empId;
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 500,
        minWidth: 500,
        valueGetter: (params) => {
          return params.data.empApellidos + " " + params.data.empNombres;
        }
      },
      {
        headerName: LS.TAG_CARGO,
        width: 200,
        minWidth: 200,
        valueGetter: (params) => {
          return params.data.empCargo;
        }
      },
      {
        headerName: LS.TAG_CATEGORIA,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          return params.data.catNombre;
        }
      }
    );
    if (!isModal) {
      columnas.push(
        {
          headerName: LS.TAG_INACTIVO,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'empInactivo',
          width: 115,
          minWidth: 115,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center'
        },
      );
    } else {
      columnas.push(
        this.utilService.getSpanSelect()
      )
    }
    return columnas;
  }

}
