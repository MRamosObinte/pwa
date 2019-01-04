import { Injectable } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvPedidosOrdenCompraDetalleTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraDetalleTO';
import { OrdenCompraService } from '../../transacciones/generar-orden-compra/orden-compra.service';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { PopOverInformacionComponent } from '../../../componentes/pop-over-informacion/pop-over-informacion.component';

@Injectable({
  providedIn: 'root'
})
export class GenerarOrdenCompraService {

  constructor(
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private ordenCompraService: OrdenCompraService,
    private toastr: ToastrService,
    private archivoService: ArchivoService
  ) { }

  iniciarAtajos(contexto) {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnAnularOrdenCompra') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  };

  validarAntesDeEnviar(form: NgForm, contexto, agrid): boolean {
    var validado = true;
    var detalleValidado = this.validarDetalle(agrid);
    let formTouched = this.utilService.establecerFormularioTocado(form);
    let datosTabla = this.getRowData(agrid);
    let listadoDetalle = this.ordenCompraService.crearListaDetalleOrdenCompra(datosTabla);
    contexto.invPedidosOrdenCompra.ocValorRetencion = contexto.pinnedBottomRowData[1].ocValorRetencion;//Retencion
    if (!(formTouched && form && form.valid && contexto.invPedidosOrdenCompra.ocValorRetencion <= contexto.pinnedBottomRowData[0].ocValorRetencion)) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    } else if (!detalleValidado) {
      this.toastr.error(LS.MSJ_INGRESE_DATOS_DETALLE, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    } else if (contexto.campoCostoRerefencia === "") {
      this.toastr.error(LS.MSJ_INVALID_COSTO_REF, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    contexto.cargando = validado;
    if (validado) {
      //Se completan los campos
      contexto.invPedidosOrdenCompra.invPedidosOrdenCompraDetalleList = listadoDetalle;
      contexto.invPedidosOrdenCompra.ocFormaPago = contexto.campoCostoRerefencia;
      contexto.invPedidosOrdenCompra.ocMontoTotal = this.ordenCompraService.obtenerTotalDeListaInvPedidosOrdenCompraDetalle(listadoDetalle);
      contexto.listaInvPedidosDetalle = this.ordenCompraService.establecerCantidadAdquiridaEnInvPedidosDetalle(listadoDetalle, contexto.listaInvPedidosDetalle)
    }
    return validado;
  }

  validarDetalle(agrid): boolean {
    let esValido = true;
    let cantValidoPorLoMenos1 = 0;
    if (agrid) {
      agrid.forEachNode((node) => {
        let isInvalid = this.esInvalidaCantidad(node.data) || this.esInvalidoPrecioReal(node.data);
        if ((node.data.detCompletado && !isInvalid) || (!isInvalid && node.data.detCantidad > 0)) {
          cantValidoPorLoMenos1++;
        }
      });
      esValido = cantValidoPorLoMenos1 > 0;
    }
    return esValido;
  }

  getRowData(agrid): Array<InvPedidosOrdenCompraDetalleTO> {
    var rowData = [];
    if (agrid) {
      agrid.forEachNode(function (node) {
        rowData.push(node.data);
      });
    }
    return rowData;
  }

  exportarOrdenCompra(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidosOrdenCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoExcel(respuesta._body, 'OrdenCompra_');
        } else {
          this.toastr.warning(LS.MSJ_NO_DATA);
        }
        contexto.cargando = false;
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  focusProveedorCodigo() {
    let element = document.getElementById('provCodigo');
    element ? element.focus() : null;
  }

  esValidoProveedor(proveedorCopia, invPedidosOrdenCompra): boolean {
    return proveedorCopia.provCodigo != "" && proveedorCopia.provCodigo === invPedidosOrdenCompra.invProveedor.invProveedorPK.provCodigo;
  }

  generarPinnedBottonRowData(): Array<any> {
    return [
      {
        proCodigoPrincipal: '..',
        proNombre: '',
        medDetalle: '',
        detCantidadAprobada: 0,
        detCantidadAdquirida: 0,
        detCantidad: 0,
        detPrecioReal: 0,
        totalGeneral: 0,
        ocValorRetencion: 1,
        detObservaciones: ''
      },
      {
        proCodigoPrincipal: '.',
        proNombre: '',
        medDetalle: '',
        detCantidadAprobada: 0,
        detCantidadAdquirida: 0,
        detCantidad: 0,
        detPrecioReal: 0,
        totalGeneral: 0,
        ocValorRetencion: 1,
        detObservaciones: ''
      },
      {
        proCodigoPrincipal: '',
        proNombre: '',
        medDetalle: '',
        detCantidadAprobada: 0,
        detCantidadAdquirida: 0,
        detCantidad: 0,
        detPrecioReal: 0,
        totalGeneral: 0,
        ocValorRetencion: 1,
        detObservaciones: ''
      }
    ]
  }

  /**
   * Genera las columnas para el detalle del formulario de la orden de compra.
   * En el contexto deben existir las variables: configAutonumeric, motivoOCSeleccionado, configAutonumeric6
   * @param {*} contexto
   * @param {*} accion
   * @returns {Array<any>}
   * @memberof OrdenCompraService
   */
  generarColumnasOrdenCompraDetalle(contexto, accion): Array<any> {
    let esEditable = accion === LS.ACCION_EJECUTAR ? true : false;
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CODIGO,
        field: 'proCodigoPrincipal',
        width: 100,
        minWidth: 100,
        rowDrag: esEditable, //Para mover las filas
        cellClassRules: {
          "cell-block": (params) => { if (params.node.rowPinned || contexto.accion !== LS.ACCION_EJECUTAR) { return false; } return true; }
        },
        valueGetter: (params) => {
          return params.node.rowPinned ? "" : params.data.proCodigoPrincipal;
        }
      },
      {
        headerName: LS.TAG_KARDEX,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: 'text-center cell-block',
        width: 70,
        minWidth: 70,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_KARDEX,
          tooltip: LS.TAG_KARDEX,
          text: '',
          enableSorting: false
        },
        cellRendererFramework: BotonAccionComponent,
        cellRendererParams: (params) => {
          return !params.node.rowPinned ? {
            icono: LS.ICON_KARDEX,
            tooltip: LS.TAG_KARDEX,
            accion: 'verKardex',
            class: ''
          } : null
        }
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'proNombre',
        width: 150,
        minWidth: 150,
        cellClassRules: {
          "cell-block": (params) => { if (params.node.rowPinned || contexto.accion !== LS.ACCION_EJECUTAR) { return false; } return true; }
        }
      },
      {
        headerName: LS.TAG_UNIDAD_MEDIDA,
        field: 'medDetalle',
        width: 150,
        minWidth: 150,
        cellClassRules: {
          "cell-block": (params) => { if (params.node.rowPinned || contexto.accion !== LS.ACCION_EJECUTAR) { return false; } return true; }
        }
      }
    );
    if (accion === LS.ACCION_EJECUTAR) {
      columnas.push(
        {
          headerName: LS.TAG_CANTIDAD_PENDIENTE,
          width: 145,
          minWidth: 145,
          cellClass: "text-right",
          cellClassRules: {
            "cell-block": (params) => { if (params.node.rowPinned || contexto.accion !== LS.ACCION_EJECUTAR) { return false; } return true; }
          },
          valueFormatter: this.utilService.formatearA2Decimales,
          valueGetter: (params) => {
            return params.data.detCantidadAprobada - params.data.detCantidadAdquirida || 0;
          },
          pinnedRowCellRenderer: "pinnedCell",
          pinnedRowCellRendererParams: { value: "" }
        }
      )
    }
    columnas.push(
      {
        headerComponentFramework: InputLabelCellComponent,
        headerClass: 'pr-0',
        headerComponentParams: { name: LS.TAG_CANTIDAD, value: contexto.apruebaTodos, tooltipText: LS.TAG_TODOS, noVisible: contexto.accion !== LS.ACCION_EJECUTAR ? true : false },
        field: 'detCantidad',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 114,
        minWidth: 114,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (
              this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)
            )
          }
        },
        editable: (params) => {
          if (!esEditable || params.node.rowPinned) {
            return false;
          }
          return true;
        },
        cellClass: 'text-right',
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!esEditable || params.node.rowPinned) {
              return false;
            }
            if (esEditable) {//si no hay nada en el detalle tambien pinta de rojito
              let cantidadValida = this.esCantidadValida(params.data);
              let detalleValido = this.validarDetalle(contexto.gridApi);
              if (cantidadValida) {
                return false;
              } else {
                if (detalleValido) {
                  return !cantidadValida;
                }
                return true;
              }
            }
            return false;
          },
          "cell-editing": (params) => { if (!esEditable) { return false; } if (params.node.rowPinned) { return false; } return true; }
        },
        cellEditor: "numericEditor",
        cellEditorParams: { name: 'detCantidad', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        pinnedRowCellRenderer: "pinnedCell",
        pinnedRowCellRendererParams: { value: "" }
      },
      {
        headerName: LS.TAG_PRECIO,
        field: 'detPrecioReal',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 120,
        minWidth: 120,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (
              this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)
            )
          }
        },
        editable: (params) => {
          if (esEditable && !params.node.rowPinned) {
            return this.eseEditableSegunPrecioMotivo(params, contexto);
          } else {
            return false;
          }
        },
        cellClass: "text-right",
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!esEditable || params.node.rowPinned) {
              return false;
            }
            if (esEditable) {//si no hay nada en el detalle tambien pinta de rojito
              let precioValido = this.esPrecioRealValido(params.data);
              let detalleValido = this.validarDetalle(contexto.gridApi);
              if (precioValido) {
                return false;
              } else {
                if (detalleValido) {
                  return !precioValido;
                }
                return true;
              }
            }
            return false;
          },
          "cell-editing": (params) => { if (!esEditable) { return false; } if (params.node.rowPinned) { return false; } return true; }
        },
        cellEditor: "numericEditor",
        cellEditorParams: { name: 'detPrecioReal', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric6 },
        pinnedRowCellRenderer: "pinnedCell",
        pinnedRowCellRendererParams: (params) => {
          if (params.node.data.proCodigoPrincipal === '..') {
            return {
              value: "Subtotal: ", style: { "font-weight": "bold" }
            }
          }
          if (params.node.data.proCodigoPrincipal === '.') {
            return {
              value: "Total Retención: ", style: { "font-weight": "bold" }
            }
          }
          if (params.node.data.proCodigoPrincipal === '') {
            return {
              value: "Total: ", style: { "font-weight": "bold" }
            }
          }
        }
      },
      {
        headerName: LS.TAG_PARCIAL,
        cellClass: "text-right",
        width: 200,
        minWidth: 120,
        field: 'ocValorRetencion',
        valueFormatter: this.utilService.formatearA2Decimales,
        cellClassRules: {
          "cell-block": (params) => { return ((params.node.rowPinned || contexto.accion !== LS.ACCION_EJECUTAR) ? true : false) },
          "cell-with-errors": (params) => { return (params.node.rowPinned && params.node.data.proCodigoPrincipal === '.' ? !this.validarCantidadRetencion(params.data, contexto) : false) }
        },
        editable: (params) => { return ((params.node.rowPinned && params.node.data.proCodigoPrincipal === '.' && accion === LS.ACCION_EJECUTAR) ? true : false); },
        valueGetter: (params) => {
          if (esEditable) {
            if (params.node.rowPinned && params.node.data.proCodigoPrincipal !== '.' && params.node.data.proCodigoPrincipal !== '..') {// es totales
              return params.data.totalGeneral ? params.data.totalGeneral : 0;
            }
            if (params.node.rowPinned && params.node.data.proCodigoPrincipal === '..') {// es subtotales
              return params.data.totalGeneral > 0 ? params.data.totalGeneral - params.data.ocValorRetencion : params.data.ocValorRetencion;
            }
            if (params.node.rowPinned && params.node.data.proCodigoPrincipal === '.') {//Es retencion
              return params.data.ocValorRetencion;
            }
            return params.data.detCantidad * params.data.detPrecioReal;
          } else {
            if (params.node.rowPinned && params.node.data.proCodigoPrincipal !== '.' && params.node.data.proCodigoPrincipal !== '..') {// es totales
              return contexto.invPedidosOrdenCompra.ocMontoTotal - contexto.invPedidosOrdenCompra.ocValorRetencion;
            }
            if (params.node.rowPinned && params.node.data.proCodigoPrincipal === '..') {// es subtotales
              return contexto.invPedidosOrdenCompra.ocMontoTotal;
            }
            if (params.node.rowPinned && params.node.data.proCodigoPrincipal === '.') {//Es retencion
              return contexto.invPedidosOrdenCompra.ocValorRetencion;
            }
            return params.data.detCantidad * params.data.detPrecioReal;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'ocValorRetencion',
          maxlength: 25,
          placeholder: '0.00',
          configAutonumeric: contexto.configAutonumeric
        }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'detObservaciones',
        width: 300,
        minWidth: 180,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (
              this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)
            )
          }
        },
        editable: (params) => { if (!esEditable) { return false; } if (params.node.rowPinned) { return false; } return true },
        cellClassRules: { "cell-editing": (params) => { if (!esEditable) { return false; } if (params.node.rowPinned) { return false; } return true; } },
        pinnedRowCellRenderer: "pinnedCell",
        cellEditor: "inputEditor",
        cellEditorParams: {
          name: 'detObservaciones',
          maxlength: 1000,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      },
      {
        headerName: LS.TAG_OBS_REGISTRADOR,
        field: '',
        width: 130,
        minWidth: 130,
        cellRendererFramework: PopOverInformacionComponent,
        cellRendererParams: (params) => {
          return {
            titulo: LS.TAG_OBS_REGISTRADOR,
            informacion: params.data.ocObsRegistra
          };
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_OBSERVACION_REGISTRADOR,
          text: LS.TAG_OBS_REGISTRADOR,
          enableSorting: true
        },
        pinnedRowCellRenderer: "pinnedCell"
      },
      {
        headerName: LS.TAG_OBS_APROBADOR,
        field: '',
        width: 130,
        minWidth: 130,
        cellRendererFramework: PopOverInformacionComponent,
        cellRendererParams: (params) => {
          return {
            titulo: LS.TAG_OBS_APROBADOR,
            informacion: params.data.ocObsAprueba
          };
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_OBSERVACION_APROBADOR,
          text: LS.TAG_OBS_APROBADOR,
          enableSorting: true
        },
        pinnedRowCellRenderer: "pinnedCell",
        hide: contexto.data.pmAprobacionAutomatica
      }
    )
    if (esEditable) {
      columnas.push(
        {
          headerName: LS.TAG_DAR_POR_COMPLETADO,
          headerClass: 'cell-header-center',
          field: 'detCompletado',
          cellClass: "text-sm-center",
          width: 70,
          minWidth: 70,
          cellClassRules: {
            "cell-block": (params) => { if (params.node.rowPinned || contexto.accion !== LS.ACCION_EJECUTAR) { return false; } return true; }
          },
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: LS.ICON_SELECCIONAR,
            tooltip: LS.TAG_DAR_POR_COMPLETADO,
            text: '',
            enableSorting: false
          },
          suppressKeyboardEvent: (params) => {
            if (params.editing) {
              return (
                this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)
              )
            }
          },
          editable: (params) => { if (!esEditable) { return false; } if (params.node.rowPinned) { return false; } return true },
          cellEditor: "checkEditor",
          cellEditorParams: { name: 'detCompletado', clase: 'mt-1' },
          valueFormatter: (params) => { return params.value ? 'SI' : 'NO'; },
          pinnedRowCellRenderer: "pinnedCell",
          pinnedRowCellRendererParams: { value: "" }
        }
      );
    }

    return columnas;
  }

  generarColumnasOrdenCompraDetalleConsulta(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CODIGO,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          if (params.data && params.data.invPedidosDetalle) {
            return params.data.invPedidosDetalle.invProducto.invProductoPK.proCodigoPrincipal;
          } else {
            return ''
          }
        }
      },
      {
        headerName: LS.TAG_KARDEX,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: 'text-center cell-block',
        width: 70,
        minWidth: 70,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_KARDEX,
          tooltip: LS.TAG_KARDEX,
          text: '',
          enableSorting: false
        },
        cellRendererFramework: BotonAccionComponent,
        cellRendererParams: (params) => {
          return !params.node.rowPinned ? {
            icono: LS.ICON_KARDEX,
            tooltip: LS.TAG_KARDEX,
            accion: 'verKardex',
            class: ''
          } : null
        }
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          if (params.data && params.data.invPedidosDetalle) {
            return params.data.invPedidosDetalle.invProducto.proNombre;
          } else {
            return ''
          }
        }
      },
      {
        headerName: LS.TAG_UNIDAD_MEDIDA,
        width: 150,
        minWidth: 150,
        valueGetter: (params) => {
          if (params.data && params.data.invPedidosDetalle) {
            return params.data.invPedidosDetalle.invProducto.invProductoMedida.medDetalle;
          } else {
            return ''
          }
        }
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'detCantidad',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 120,
        minWidth: 120,
        cellClass: 'text-sm-right',
        cellEditor: "numericEditor",
        cellEditorParams: { name: 'detCantidad', maxlength: 25, placeholder: '0.00' },
        pinnedRowCellRenderer: "pinnedCell",
        pinnedRowCellRendererParams: { value: "" }
      },
      {
        headerName: LS.TAG_PRECIO,
        field: 'detPrecioReal',
        valueFormatter: this.utilService.formatearA2Decimales,
        width: 120,
        minWidth: 120,
        cellClass: "text-sm-right",
        cellEditor: "numericEditor",
        cellEditorParams: { name: 'detPrecioReal', maxlength: 25, placeholder: '0.00' },
        pinnedRowCellRenderer: "pinnedCell",
        pinnedRowCellRendererParams: (params) => {
          if (params.node.data.proCodigoPrincipal !== '.') {
            return {
              value: "Total: ", style: { "font-weight": "bold" }
            }
          }
          else {
            return {
              value: "Total Retención: ", style: { "font-weight": "bold" }
            }
          }
        }
      },
      {
        headerName: LS.TAG_PARCIAL,
        cellClass: "text-sm-right",
        width: 200,
        minWidth: 120,
        field: 'ocValorRetencion',
        valueFormatter: this.utilService.formatearA2Decimales,
        valueGetter: (params) => {
          if (params.node.rowPinned && params.node.data.proCodigoPrincipal !== '.' && params.node.data.proCodigoPrincipal !== '..') {// es totales
            return params.data.totalGeneral ? params.data.totalGeneral : 0;
          }
          if (params.node.rowPinned && params.node.data.proCodigoPrincipal === '..') {// es subtotales
            return params.data.totalGeneral > 0 ? params.data.totalGeneral - params.data.ocValorRetencion : params.data.ocValorRetencion;
          }
          if (params.node.rowPinned && params.node.data.proCodigoPrincipal === '.') {//Es retencion
            return params.data.ocValorRetencion;
          }
          return params.data.detCantidad * params.data.detPrecioReal;
        }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'detObservaciones',
        width: 300,
        minWidth: 120
      });
    return columnas;
  }

  esInvalidaCantidad(data): boolean {
    let cantidadPorAdquirir = data.detCantidadAprobada - data.detCantidadAdquirida;
    let value = data.detCantidad;
    let isValido = (value === undefined || value === null || (value && value < 0) || (value && value > cantidadPorAdquirir)) ? true : false;
    return isValido;
  }

  esCantidadValida(data): boolean {
    let cantidadPorAdquirir = data.detCantidadAprobada - data.detCantidadAdquirida;
    let value = data.detCantidad;
    let isValido = value && value <= cantidadPorAdquirir ? true : false;
    return isValido;
  }

  esInvalidoPrecioReal(data): boolean {
    //Si la cantidad es mayor a cero, entonces el valor mínimo del precio real es 0.01, else 0
    let minNumero = data.detCantidad > 0 ? 0.01 : 0.00;
    let value = data.detPrecioReal;
    let isValido = (value === undefined || value === null || (value >= 0 && value < minNumero)) ? true : false;
    return isValido;
  }

  esPrecioRealValido(data): boolean {
    //Si la cantidad es mayor a cero, entonces el valor mínimo del precio real es 0.01, else 0
    let minNumero = data.detCantidad > 0 ? 0.01 : 0.00;
    let value = data.detPrecioReal;
    let isValido = value && value >= minNumero ? true : false;
    return isValido;
  }

  //Si retencion debe ser menor o igual que el subtotal
  validarCantidadRetencion(data, contexto): boolean {
    let ocValorRetencion = data.ocValorRetencion;
    let subtotal = contexto.pinnedBottomRowData[0].ocValorRetencion;
    return ocValorRetencion <= subtotal;
  }

  //Si editable es false, o es una fila footer, o costo fijo de motivo es true => La celda no sera editable
  eseEditableSegunPrecioMotivo(params, contexto): boolean {
    let esEditable = false;
    let isPrecioFijo = false;
    isPrecioFijo = contexto.motivoOCSeleccionado && contexto.motivoOCSeleccionado.ocmCostoFijo;
    esEditable = (isPrecioFijo && params.data.detPrecioReferencial === 0) || !isPrecioFijo;
    return esEditable;
  }

}
