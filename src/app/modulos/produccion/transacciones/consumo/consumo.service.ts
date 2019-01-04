import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { InvConsumosDetalle } from '../../../../entidades/inventario/InvConsumosDetalle';
import { SelectCellAtributoComponent } from '../../../componentes/select-cell-atributo/select-cell-atributo.component';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
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
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularConsumos;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruEliminarConsumos;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruMayorizarConsumos;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarConsumos;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularConsumos;
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

  generarColumnasConsumo(contexto) {
    let esEditable = contexto.puedeEditar;
    let columnas: Array<any> = [];
    if (esEditable) {
      columnas.push(
        {
          headerName: LS.TAG_MOVER_FILA,
          headerClass: 'cell-header-center',
          cellClass: 'text-center cell-block',
          width: 40,
          minWidth: 40,
          rowDrag: esEditable, //Para mover las filas
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_MOVER_FILA,
            tooltip: LS.TAG_MOVER_FILA,
            text: '',
            enableSorting: false
          },
          valueGetter: () => {
            return null;
          }
        },
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 120,
          minWidth: 120,
          cellClass: 'cell-editing',
          cellClassRules: { "cell-with-errors": (params) => { return esEditable ? !this.validarProducto(params.data) : false; } },
          suppressKeyboardEvent: (params) => {
            if (params.event.keyCode !== LS.KEYCODE_UP && params.event.keyCode !== LS.KEYCODE_DOWN) {
              contexto.buscarProducto(params);
              if (params.editing) { return true; }
            } else {
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvConsumosDetalle) }
            }
          },
          editable: true,
          valueGetter: (params) => { return params.data.invProducto.invProductoPK.proCodigoPrincipal; },
          cellEditorFramework: InputCellComponent,
          cellEditorParams: {
            name: 'proCodigoPrincipal',
            maxlength: 50,
            inputClass: 'text-uppercase',
            placeholder: ''
          }
        },
        {
          headerName: LS.TAG_NOMBRE,
          field: 'proNombre',
          width: 200,
          minWidth: 200,
          cellClass: 'cell-block',
          valueGetter: (params) => { return params.data.invProducto.proNombre; }
        },
        {
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidad',
          valueFormatter: this.formatearA2Decimales,
          width: 120,
          minWidth: 120,
          suppressKeyboardEvent: (params) => {
            if (params.editing) { (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvConsumosDetalle) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          editable: true,
          cellClass: 'text-right cell-editing',
          cellClassRules: {
            "cell-with-errors": (params) => { return !this.validarCantidad(params.data) },
          },
          cellEditorFramework: NumericCellComponent,
          cellEditorParams: {
            name: 'detCantidad',
            maxlength: 25,
            placeholder: '0.00',
            configAutonumeric: contexto.configAutonumeric
          }
        },
        {
          headerName: LS.TAG_UNIDAD_MEDIDA,
          field: 'medDetalle',
          width: 150,
          minWidth: 150,
          cellClass: 'cell-block',
          valueGetter: (params) => { return params.data.invProducto.invProductoMedida.medDetalle; },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_UNIDAD_MEDIDA,
            text: LS.TAG_UN_MEDIDA,
            enableSorting: true
          }
        },
        {
          headerName: LS.TAG_CC,
          field: 'pisNumero',
          width: 140,
          minWidth: 140,
          suppressKeyboardEvent: (params) => {
            contexto.agregarFilaAlFinal(params);
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvConsumosDetalle) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          cellClass: 'cell-editing text-center',
          cellClassRules: {
            "cell-with-errors": (params) => {
              return esEditable ? !this.validarCC(params.data) : false;
            }
          },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_CENTRO_COSTO,
            text: LS.TAG_CC,
            enableSorting: true
          },
          editable: true,
          cellEditorFramework: SelectCellAtributoComponent,
          cellEditorParams: function (params) {
            return {
              value: contexto.listadoPiscinaTO ? params.data.pisNumero : null,
              name: 'pisNumero',
              atributo: 'pisNumero',
              obligatorio: false,
              listValues: contexto.listadoPiscinaTO ? contexto.listadoPiscinaTO : [],
              fieldsShow: ['pisNumero', 'pisNombre']
            };
          },
          valueFormatter: function (params) {
            let bodega = contexto.bodegaSeleccionado; //
            let piscinas: Array<PrdListaPiscinaTO> = contexto.listadoPiscinaPorEmpresaTO;
            if (piscinas && piscinas.length > 0) {
              let piscina: PrdListaPiscinaTO;
              piscina = piscinas.find(item => bodega && (item.pisNumero == params.data.pisNumero) && (item.pisSector == bodega.codigoCP));
              return piscina ? piscina.pisNumero + " - " + piscina.pisNombre : params.data.pisNumero;
            }
          }
        },
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: 'text-center cell-block',
          width: LS.WIDTH_OPCIONES,
          minWidth: LS.WIDTH_OPCIONES,
          cellRendererFramework: BotonOpcionesComponent,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: '',
            enableSorting: false
          }
        }
      );
    } else {
      columnas.push(
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 120,
          minWidth: 120,
          valueGetter: (params) => { return params.data.invProducto.invProductoPK.proCodigoPrincipal; }
        },
        {
          headerName: LS.TAG_NOMBRE,
          field: 'proNombre',
          width: 200,
          minWidth: 200,
          valueGetter: (params) => { return params.data.invProducto.proNombre; }
        },
        {
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidad',
          valueFormatter: this.formatearA2Decimales,
          width: 120,
          minWidth: 120,
          cellClass: 'text-right'
        },
        {
          headerName: LS.TAG_UNIDAD_MEDIDA,
          field: 'medDetalle',
          width: 150,
          minWidth: 150,
          valueGetter: (params) => { return params.data.invProducto.invProductoMedida.medDetalle; },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_UNIDAD_MEDIDA,
            text: LS.TAG_UN_MEDIDA,
            enableSorting: true
          }
        },
        {
          headerName: LS.TAG_CC,
          field: 'pisNumero',
          width: 140,
          minWidth: 140,
          cellClass: 'text-center',
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_CENTRO_COSTO,
            text: LS.TAG_CC,
            enableSorting: true
          },
          valueFormatter: function (params) {
            if (contexto.listadoPiscinaPorEmpresaTO && contexto.listadoPiscinaPorEmpresaTO.length > 0) {
              let piscina: PrdListaPiscinaTO;
              piscina = contexto.listadoPiscinaPorEmpresaTO.find(item => item.pisNumero == params.data.pisNumero);
              return piscina ? piscina.pisNumero + " - " + piscina.pisNombre : params.data.pisNumero;
            }
            return params.data.pisNumero;
          }
        }
      );
    }
    return columnas;
  }

  validarCantidad(data): boolean {
    let cantidadSolicitada = data.detCantidad;
    let minimo = 0.01;
    return cantidadSolicitada && cantidadSolicitada >= minimo;
  }

  validarProducto(data): boolean {
    return data.invProducto && data.invProducto.invProductoPK.proCodigoPrincipal ? true : false;
  }

  validarCC(data: InvConsumosDetalle): boolean {
    return data.pisNumero ? true : false;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  crearInvConsumoDetalle(): InvConsumosDetalle {
    let invPedidosDetalle = new InvConsumosDetalle({ detOrden: 0, detCantidad: 1.00 });
    return invPedidosDetalle;
  }

  // metodo de obtener piscinas
  getListaPiscinaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPiscinaTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGetListaPiscinaTO(data.extraInfo);
        } else {
          contexto.listadoPiscinaTO = null;
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
        }
        contexto.cargando = false;
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de listar consumos
  listarConsumos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvConsultaConsumos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarConsumos(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de listar consumos
  obtenerInvConsumo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvConsumos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerConsumo(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de inserta consumos
  insertarModificarInvConsumos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarModificarInvConsumos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeInsertarModificarInvConsumos(data);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CONSUMO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de obtiene datos para crud consumos
  obtenerDatosParaCrudConsumos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosParaCrudConsumos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudConsumos(data.extraInfo);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CONSUMO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  anularConsumo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/anularConsumo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeAnularConsumo(data);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CONSUMO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  restaurarConsumo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/restaurarConsumo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeRestaurarConsumo(data);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CONSUMO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarConsumo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/desmayorizarConsumo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeDesmayorizarConsumo(data);
        } else {
          this.utilService.generarSwal(LS.ACCION_DESMAYORIZAR + " " + LS.TAG_CONSUMO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarConsumosPorLote(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/desmayorizarConsumosPorLote", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeDesmayorizarConsumosPorLote(data);
        } else {
          this.utilService.generarSwal(LS.ACCION_DESMAYORIZAR + " " + LS.TAG_CONSUMO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

}
