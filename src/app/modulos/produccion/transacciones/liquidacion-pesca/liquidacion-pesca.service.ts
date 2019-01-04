import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { DecimalPipe } from '@angular/common';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { PrdLiquidacionDetalle } from '../../../../entidades/produccion/PrdLiquidacionDetalle';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { PrdLiquidacion } from '../../../../entidades/produccion/PrdLiquidacion';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionPescaService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }


  buscaObjLiquidacionPorLote(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getBuscaObjLiquidacionPorLote", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeBuscaObjLiquidacionPorLote(respuesta.extraInfo);
        } else {
          contexto.despuesDeBuscaObjLiquidacionPorLote(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdConsultaLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarLiquidacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarLiquidacion([]);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosLiquidacionPesca(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/obtenerDatosParaLiquidacionPesca", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosLiquidacionPesca(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeObtenerDatosLiquidacionPesca(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  consultarLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeConsultarLiquidacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeConsultarLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarModificarLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarModificarPrdLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeInsertarModificarLiquidacion(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeInsertarModificarLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/desmayorizarPrdLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeDesmayorizarLiquidacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeDesmayorizarLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarLoteLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/desmayorizarPrdLiquidacionLote", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeDesmayorizarLoteLiquidacion(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.TAG_LIQUIDACION_PESCA, LS.SWAL_WARNING, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
          contexto.cargando = false;
          contexto.buscar();
          // contexto.despuesDeDesmayorizarLoteLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  anularRestaurarLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/anularRestaurarPrdLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeAnularRestaurarLiquidacion(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeAnularRestaurarLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(): Array<any> {
    return [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 70,
        minWidth: 70,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-sm-center',
        field: '',
        width: 105,
        minWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.liqAnulado === "ANULADO") {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.liqPendiente === "PENDIENTE") {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        },
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'liqMotivo',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'liqNumero',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_LOTE,
        field: 'liqLote',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'liqFecha',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_CLIENTE,
        field: 'cliCodigo',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'cliNombre',
        width: 250,
        minWidth: 250,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'liqTotalMonto',
        width: 220,
        minWidth: 200,
        cellClass: 'text-right',
        valueFormatter: numberFormatter,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: 'text-center',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        maxWidth: LS.WIDTH_OPCIONES,
        cellRendererFramework: BotonOpcionesComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: '',
          enableSorting: false
        },
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.liqPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      }
    ];
  }

  generarColumnasFormulario(contexto): Array<any> {
    let array = [];
    let esEditable = (contexto.accion === LS.ACCION_CREAR || contexto.accion === LS.ACCION_MAYORIZAR) ? true : false;
    if (esEditable) {
      array.push(
        {
          headerName: LS.TAG_MOVER_FILA,
          field: '',
          headerClass: 'cell-header-center',
          cellClass: 'text-center',
          width: 50,
          minWidth: 50,
          rowDrag: esEditable, //Para mover las filas
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_MOVER_FILA,
            tooltip: LS.TAG_MOVER_FILA,
            text: '',
            enableSorting: false
          },
          valueGetter: ''
        }
      )
    }
    array.push(
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'prdLiquidacionProducto',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_PRODUCTO },
        cellEditorFramework: SelectCellComponent,
        valueGetter: (params) => { return (params.data.prdLiquidacionProducto.prodDetalle) },
        cellEditorParams: function (params) {
          var prdLiquidacionProducto = params.data.prdLiquidacionProducto;
          return {
            value: prdLiquidacionProducto,
            name: 'prdLiquidacionProducto',
            obligatorio: true,
            ejecutarMetodoChange: false,
            listValues: contexto.listaProductos,
            fieldsShow: ['prodDetalle', 'prdLiquidacionProductoPK.prodCodigo']
          }
        },
        editable: (params) => { return (params.node.rowPinned) ? false : esEditable },
        pinnedRowCellRendererFramework: PinnedCellComponent,
        pinnedRowCellRendererParams: { value: "Rendimiento: (%) ", style: { "font-weight": "bold" } }
      },
      {
        headerName: LS.TAG_CLASE,
        field: 'prdLiquidacionProducto.prodTipo',
        width: 100,
        minWidth: 100,
        cellClass: (params) => { return (params.node.rowPinned ? 'text-right' : '') },
        valueFormatter: (params) => { return (params.node.rowPinned ? new DecimalPipe('en-US').transform(params.value, '1.2-2') : null) },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.totalRendimiento : params.data.prdLiquidacionProducto.prodTipo) },
      },
      {
        headerName: LS.TAG_TALLA,
        field: 'prdLiquidacionTalla',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_TALLA },
        cellEditorFramework: SelectCellComponent,
        valueGetter: (params) => { return (params.data.prdLiquidacionTalla.tallaDetalle) },
        cellEditorParams: function (params) {
          var prdLiquidacionTalla = params.data.prdLiquidacionTalla;
          return {
            value: prdLiquidacionTalla,
            name: 'prdLiquidacionTalla',
            obligatorio: true,
            ejecutarMetodoChange: false,
            listValues: contexto.listaTalla,
            fieldsShow: ['tallaDetalle', 'prdLiquidacionTallaPK.tallaCodigo']
          }
        },
        editable: (params) => { return (params.node.rowPinned) ? false : esEditable },
      },
      {
        headerName: LS.TAG_UNIDAD_MEDIDA,
        field: 'prdLiquidacionTalla.tallaUnidadMedida',
        width: 100,
        minWidth: 100,
        pinnedRowCellRendererFramework: PinnedCellComponent,
        pinnedRowCellRendererParams: { value: "Totales: ", style: { "font-weight": "bold" } }
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'detLibras',
        width: 100,
        minWidth: 100,
        cellClass: "text-right",
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (params.node.rowPinned ? (contexto.cantidades ? contexto.cantidades : 0) : params.data.detLibras) },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detLibras', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaDetalle) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: (params) => { return (params.node.rowPinned) ? false : esEditable },
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.node.rowPinned && params.data.detLibras === 0;
          }
        }
      },
      {
        headerName: LS.TAG_PRECIO,
        field: 'detPrecio',
        width: 100,
        minWidth: 100,
        cellClass: "text-right",
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.detPrecio : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detPrecio', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric6 },
        suppressKeyboardEvent: (params) => {
          if (params.event.keyCode === LS.KEYCODE_TAB) {
            params.event.srcElement.blur()
          }
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaDetalle) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: (params) => { return (params.node.rowPinned) ? false : esEditable },
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.node.rowPinned && params.data.detPrecio === 0;
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'prdTotal',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (params.node.rowPinned ? (contexto.total ? contexto.total : 0) : params.data.prdTotal) },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'prdTotal', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric6 },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaDetalle) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: (params) => { return (params.node.rowPinned) ? false : esEditable },
      }
    );

    if (esEditable) {
      array.push(this.utilService.getColumnaOpciones())
    }

    return array;
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
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularLiquidaciones;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruEliminarLiquidaciones;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruMayorizarLiquidaciones;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarLiquidaciones;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularLiquidaciones;
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

  obtenerNuevoDetalle(elementoActual): PrdLiquidacionDetalle {
    let detalle = new PrdLiquidacionDetalle();
    detalle.prdLiquidacionProducto = elementoActual.prdLiquidacionProducto;
    detalle.prdLiquidacionTalla = elementoActual.prdLiquidacionTalla;
    return detalle;
  }

  formatearDetalleParaEnviar(prdLiquidacion: PrdLiquidacion, listaDetalle: Array<PrdLiquidacionDetalle>, contexto) {
    let sumatoriaCola = 0;
    let sumatoriaCabeza = 0;
    let cantidadProducto = 0;
    let tipoProducto = "";
    let unidadMedida = "";
    let cantidadTotalCabezaLibras = this.utilService.matRound2(this.utilService.convertirDecimaleFloat(prdLiquidacion.liqLibrasEntero));// convertir numero y redondear 2 digitos
    let cantidadTotalColaLibras = this.utilService.matRound2(this.utilService.convertirDecimaleFloat(prdLiquidacion.liqLibrasColaProcesadas));// convertir numero y redondear 2 digitos
    let objetoEnviar = { correcto: false, mensaje: "", prdLiquidacion: null, prdLiquidacionDetalleList: [] };
    let detalleList = JSON.parse(JSON.stringify(listaDetalle));

    //Formateando la cabecera
    prdLiquidacion.liqFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(contexto.fechaDesde);
    prdLiquidacion.prdCorrida = contexto.corridaSeleccionada;
    prdLiquidacion.invCliente.invClientePK.cliCodigo = contexto.clienteCodigo;
    prdLiquidacion.invCliente.cliRazonSocial = contexto.cliente.cliRazonSocial
    prdLiquidacion.invCliente.invClientePK.cliEmpresa = contexto.empresaSeleccionada.empCodigo;
    prdLiquidacion.prdPiscina.prdPiscinaPK.pisEmpresa = contexto.empresaSeleccionada.empCodigo;
    prdLiquidacion.prdPiscina.prdPiscinaPK.pisSector = contexto.corridaSeleccionada.prdCorridaPK.corSector;
    prdLiquidacion.prdPiscina.prdPiscinaPK.pisNumero = contexto.corridaSeleccionada.prdCorridaPK.corPiscina;
    prdLiquidacion.prdLiquidacionPK.liqEmpresa = contexto.empresaSeleccionada.empCodigo;
    prdLiquidacion.prdLiquidacionPK.liqMotivo = contexto.motivoSeleccionado.prdLiquidacionMotivoPK.lmCodigo;
    contexto === LS.ACCION_CREAR ? prdLiquidacion.prdLiquidacionDetalleList = null : null;
    prdLiquidacion.liqTotalMonto = this.utilService.convertirDecimaleFloat(contexto.total);

    //Formateando detalle
    detalleList.forEach(value => {
      value.prdLiquidacion = null;
      tipoProducto = value.prdLiquidacionProducto.prodTipo.toString().trim();
      cantidadProducto = value.detLibras;
      unidadMedida = value.prdLiquidacionTalla.tallaUnidadMedida;
      if (tipoProducto === "COLA") {
        if (value.prdLiquidacionTalla.tallaUnidadMedida === null || unidadMedida === 'LIBRAS') {
          sumatoriaCola = cantidadProducto + sumatoriaCola;
        } else {
          if (unidadMedida === 'KILOS')
            sumatoriaCola = cantidadProducto * 2.20462 + sumatoriaCola;
        }
      }
      if (tipoProducto === "CABEZA") {
        if (value.prdLiquidacionTalla.tallaUnidadMedida === null || unidadMedida === 'LIBRAS') {
          sumatoriaCabeza = cantidadProducto + sumatoriaCabeza;
        } else {
          if (unidadMedida === 'KILOS')
            sumatoriaCabeza = cantidadProducto * 2.20462 + sumatoriaCabeza;
        }
      }
      delete value.prdTotal;//Eliminar TEMPORAL
    });

    sumatoriaCabeza = this.utilService.matRound2(sumatoriaCabeza);//Convertir en 2 decimales
    sumatoriaCola = this.utilService.matRound2(sumatoriaCola);//Convertir en 2 decimales

    if (cantidadTotalCabezaLibras === sumatoriaCabeza && cantidadTotalColaLibras === sumatoriaCola) {
      objetoEnviar.correcto = true;
    } else {
      objetoEnviar.correcto = false;
      if (cantidadTotalCabezaLibras !== sumatoriaCabeza) {
        objetoEnviar.mensaje = "La sumatoria de libras cabeza (" + cantidadTotalCabezaLibras + ") es distinto al valor ingresado (" + sumatoriaCabeza + " Lbs)";
      }
      if (cantidadTotalColaLibras !== sumatoriaCola) {
        if (objetoEnviar.mensaje !== "") {
          objetoEnviar.mensaje = objetoEnviar.mensaje + " y ";
        }
        objetoEnviar.mensaje = objetoEnviar.mensaje + "La sumatoria de libras cola  (" + cantidadTotalColaLibras + ") es distinto al valor ingresado (" + sumatoriaCola + " Lbs) ";
      }
    }
    objetoEnviar.prdLiquidacionDetalleList = detalleList;
    objetoEnviar.prdLiquidacion = prdLiquidacion;

    return objetoEnviar;
  }

  algunaFilaPendienteOAnulada(listado) {
    let respuesta = false;
    for (let item of listado) {
      if (item.liqPendiente === LS.ETIQUETA_PENDIENTE || item.liqAnulado === LS.ETIQUETA_ANULADO) {
        respuesta = true;
        break;
      }
    }
    return respuesta;
  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}