import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { DecimalPipe } from '@angular/common';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { ClaveValor } from '../../../../enums/ClaveValor';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvConsultaVenta", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarVenta(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarVenta(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvVentasTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeInsertarVenta(data);
        } else {
          this.utilService.generarSwal(LS.VENTA, LS.SWAL_ERROR, data.operacionMensaje + data.extraInfo);
          contexto.cargando = false;
          contexto.activeModal.close();
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarVenta(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarInvVentasTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeModificarVenta(data);
        } else {
          this.utilService.generarSwal(LS.VENTA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
          contexto.activeModal.close(contexto.venta);
          //contexto.activeModal ? contexto.activeModal.close() : null;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  contabilizar(parametro, contexto) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvContableVentasTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeContabilizarVenta(data.operacionMensaje);
        } else {
          this.utilService.generarSwal(LS.ACCION_CONTABILIZAR + " " + LS.VENTA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  obtenerDatosParaVentas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosParaVentas", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaVentas(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  asignarNumeroDocumento(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/asignarNumeroDocumento", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeAsignarNumeroDocumento(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  validarNumero(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarNumero", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeValidarNumero(data.extraInfo);
        } else {
          contexto.despuesDeValidarNumero(false);
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerIva(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getValorAnxPorcentajeIvaTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerIva(data.extraInfo);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  validarNumeroAutorizacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getNumeroAutorizacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarNumeroAutorizacion(respuesta.extraInfo);
        } else {
          contexto.despuesDeValidarNumeroAutorizacion(null);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  consultarVenta(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/consultarVenta", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeConsultarVenta(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarVenta(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/desmayorizarVenta", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeDesmayorizarVenta(data);
        } else {
          this.utilService.generarSwal(LS.ACCION_DESMAYORIZAR + " " + LS.VENTA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

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
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularVentas;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruEliminarVentas;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruMayorizarVentas;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarVentas;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularVentas;
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


  obtenerCampoDesdeReferencia(campoReferencia: string): string {
    let campo: string = null;
    switch (campoReferencia) {
      case "eprecio01": {
        return "proPrecio1"
      }
      case "eprecio02": {
        return "proPrecio2"
      }
      case "eprecio03": {
        return "proPrecio3"
      }
      case "eprecio04": {
        return "proPrecio4"
      }
      case "eprecio05": {
        return "proPrecio5"
      }
      case "eprecio06": {
        return "proPrecio6"
      }
      case "eprecio07": {
        return "proPrecio7"
      }
      case "eprecio08": {
        return "proPrecio8"
      }
      case "eprecio09": {
        return "proPrecio9"
      }
      case "eprecio10": {
        return "proPrecio10"
      }
      case "eprecio11": {
        return "proPrecio11"
      }
      case "eprecio12": {
        return "proPrecio12"
      }
      case "eprecio13": {
        return "proPrecio13"
      }
      case "eprecio14": {
        return "proPrecio14"
      }
      case "eprecio15": {
        return "proPrecio15"
      }
      case "eprecio16": {
        return "proPrecio16"
      }
      case "ecosto01": {
        return "proCostoReferencial1"
      }
      case "ecosto02": {
        return "proCostoReferencial2"
      }
      case "ecosto03": {
        return "proCostoReferencial3"
      }
      case "ecosto04": {
        return "proCostoReferencial4"
      }
      case "ecosto05": {
        return "proCostoReferencial5"
      }
    }
    return campo;
  }

  /**
   * @param {string} tipo de documento
   * @returns {string} titulo del formulario
   * @memberof VentaFacturaService
   */
  obtenerTituloFormulario(tipoDocumento: string): string {
    let campo: string = null;
    switch (tipoDocumento) {
      case "00": {
        return LS.INVENTARIO_VENTA_NOTA_ENTREGA;
      }
      case "04": {
        return LS.INVENTARIO_VENTA_NOTA_CREDITO;
      }
      case "05": {
        return LS.INVENTARIO_VENTA_NOTA_DEBITO;
      }
      case "18": {
        return LS.VENTA;
      }
    }
    return campo;
  }

  generarColumnasDetalle(contexto): Array<any> {
    let esEditable = contexto.puedeEditar;
    let columnas: Array<any> = [];
    /**EDITANDO O CREANDO */
    if (esEditable) {
      columnas.push(
        {
          headerName: LS.TAG_MOVER_FILA,
          field: '',
          headerClass: 'cell-header-center pr-0',
          cellClass: 'text-center cell-block',
          width: 35,
          minWidth: 35,
          rowDrag: true, //Para mover las filas
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_MOVER_FILA,
            tooltip: LS.TAG_MOVER_FILA,
            enableSorting: false
          },
          valueGetter: () => {
            return '';
          }
        },
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 120,
          minWidth: 120,
          cellClass: "cell-editing",
          cellClassRules: {
            "cell-with-errors": (params) => {
              return !params.data.estadoProducto || !this.validarProducto(params.data);
            }
          },
          suppressKeyboardEvent: (params) => {
            switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
              case LS.KEYCODE_ENTER:
              case LS.KEYCODE_TAB:
                contexto.buscarProducto(params);
                if (params.editing) { return true }
                break;
              case LS.KEYCODE_DOWN:
              case LS.KEYCODE_UP:
                if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvVentasDetalleTO) }
                break;
              default:
                return true;
            }
          },
          editable: true,
          valueGetter: (params) => { return params.data.proCodigoPrincipal },
          cellEditorFramework: InputCellComponent,
          cellEditorParams: {
            name: 'proCodigoPrincipal',
            maxlength: 50,
            inputClass: 'text-uppercase',
            placeholder: ''
          }
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 200,
          minWidth: 200,
          cellClass: "cell-block mousetrap",
          valueGetter: (params) => {
            return params.data.proNombre;
          },
          editable: (params) => {
            return params.data.proCodigoPrincipal && contexto.caja.permisoCambiarPrecio && !params.data.catPrecioFijo && params.data.estadoProducto;
          },
          suppressKeyboardEvent: (params) => {
            switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
              case LS.KEYCODE_TAB:
                contexto.cantidadFocusAndEditingCell(params.node.rowIndex);
                break;
              case LS.KEYCODE_DOWN:
              case LS.KEYCODE_UP:
                this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvVentasDetalleTO);
                break;
              default:
                return true;
            }
          },
          cellEditorFramework: InputCellComponent,
          cellEditorParams: {
            name: 'proNombre',
            inputClass: 'text-uppercase mousetrap',
          }
        },
        {
          headerName: LS.TAG_UNIDAD_MEDIDA,
          width: 150,
          minWidth: 150,
          cellClass: "cell-block",
          valueGetter: (params) => {
            return params.data.proMedida;
          },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            tooltip: LS.TAG_UNIDAD_MEDIDA,
            text: LS.TAG_UN_MEDIDA,
            enableSorting: true
          }
        },
        {
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidad',
          width: 120,
          minWidth: 120,
          suppressKeyboardEvent: (params) => {
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvVentasDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          editable: (params) => { return params.data.proCodigoPrincipal },
          cellClass: 'text-right cell-editing p-0',
          cellClassRules: {
            "cell-with-errors": (params) => {
              return params.data.proCodigoPrincipal && !this.validarCantidad(params.data);
            }
          },
          cellRenderer: 'labelNumeric',
          cellRendererParams: (params) => {
            return {
              title: LS.MSJ_ACCION_CANTIDADES,
              clase: LS.ICON_CALCULADORA,
              name: 'cantidad',
              id: "cantidadRender",
              habilitarBtn: params.data.proCodigoPrincipal ? true : false
            }
          },
          cellEditor: 'inputNumeric',
          cellEditorParams: {
            name: 'cantidad',
            idRender: 'cantidadRender',
            id: "detCantidad",
            maxlength: 13,
            placeholder: '0.00',
            configAutonumeric: contexto.configAutonumeric,
            title: LS.MSJ_ACCION_CANTIDADES,
            clase: LS.ICON_CALCULADORA
          }
        },
        {
          headerName: LS.TAG_PRECIO,
          field: 'detPrecio',
          width: 120,
          minWidth: 120,
          suppressKeyboardEvent: (params) => {
            contexto.agregarFilaAlFinal(params);
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvVentasDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          editable: (params) => {
            return params.data.proCodigoPrincipal && (contexto.caja.permisoCambiarPrecio || !params.data.catPrecioFijo || !params.data.estadoPrecio) && params.data.estadoProducto;
          },
          cellClass: 'text-right cell-editing p-0',
          cellClassRules: {
            "cell-with-errors": (params) => {
              return params.data.proCodigoPrincipal && params.data.detCantidad && !this.validarPrecio(params.data);
            }
          },
          cellRenderer: 'labelNumeric',
          cellRendererParams: (params) => {
            return {
              title: LS.MSJ_ACCION_CANTIDADES,
              clase: LS.ICON_CALCULADORA,
              name: 'precio',
              id: "precioRender",
              habilitarBtn: params.data.proCodigoPrincipal && contexto && contexto.accion && (contexto.accion === LS.ACCION_CREAR || contexto.accion === LS.ACCION_MAYORIZAR) ? true : false
            }
          },
          cellEditor: 'inputNumeric',
          cellEditorParams: {
            name: 'precio',
            idRender: 'precioRender',
            id: "detPrecio",
            maxlength: 13,
            placeholder: '0.00',
            configAutonumeric: contexto.configAutonumeric,
            title: LS.MSJ_ACCION_PRECIOS,
            clase: LS.ICON_CALCULADORA
          }
        }
      );
      columnas.push(
        {
          headerName: LS.TAG_ESTADO,
          field: 'proEstadoIva',
          width: 120,
          minWidth: 120,
          cellClass: "cell-block",
          valueGetter: (params) => {
            if (params.data.proEstadoIva === 'GRAVA') {
              return contexto.invVentasTO.vtaIvaVigente + '%';
            }
            return '0%';
          }
        },
        {
          headerName: LS.TAG_TOTAL,
          cellClass: "text-sm-right cell-block",
          width: 120,
          minWidth: 120,
          valueFormatter: this.formatearA2Decimales,
          valueGetter: (params) => {
            return params.data.total;
          }
        },
        this.utilService.getColumnaOpciones()
      )
    } else {
      columnas.push(
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 120,
          minWidth: 120
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 200,
          minWidth: 200
        },
        {
          headerName: LS.TAG_UNIDAD_MEDIDA,
          field: 'proMedida',
          width: 150,
          minWidth: 150
        },
        {
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-right p-0',
          cellRenderer: 'labelNumeric',
          cellRendererParams: (params) => {
            return {
              title: LS.MSJ_ACCION_CANTIDADES,
              clase: LS.ICON_CALCULADORA,
              name: 'cantidad',
              id: "cantidadRender",
              habilitarBtn: params.data.proCodigoPrincipal ? true : false
            }
          }
        },
        {
          headerName: LS.TAG_PRECIO,
          field: 'detPrecio',
          width: 120,
          minWidth: 120,
          cellClass: 'text-right p-0',
          cellRenderer: 'labelNumeric',
          cellRendererParams: (params) => {
            return {
              title: LS.MSJ_ACCION_CANTIDADES,
              clase: LS.ICON_CALCULADORA,
              name: 'precio',
              id: "precioRender",
              habilitarBtn: params.data.proCodigoPrincipal ? true : false
            }
          }
        }
      );
      columnas.push(
        {
          headerName: LS.TAG_ESTADO,
          field: 'proEstadoIva',
          width: 120,
          minWidth: 120,
          valueGetter: (params) => {
            if (params.data.proEstadoIva === 'GRAVA') {
              return contexto.invVentasTO.vtaIvaVigente + '%';
            }
            return '0%';
          }
        },
        {
          headerName: LS.TAG_PARCIAL,
          cellClass: "text-right",
          width: 120,
          minWidth: 120,
          valueFormatter: this.formatearA2Decimales,
          valueGetter: (params) => {
            return params.data.total;
          }
        },
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',//Clase a nivel de th
          field: '',
          width: LS.WIDTH_OPCIONES,
          minWidth: LS.WIDTH_OPCIONES,
          cellRendererFramework: BotonAccionComponent,
          cellClass: 'text-center',
          cellRendererParams: (params) => {
            if (params.data.proCodigoPrincipal) {
              return {
                icono: LS.ICON_INFO_CIRCULO,
                tooltip: LS.MSJ_VER_DATOS,
                accion: LS.ACCION_VER_DETALLE_ITEM_VENTA
              };
            } else {
              return {
                icono: null,
                tooltip: null,
                accion: null
              };
            }
          },
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: ''
          }
        }
      )
    }
    return columnas;
  }

  formatearA2Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return new DecimalPipe('en-US').transform(value, '1.2-2');
  }

  validarCantidad(data): boolean {
    let cantidad = data.detCantidad ? data.detCantidad.toString().replace(/,/gi, "") : 0;
    return cantidad && cantidad >= 0.01;
  }

  validarProducto(data): boolean {
    return data.proCodigoPrincipal ? true : false;
  }

  validarPrecio(data): boolean {
    let precio = data.detPrecio ? data.detPrecio.toString().replace(/,/gi, "") : 0;
    return precio && precio >= 0.01;
  }

  validarInformacionAdicional(listInformacionAdicional: Array<ClaveValor>) {
    let valido = true;
    for (let i = 0; i < listInformacionAdicional.length; i++) {
      let isValido = (listInformacionAdicional[i].valor && listInformacionAdicional[i].clave) ? true : false;
      if (!isValido) {
        valido = false
        break;
      }
    }
    return valido;
  }

}
