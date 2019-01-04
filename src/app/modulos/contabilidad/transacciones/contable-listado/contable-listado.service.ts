import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { ListaConContableTO } from '../../../../entidadesTO/contabilidad/ListaConContableTO';
import { Mensaje } from '../../../../enums/Mensaje';
import { DecimalPipe, DatePipe } from '@angular/common';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';

@Injectable({
  providedIn: 'root'
})
export class ContableListadoService {
  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService
  ) { }

  listarContables(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getListConContableTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarContables(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarContables(null);
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosParaCrudContable(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/obtenerDatosParaCrudContable", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudContable(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  desmayorizarListaConContable(parametro, contexto, empresaSelect): Promise<any> {
    return this.api.post("todocompuWS/contabilidadWebController/desmayorizarListaConContable", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta.estadoOperacion) {
          return respuesta;
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          return {};
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  getConContablePKDeListaConContableTO(listarContables: Array<ListaConContableTO>): Array<ConContablePK> {
    let listaConContablePK = Array();
    for (let contableTO of listarContables) {
      let conContablePK = new ConContablePK();
      conContablePK.conEmpresa = contableTO.empCodigo;
      conContablePK.conNumero = contableTO.conNumero;
      conContablePK.conPeriodo = contableTO.perCodigo;
      conContablePK.conTipo = contableTO.tipCodigo;
      listaConContablePK.push(conContablePK);
    }
    return listaConContablePK;
  }

  formatearMensajesDesmayorizar(listaRespuesta, contexto): Array<Mensaje> {
    let listaMensajes = new Array();
    let listaContable = [...contexto.listadoResultado];
    for (let respuesta of listaRespuesta) {
      switch (respuesta.estadoOperacion) {
        case LS.KEY_EXITO: {
          let mensaje = new Mensaje();
          mensaje.icono = LS.ICON_OK_SWAL;
          mensaje.texto = respuesta.operacionMensaje;
          mensaje.tipo = 'success';
          let indexOf = listaContable.findIndex(item => item.conNumero === respuesta.extraInfo.conContablePK.conNumero);
          listaContable[indexOf].conStatus = LS.ETIQUETA_PENDIENTE;
          listaMensajes.push(mensaje);
          break;
        }
        case LS.KEY_ADVERTENCIA: {
          let mensaje = new Mensaje();
          mensaje.icono = LS.ICON_ERROR_SWAL;
          mensaje.texto = respuesta.operacionMensaje;
          mensaje.tipo = 'danger';
          listaMensajes.push(mensaje);
          break;
        }
      }
    }
    contexto.listaResultado = listaContable;
    return listaMensajes;
  }

  generarColumnasContableListado(contexto): Array<any> {
    let columnas = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 35,
        minWidth: 30
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-sm-center',
        field: 'conStatus',
        width: 65,
        minWidth: 65,
        cellClass: 'text-center',
        cellRenderer: 'iconoEstado'
      },
    );
    //Periodo seleccionado
    if (!contexto.periodoSeleccionado) {
      columnas.push({
        headerName: LS.TAG_PERIODO,
        field: 'perCodigo',
        width: 65,
        minWidth: 65
      })
    }
    //tipo seleccionado
    if (!contexto.tipoSeleccionado) {
      columnas.push({
        headerName: LS.TAG_TIPO,
        field: 'tipCodigo',
        width: 65,
        minWidth: 65
      })
    }
    columnas.push(
      {
        headerName: LS.TAG_NUMERO,
        field: 'conNumero',
        width: 65,
        minWidth: 65
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'conFecha',
        width: 65,
        minWidth: 65,
        valueFormatter: this.formatearFecha,
      },
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'conConcepto',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'conDetalle',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'conObservaciones',
        width: 220,
        minWidth: 200
      },
      this.utilService.getColumnaOpciones()
    )

    return columnas;
  }

  formatearFecha(params) {
    return new DatePipe('en-US').transform(params.value, 'yyyy-MM-dd');
  }

  generarColumnas(contexto) {
    let esEditable = contexto.data.accion === LS.ACCION_NUEVO || contexto.data.accion === LS.ACCION_MAYORIZAR ? true : false;
    let columnas: Array<any> = []
    if (esEditable) {
      columnas.push({
        headerName: LS.TAG_MOVER_FILA,
        headerClass: 'cell-header-center',
        cellClass: 'text-center',
        width: 40,
        minWidth: 40,
        cellClassRules: { "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) } },
        rowDrag: esEditable,
        pinnedRowCellRenderer: PinnedCellComponent,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: LS.ICON_MOVER_FILA, tooltip: LS.TAG_MOVER_FILA, text: '', enableSorting: false }
      });
    }
    columnas.push(
      {
        headerName: LS.TAG_CUENTA,
        field: 'ctaCodigo',
        width: 100,
        minWidth: 100,
        cellClassRules: {
          "cell-with-errors": (params) => { return (params.data.conCuentaVacia && !params.node.rowPinned) ? true : false },
          "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) }
        },
        editable: (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado || !esEditable) ? false : true) },
        suppressKeyboardEvent: (params) => {
          if (params.event.keyCode !== LS.KEYCODE_UP && params.event.keyCode !== LS.KEYCODE_DOWN) {
            !params.node.rowPinned ? contexto.buscarConCuentas(params) : null;
            if (params.editing) { return true; }
          } else {
            if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaFiltrado) }
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: { name: 'ctaCodigo', maxlength: 50, inputClass: 'text-uppercase', placeholder: '' },
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'ctaDetalle',
        width: 150,
        minWidth: 150,
        cellClassRules: { "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) } },
        pinnedRowCellRendererFramework: PinnedCellComponent,
        pinnedRowCellRendererParams: { value: "Diferencia: ", style: { "font-weight": "bold" } }
      },
      {
        headerName: LS.TAG_CP,
        field: 'sectorSeleccionado',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', tooltip: LS.TAG_CENTRO_PRODUCCION, text: LS.TAG_CP },
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var sectorSeleccionado = params.data.sectorSeleccionado;
          return {
            value: sectorSeleccionado,
            name: 'sectorSeleccionado',
            obligatorio: true,
            ejecutarMetodoChange: true,
            listValues: contexto.listaSectores,
            fieldsShow: ['secNombre', 'secCodigo']
          }
        },
        editable: (params) => { if (params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado || !esEditable) { return false; } return true },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.totalesDiferencia : params.data.sectorSeleccionado.secCodigo) },
        valueFormatter: function (params) { return (params.node.rowPinned ? new DecimalPipe('en-US').transform(params.value, '1.2-2') : params.data.sectorSeleccionado.secCodigo) },
        cellClassRules: {
          "text-sm-right": (params) => { return (params.node.rowPinned ? true : false) },
          "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) }
        }
      },
      {
        headerName: LS.TAG_CC,
        field: 'piscinaSeleccionada',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', tooltip: LS.TAG_CENTRO_COSTO, text: LS.TAG_CC },
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var piscinaSeleccionada = params.data.piscinaSeleccionada ? params.data.piscinaSeleccionada : [];
          return {
            value: piscinaSeleccionada,
            name: 'piscinaSeleccionada',
            obligatorio: false,
            ejecutarMetodoChange: false,
            listValues: (params.data && params.data.listapiscinaSeleccionada) ? params.data.listapiscinaSeleccionada : [],
            fieldsShow: ['pisNombre', 'pisNumero']
          };
        },
        editable: (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado || !esEditable) ? false : true) },
        valueFormatter: function (params) { return ((params.data.piscinaSeleccionada && params.data.piscinaSeleccionada.pisNumero) ? params.data.piscinaSeleccionada.pisNumero : '') },
        cellClassRules: { "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) } }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'detDocumento',
        width: 180,
        minWidth: 180,
        cellClassRules: {
          "cell-with-errors": (params) => { return ((params.data.conChequeImprimir || params.data.conChequeRepetido) && !params.node.rowPinned ? true : false) },
          "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: { name: 'detDocumento', maxlength: 100, inputClass: 'text-uppercase', placeholder: '' },
        editable: (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado || !esEditable) ? false : true) },
        suppressKeyboardEvent: (params) => {
          if (params.event.keyCode !== LS.KEYCODE_UP && params.event.keyCode !== LS.KEYCODE_DOWN) {
            !params.node.rowPinned ? contexto.validarFilaCompleta(params) : null;
            if (params.editing) { return this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode) }
          } else {
            if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaFiltrado) }
          }
        },
        pinnedRowCellRendererFramework: PinnedCellComponent,
        pinnedRowCellRendererParams: { value: "Total: ", style: { "font-weight": "bold" } }
      },
      {
        headerName: LS.TAG_DEBITOS,
        field: 'detDebitos',
        width: 120,
        minWidth: 120,
        cellClass: "text-right",
        cellClassRules: {
          "cell-with-errors": (params) => { return ((!params.data.conEstadoDebitoCreditoValido && !params.node.rowPinned) ? true : false) },
          "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) }
        },
        valueFormatter: this.formatearA2Decimales,
        valueGetter: (params) => { return (params.node.rowPinned ? (contexto.totalesDebitos ? contexto.totalesDebitos : 0) : params.data.detDebitos) },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detDebitos', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configuracionAutoNumeric },
        editable: (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado || !esEditable) ? false : true) },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaFiltrado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
      },
      {
        headerName: LS.TAG_CREDITOS,
        field: 'detCreditos',
        width: 120,
        minWidth: 120,
        cellClass: 'text-right',
        cellClassRules: {
          "cell-with-errors": (params) => { return (!params.data.conEstadoDebitoCreditoValido && !params.node.rowPinned ? true : false) },
          "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) }
        },
        valueFormatter: this.formatearA2Decimales,
        valueGetter: (params) => { return (params.node.rowPinned ? (contexto.totalesCreditos ? contexto.totalesCreditos : 0) : params.data.detCreditos) },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detCreditos', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configuracionAutoNumeric },
        editable: (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado || !esEditable) ? false : true) },
        suppressKeyboardEvent: (params) => {
          if (!params.node.rowPinned) {
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaFiltrado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
            contexto.validarFilaCompleta(params);
          }
        }
      }
    )
    if (esEditable) {
      columnas.push(
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',
          cellClass: 'text-center',
          width: LS.WIDTH_OPCIONES,
          minWidth: LS.WIDTH_OPCIONES,
          cellRendererFramework: BotonOpcionesComponent,
          headerComponentFramework: TooltipReaderComponent,
          cellClassRules: { "cell-block": (params) => { return ((params.node.rowPinned || contexto.data.accion === LS.ACCION_CONSULTAR || params.data.detGenerado) ? false : true) } },
          headerComponentParams: { class: LS.ICON_OPCIONES, tooltip: LS.TAG_OPCIONES, text: '', enableSorting: false },
          pinnedRowCellRenderer: PinnedCellComponent,
        }
      );
    }

    return columnas;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  verificarChequeImprimir(itemEvaluar, contexto) {
    let parametros = { ConListaContableDetalleTO: itemEvaluar, empresa: LS.KEY_EMPRESA_SELECT };
    this.api.post("todocompuWS/contabilidadWebController/validarChequeContable", parametros, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        contexto.despuesDeVerificarChequeImprimir(respuesta.extraInfo, itemEvaluar);
      }).catch(err => this.utilService.handleError(err, this));
  }

  // el extraInfo retorna si el documento ya existe o no
  verificarDocumentoBanco(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/verificarDocumentoBanco", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeVerificarDocumento(data.extraInfo, parametro.data);
        } else {
          contexto.despuesDeVerificarDocumento(false, parametro.data);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  verificarPermisoFORMULARIO(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_NUEVO: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruMayorizarContables;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarContables;
        break;
      }
      case LS.ACCION_RESTAURAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
        break;
      }
      case LS.ACCION_REVERSAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
        break;
      }
      case LS.ACCION_DESBLOQUEAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruAnularContables;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = contexto.data.empresaSeleccionada.listaSisPermisoTO.gruEliminarContablesTalentoHumano;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
      contexto.cargando = false;
    }
    return permiso;
  }

  eliminarConContable(contexto, parametros) {
    this.api.post("todocompuWS/contabilidadWebController/eliminarConContable", parametros, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeEliminarConContable(respuesta);
        } else {
          this.utilService.generarSwal(LS.TOAST_ERROR, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  mayorizarContable(contexto, parametros) {
    this.api.post("todocompuWS/contabilidadWebController/modificarContable", parametros, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeMayorizarContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargandoEstado.emit(false);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  desmayorizarContable(contexto, pk) {
    this.api.post("todocompuWS/contabilidadWebController/desmayorizarConContable", pk, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeDesmayorizarContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cerrarDefinitivo(null);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  restaurarContable(contexto, pk) {
    this.api.post("todocompuWS/contabilidadWebController/restaurarConContable", pk, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeRestaurarContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cerrarDefinitivo(null);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  desbloquerContable(contexto, enviarObjeto) {
    this.api.post("todocompuWS/contabilidadWebController/desbloquearConContable", enviarObjeto, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeDesbloquerContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cerrarDefinitivo(null);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  anularReversarContable(contexto, parametros) {
    let parametro = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: parametros.anularReversar ? LS.MSJ_PREGUNTA_ANULAR_CONTABLE : LS.MSJ_PREGUNTA_REVERSAR_CONTABLE, //anularReversar?anular:reversar
      type: LS.SWAL_WARNING,
      confirmButtonText: parametros.anularReversar ? LS.MSJ_SI_ANULAR : LS.MSJ_SI_REVERSAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametro).then(respuesta => {
      if (respuesta) {
        this.api.post("todocompuWS/contabilidadWebController/anularReversarConContable", parametros, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
              contexto.despuesDeAnularReversarContable(respuesta);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              contexto.cerrarDefinitivo(null);
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        contexto.cerrarDefinitivo(null);
      }
    });
  }

  insertarContable(contexto, parametros) {
    this.api.post("todocompuWS/contabilidadWebController/insertarContable", parametros, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeInsertarContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargandoEstado.emit(false);
        }
      }).catch(err => this.utilService.handleError(err, this));
  }
}


