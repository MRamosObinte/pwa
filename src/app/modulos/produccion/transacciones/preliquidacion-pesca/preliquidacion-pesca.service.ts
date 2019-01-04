import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { PrdPreLiquidacionDetalle } from '../../../../entidades/produccion/PrdPreLiquidacionDetalle';
import { PrdPreLiquidacion } from '../../../../entidades/produccion/PrdPreLiquidacion';

@Injectable({
  providedIn: 'root'
})
export class PreliquidacionPescaService {
  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService) { }

  buscaObjPreLiquidacionPorLote(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getBuscaObjPreLiquidacionPorLote", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeBuscaObjPreLiquidacionPorLote(respuesta.extraInfo);
        } else {
          contexto.despuesDeBuscaObjPreLiquidacionPorLote(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarPreLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPrdConsultaPreLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPreLiquidacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarPreLiquidacion([]);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarModificarPreLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarModificarPrdPreLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeInsertarModificarPreLiquidacion(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeInsertarModificarPreLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  consultarPreLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getPrdPreLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeConsultarPreLiquidacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeConsultarPreLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarPreLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/desmayorizarPrdPreLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeDesmayorizarPreLiquidacion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeDesmayorizarPreLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarLotePreLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/desmayorizarPrdPreLiquidacionLote", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeDesmayorizarLotePreLiquidacion(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.TAG_PRE_LIQUIDACION_PESCA, LS.SWAL_WARNING, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
          contexto.cargando = false;
          contexto.buscar();
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  anularRestaurarPreLiquidacion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/anularRestaurarPrdPreLiquidacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion && respuesta.extraInfo) {
          contexto.despuesDeAnularRestaurarPreLiquidacion(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.despuesDeAnularRestaurarPreLiquidacion(null);
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  algunaFilaPendienteOAnulada(listado) {
    let respuesta = false;
    for (let item of listado) {
      if (item.plPendiente === LS.ETIQUETA_PENDIENTE || item.plAnulado === LS.ETIQUETA_ANULADO) {
        respuesta = true;
        break;
      }
    }
    return respuesta;
  }

  config2number() {
    return {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999.99',
      minimumValue: '0',
    }
  }

  config6number() {
    return {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '9999999999.999999',
      minimumValue: '0'
    }
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
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
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
          if (params.data.plAnulado === "ANULADO") {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.plPendiente === "PENDIENTE") {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        },
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_MOTIVO,
        field: 'plMotivo',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'plNumero',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_LOTE,
        field: 'plLote',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'plFecha',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
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
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
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
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
          }
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'plTotalMonto',
        width: 220,
        minWidth: 200,
        cellClass: 'text-right',
        valueFormatter: numberFormatter,
        cellClassRules: {
          'fila-pendiente': (params) => {
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
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
            return (params.data.plPendiente === LS.ETIQUETA_PENDIENTE ? true : false)
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
        field: 'prdProducto',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_PRODUCTO },
        cellEditorFramework: SelectCellComponent,
        valueFormatter: function (params) {
          return !params.node.rowPinned && params.data && params.data.prdProducto && params.data.prdProducto.prodDetalle ? params.data.prdProducto.prodDetalle : '';
        },
        cellEditorParams: function (params) {
          var prdProducto = params.data.prdProducto;
          return {
            value: prdProducto,
            name: 'prdProducto',
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
        field: 'prdProducto.prodTipo',
        width: 100,
        minWidth: 100,
        cellClass: (params) => { return (params.node.rowPinned ? 'text-right' : '') },
        valueFormatter: (params) => { return (params.node.rowPinned ? new DecimalPipe('en-US').transform(params.value, '1.2-2') : null) },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.totalRendimiento : params.data.prdProducto.prodTipo) },
      },
      {
        headerName: LS.TAG_TALLA,
        field: 'prdTalla',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_TALLA },
        cellEditorFramework: SelectCellComponent,
        valueGetter: (params) => { return !params.node.rowPinned ? (params.data.prdTalla.tallaDetalle) : '' },
        cellEditorParams: function (params) {
          var prdTalla = params.data.prdTalla;
          return {
            value: prdTalla,
            name: 'prdTalla',
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
        field: 'prdTalla.tallaUnidadMedida',
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

  obtenerNuevoDetalle(elementoActual): PrdPreLiquidacionDetalle {
    let detalle = new PrdPreLiquidacionDetalle();
    detalle.prdProducto = elementoActual.prdProducto;
    detalle.prdTalla = elementoActual.prdTalla;
    return detalle;
  }

  formatearDetalleParaEnviar(prdPreLiquidacion: PrdPreLiquidacion, listaDetalle: Array<PrdPreLiquidacionDetalle>, contexto) {
    let sumatoriaCola = 0;
    let sumatoriaCabeza = 0;
    let cantidadProducto = 0;
    let tipoProducto = "";
    let unidadMedida = "";
    let cantidadTotalCabezaLibras = this.utilService.convertirDecimaleFloat(prdPreLiquidacion.plLibrasEntero);
    let cantidadTotalColaLibras = this.utilService.convertirDecimaleFloat(prdPreLiquidacion.plLibrasColaProcesadas);
    let objetoEnviar = { correcto: false, mensaje: "", prdPreLiquidacion: null, listaPrdPreLiquidacionDetalle: [] };
    let detalleList: Array<PrdPreLiquidacionDetalle> = JSON.parse(JSON.stringify(listaDetalle));

    //Formateando la cabecera
    prdPreLiquidacion.plFecha = this.utilService.formatoStringSinZonaHorariaYYYMMDD(contexto.fechaDesde);
    prdPreLiquidacion.prdCorrida = contexto.corridaSeleccionada;
    prdPreLiquidacion.invCliente.invClientePK.cliCodigo = contexto.clienteCodigo;
    prdPreLiquidacion.invCliente.cliRazonSocial = contexto.cliente.cliRazonSocial
    prdPreLiquidacion.invCliente.invClientePK.cliEmpresa = contexto.empresaSeleccionada.empCodigo;
    prdPreLiquidacion.prdPiscina.prdPiscinaPK.pisEmpresa = contexto.empresaSeleccionada.empCodigo;
    prdPreLiquidacion.prdPiscina.prdPiscinaPK.pisSector = contexto.corridaSeleccionada.prdCorridaPK.corSector;
    prdPreLiquidacion.prdPiscina.prdPiscinaPK.pisNumero = contexto.corridaSeleccionada.prdCorridaPK.corPiscina;

    prdPreLiquidacion.prdPreLiquidacionPK.plEmpresa = contexto.empresaSeleccionada.empCodigo;
    prdPreLiquidacion.prdPreLiquidacionPK.plMotivo = contexto.motivoSeleccionado.prdPreLiquidacionMotivoPK.plmCodigo;
    contexto === LS.ACCION_CREAR ? prdPreLiquidacion.prdPreLiquidacionDetalleList = null : null;
    prdPreLiquidacion.plTotalMonto = this.utilService.convertirDecimaleFloat(contexto.total);

    //Formateando detalle
    detalleList.forEach(value => {
      value.prdPreLiquidacion = null;
      tipoProducto = value.prdProducto.prodTipo.toString().trim();
      cantidadProducto = value.detLibras;
      unidadMedida = value.prdTalla.tallaUnidadMedida;
      if (tipoProducto === "COLA") {
        if (value.prdTalla.tallaUnidadMedida === null || unidadMedida === 'LIBRAS') {
          sumatoriaCola = cantidadProducto + sumatoriaCola;
        } else {
          if (unidadMedida === 'KILOS')
            sumatoriaCola = cantidadProducto * 2.20462 + sumatoriaCola;
        }
      }
      if (tipoProducto === "CABEZA") {
        if (value.prdTalla.tallaUnidadMedida === null || unidadMedida === 'LIBRAS') {
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
    objetoEnviar.listaPrdPreLiquidacionDetalle = detalleList;
    objetoEnviar.prdPreLiquidacion = prdPreLiquidacion;

    return objetoEnviar;
  }


}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}