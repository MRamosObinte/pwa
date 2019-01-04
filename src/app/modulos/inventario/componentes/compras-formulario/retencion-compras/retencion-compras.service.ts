import { Injectable } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../../serviciosgenerales/api-request.service';
import { DecimalPipe } from '@angular/common';
import { InputCellComponent } from '../../../../componentes/input-cell/input-cell.component';
import { NumericCellComponent } from '../../../../componentes/numeric-cell/numeric-cell.component';
import { SelectCellAtributoComponent } from '../../../../componentes/select-cell-atributo/select-cell-atributo.component';
import { AnxTipoComprobanteComboTO } from '../../../../../entidadesTO/anexos/AnxTipoComprobanteComboTO';
import { MaskCalendarComponent } from '../../../../componentes/mask-calendar/mask-calendar.component';
import * as moment from 'moment';
import { SoloNumerosComponent } from '../../../../componentes/solo-numeros/solo-numeros.component';
import { NumeracionComponent } from '../../../../componentes/numeracion/numeracion.component';

@Injectable({
  providedIn: 'root'
})
export class RetencionComprasService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarAnexoFormaPagoTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnexoFormaPagoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnexoFormaPagoTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  listarAnxConcepto(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getListaAnxConceptoComboTO2", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarAnxConcepto(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  comprobarRetencionAutorizadaProcesamiento(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/comprobarRetencionAutorizadaProcesamiento", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeComprobarRetencionAutorizadaProcesamiento(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  validarSecuenciaPermitida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/validarSecuenciaPermitida", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarSecuenciaPermitida(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerAutorizacionNCND(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/obtenerAutorizacionNCND", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {//Se puede usar
          contexto.despuesDeObtenerAutorizacionNCND(false);
        } else {
          contexto.despuesDeObtenerAutorizacionNCND(true);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerUltimaAutorizacionFactura(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getAnxUltimaAutorizacionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerUltimaAutorizacionFactura(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
  }

  obtenerAutorizacionRetencion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/anexosWebController/getNumeroAutorizacion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerAutorizacionRetencion(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
  }

  obtenerDatosBasicosRetencionNueva(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosBasicosRetencionNueva", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosBasicosRetencionNueva(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
  }

  obtenerDatosBasicosRetencionCreada(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosBasicosRetencionCreada", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosBasicosRetencionCreada(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
  }

  consultarRetencionCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/consultarRetencionCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeConsultarRetencionCompra(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
          contexto.enviarAccion.emit({ accion: LS.ACCION_CANCELAR })
        }
      })
  }

  validarFechaDiasHabiles(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/isFechaDentroDeDiasHabiles", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarFechaDiasHabiles(respuesta.extraInfo);
        } else {
          contexto.despuesDeValidarFechaDiasHabiles(false);
          this.toastr.warning("Fecha incorrecta", 'Aviso');
          contexto.cargando = false;
        }
      })
  }

  validarFechasDeRetencionYComprasMismoMes(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarFechasDeRetencionYComprasMismoMes", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarFechasDeRetencionYComprasMismoMes(respuesta.extraInfo);
        } else {
          contexto.despuesDeValidarFechasDeRetencionYComprasMismoMes(false);
          this.toastr.warning("La fecha de la COMPRA y la fecha de RETENCIÓN tienen que estar en el mismo mes Calendario, por favor, corrija...", 'Aviso');
          contexto.cargando = false;
        }
      })
  }

  validarRetencionCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarRetencionCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarRetencionCompra();
        } else {
          this.utilService.generarSwal(LS.TAG_RETENCION, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
  }

  validarRetencionDesdeCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarRetencionDesdeCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarRetencionDesdeCompra();
        } else {
          this.utilService.generarSwal(LS.TAG_RETENCION, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
  }

  enviarSRIRetencionEnProcesamiento(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/enviarSRIRetencionEnProcesamiento", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeEnviarSRIRetencionEnProcesamiento(respuesta.operacionMensaje);
        } else {
          this.utilService.generarSwal(LS.TAG_RETENCION, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
  }

  validarFechaRetencion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarFechaRetencion", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeValidarFechaRetencion(respuesta.operacionMensaje);
        } else {
          this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
  }

  obtenerAutonumeric() {
    return {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '99999999999.99',
      minimumValue: '0',
    }
  }

  verificarPermiso(accion, contexto, mostrarMensaje?): boolean {
    let permiso = false;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruMayorizarCompras;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarCompras;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruAnularCompras;
        break;
      }
      case LS.ACCION_RESTAURAR: {
        permiso = contexto.empresaSeleccionada.listaSisPermisoTO.gruAnularCompras;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO)
    }
    return permiso;
  }

  generarColumnasDetalle(contexto) {
    let esEditable = contexto.accion === LS.ACCION_CREAR ||
      contexto.accion === LS.ACCION_CREADO ||
      (contexto.accion === LS.ACCION_MAYORIZAR && !contexto.comprobarRetencionAutorizadaProcesamiento);
    let columnas = [];
    columnas.push(
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'detConcepto',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        cellClassRules: { "cell-with-errors": (params) => { return !this.validarConcepto(params.data) } },
        suppressKeyboardEvent: (params) => {
          switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
            case LS.KEYCODE_ENTER:
            case LS.KEYCODE_TAB:
              contexto.buscarConcepto(params);
              if (params.editing) { return true }
              break;
            case LS.KEYCODE_DOWN:
            case LS.KEYCODE_UP:
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraDetalleTO) }
              break;
            default:
              return true;
          }
        },
        valueGetter: (params) => { return params.data.detConcepto },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'detConcepto',
          maxlength: 50,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'nombreConcepto',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'detPorcentaje',
        cellClass: 'text-right',
        valueFormatter: numberFormatter,
        width: 100,
        minWidth: 100,
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'detBase0',
        cellClass: 'text-right',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.detBase0 : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detBase0', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'detBaseImponible',
        cellClass: 'text-right',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.detBaseImponible : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detBaseImponible', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_BASE_NG,
        field: 'detBaseNoObjetoIva',
        cellClass: 'text-right',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.detBaseNoObjetoIva : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'detBaseNoObjetoIva', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'detValorRetenido',
        cellClass: 'text-right',
        valueFormatter: numberFormatter,
        width: 150,
        minWidth: 150,
      }
    );

    if (esEditable) {
      columnas.push(this.utilService.getColumnaOpciones());
    }
    return columnas;
  }

  generarColumnasReembolsoDetalle(contexto) {
    let esEditable = contexto.accion === LS.ACCION_CREAR || contexto.accion === LS.ACCION_CREADO || contexto.accion === LS.ACCION_MAYORIZAR;
    let columnas = [];
    columnas.push(
      {
        headerName: LS.TAG_PROVEEDOR,
        field: 'provCodigo',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        cellClass: '',
        cellClassRules: { "cell-with-errors": (params) => { return !this.validarProveedor(params.data) } },
        suppressKeyboardEvent: (params) => {
          switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
            case LS.KEYCODE_ENTER:
            case LS.KEYCODE_TAB:
              contexto.buscarProveedor(params);
              if (params.editing) { return true }
              break;
            case LS.KEYCODE_DOWN:
            case LS.KEYCODE_UP:
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) }
              break;
            default:
              return true;
          }
        },
        valueGetter: (params) => { return params.data.provCodigo },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'provCodigo',
          maxlength: 50,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'auxProvRazonSocial',
        width: 100,
        minWidth: 200,
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'reembDocumentoTipo',
        width: 140,
        minWidth: 140,
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        cellClass: '',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.reembDocumentoTipo;
          }
        },
        editable: esEditable,
        cellEditorFramework: SelectCellAtributoComponent,
        cellEditorParams: function (params) {
          return {
            value: contexto.listaDocumentosReembolso ? params.data.reembDocumentoTipo : null,
            name: 'tcCodigo',
            atributo: 'tcCodigo',
            obligatorio: true,
            listValues: contexto.listaDocumentosReembolso ? contexto.listaDocumentosReembolso : [],
            fieldsShow: ['tcDescripcion']
          };
        },
        valueFormatter: function (params) {
          let listaDocumentosReembolso: Array<AnxTipoComprobanteComboTO> = contexto.listaDocumentosReembolso;
          if (listaDocumentosReembolso && listaDocumentosReembolso.length > 0) {
            let doc: AnxTipoComprobanteComboTO;
            doc = listaDocumentosReembolso.find(item => item.tcCodigo == params.data.reembDocumentoTipo);
            return doc ? doc.tcDescripcion : params.data.reembDocumentoTipo;
          }
        }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'reembDocumentoNumero',
        width: 180,
        minWidth: 120,
        cellClass: '',
        editable: esEditable,
        cellEditorFramework: NumeracionComponent,
        cellEditorParams: function () {
          return {
            name: 'reembDocumentoNumero',
            obligatorio: true
          };
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !this.validarNumeroDocumento(params.data);
          }
        },
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'reembFechaemision',
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: '',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.reembFechaemision || !this.validarFecha(params.data, contexto.fechaActual);
          }
        },
        width: 120,
        minWidth: 120,
        editable: esEditable,
        cellEditorFramework: MaskCalendarComponent,
        cellEditorParams: { name: 'fecha', minDate: new Date(), conGuiones: true }
      },
      {
        headerName: LS.TAG_AUTORIZACION,
        field: 'reembAutorizacion',
        width: 150,
        minWidth: 150,
        cellClass: '',
        editable: esEditable,
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !this.validarNumeroAutorizacion(params.data);
          }
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: SoloNumerosComponent,
        cellEditorParams: { name: 'reembAutorizacion', maxlength: 49, inputClass: 'text-uppercase', placeholder: '' }
      },
      {
        headerName: LS.TAG_BASE_0,
        field: 'reembBaseimponible',
        cellClass: 'text-right ',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.reembBaseimponible : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'reembBaseimponible', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'reembBaseimpgrav',
        cellClass: 'text-right ',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.reembBaseimpgrav : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'reembBaseimpgrav', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_BASE_NG,
        field: 'reembBasenograiva',
        cellClass: 'text-right ',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.reembBasenograiva : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'reembBasenograiva', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_MONTO_ICE,
        field: 'reembMontoice',
        cellClass: 'text-right ',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.reembMontoice : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'reembMontoice', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      },
      {
        headerName: LS.TAG_MONTO_IVA,
        field: 'reembMontoiva',
        cellClass: 'text-right ',
        width: 100,
        minWidth: 100,
        editable: esEditable,
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.reembMontoiva : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'reembMontoiva', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listAnxCompraReembolsoTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        }
      }
    );
    if (esEditable) {
      columnas.push(this.utilService.getColumnaOpciones('reembolso'))
    }
    return columnas;
  }

  validarFecha(data, fechaLimite: string): boolean {
    if (data.reembFechaemision && fechaLimite) {
      let date: Date = moment(data.reembFechaemision, 'DD/MM/YYYY').toDate();
      let fechaLim: Date = moment(fechaLimite, 'DD/MM/YYYY').toDate();
      if (date.getTime() < fechaLim.getTime()) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  validarNumeroDocumento(data): boolean {
    if (data.reembDocumentoNumero) {
      let part1 = data.reembDocumentoNumero.substring(3, 0);
      let part2 = data.reembDocumentoNumero.substring(7, 4);
      let part3 = data.reembDocumentoNumero.substring(17, 8);
      return (part1 !== '000' && part2 !== '000' && part3 !== '000000000') ? true : false;
    } else {
      return false;
    }
  }

  validarNumeroAutorizacion(data): boolean {
    return (data.reembAutorizacion && (data.reembAutorizacion.length === 10 || data.reembAutorizacion.length === 37 || data.reembAutorizacion.length === 49)) ? true : false;
  };

  validarConcepto(data): boolean {
    return data.detConcepto ? true : false;
  }

  validarProveedor(data): boolean {
    return data.provCodigo ? true : false;
  }

  focusedProveedor(index, gridApi) {
    if (gridApi) {
      gridApi.setFocusedCell(index, "provCodigo");
      gridApi.startEditingCell({ rowIndex: index, colKey: "provCodigo" });
      gridApi.ensureIndexVisible(index + 1);
    }
  }

  focusedConcepto(index, gridApi) {
    if (gridApi) {
      gridApi.setFocusedCell(index, "detConcepto");
      gridApi.startEditingCell({ rowIndex: index, colKey: "detConcepto" });
      gridApi.ensureIndexVisible(index + 1);
    }
  }

  base0FocusAndEditingCell(index, gridApi) {
    if (gridApi) {
      gridApi.setFocusedCell(index, "detBase0");
      gridApi.startEditingCell({ rowIndex: index, colKey: "detBase0" });
      gridApi.ensureIndexVisible(index + 1);
    }
  }

  base0ReembolsoFocusAndEditingCell(index, gridApi) {
    if (gridApi) {
      gridApi.setFocusedCell(index, "reembBaseimponible");
      gridApi.startEditingCell({ rowIndex: index, colKey: "reembBaseimponible" });
      gridApi.ensureIndexVisible(index + 1);
    }
  }

}


function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}