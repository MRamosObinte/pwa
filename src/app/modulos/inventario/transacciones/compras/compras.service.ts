import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputCellComponent } from './../../../componentes/input-cell/input-cell.component';
import { Injectable } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { InvComprasTO } from '../../../../entidadesTO/inventario/InvComprasTO';
import { InvListaConsultaCompraTO } from '../../../../entidadesTO/inventario/InvListaConsultaCompraTO';
import { InvProveedorTO } from '../../../../entidadesTO/inventario/InvProveedorTO';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { InvComprasPK } from '../../../../entidades/inventario/InvComprasPK';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }


  listarInvConsultaCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvConsultaCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvConsultaCompra(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvConsultaCompra([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  guardarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/guardarCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGuardarCompra(respuesta);
        } else {
          this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  modificarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarCompra(respuesta);
        } else {
          this.utilService.generarSwal(LS.TAG_COMPRA, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  consultarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/consultarCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeConsultarCompra(respuesta.extraInfo);
        } else {
          contexto.despuesDeConsultarCompra(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }


  anularCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/anularCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeAnularCompra(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  restaurarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/restaurarCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeRestaurarCompra(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  desmayorizarCompra(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/desmayorizarCompra", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeDesmayorizarCompra(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
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

  obtenerDocumentos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/documentos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDocumentos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosBasicosCompraNueva(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosBasicosCompraNueva", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosBasicosCompraNueva(respuesta.extraInfo);
        } else {
          contexto.despuesDeObtenerDatosBasicosCompraNueva(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  //Tabla
  generarColumnas(contexto) {
    let columnas = [];
    columnas.push(
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 40,
        minWidth: 40,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 100,
        minWidth: 90,
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.compStatus === LS.ETIQUETA_ANULADO) {
            return LS.ETIQUETA_ANULADO;
          }
          if (params.data.compStatus === LS.ETIQUETA_PENDIENTE) {
            return LS.ETIQUETA_PENDIENTE;
          }
          return '';
        },
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'compDocumentoNumero',
        width: 180,
        minWidth: 150,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'compFecha',
        width: 120,
        minWidth: 100,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'provRazonSocial',
        width: 250,
        minWidth: 250,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'compTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: 'text-right',
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'compFormaPago',
        width: 180,
        minWidth: 150,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'compObservaciones',
        width: 350,
        minWidth: 300,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'compNumero',
        width: 200,
        minWidth: 200,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'conContable',
        width: 200,
        minWidth: 200,
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: 'text-center',
        cellClassRules: { 'fila-pendiente': (params) => { return (params.data.compStatus === LS.ETIQUETA_PENDIENTE ? true : false) } },
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
        }
      }
    );
    return columnas;
  }

  generarColumnasDetalle(contexto) {
    let esEditable = contexto.accion === LS.ACCION_CREAR || contexto.accion === LS.ACCION_MAYORIZAR;

    let columnas = [];

    if (esEditable) {

    }
    columnas.push(
      {
        headerName: LS.TAG_BODEGA,
        field: 'bodCodigo',
        width: 100,
        minWidth: 50,
        cellClass: "cell-editing",
        cellClassRules: { "cell-with-errors": (params) => { return !this.validarBodega(params.data) } },
        suppressKeyboardEvent: (params) => {
          switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
            case LS.KEYCODE_ENTER:
            case LS.KEYCODE_TAB:
              contexto.buscarBodega(params);
              if (params.editing) { return true }
              break;
            case LS.KEYCODE_DOWN:
            case LS.KEYCODE_UP:
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listInvComprasDetalleTO) }
              break;
            default:
              return true;
          }
        },
        editable: (params) => {
          return contexto.accion !== LS.ACCION_MAYORIZAR ? esEditable : esEditable && params.data.detPendiente;
        },
        valueGetter: (params) => { return params.data.bodCodigo },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'bodCodigo',
          maxlength: 50,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      },
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'proCodigoPrincipal',
        width: 120,
        minWidth: 100,
        cellClass: "cell-editing",
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !this.validarProducto(params.data);
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
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listInvComprasDetalleTO) }
              break;
            default:
              return true;
          }
        },
        editable: (params) => {
          return contexto.accion !== LS.ACCION_MAYORIZAR ? esEditable : esEditable && params.data.detPendiente;
        },
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
        headerName: LS.TAG_NOMBRE,
        field: 'nombreProducto',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_CANTIDAD,
        field: 'detCantidad',
        width: 100,
        minWidth: 100,
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listInvComprasDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: (params) => {
          return contexto.accion !== LS.ACCION_MAYORIZAR ? params.data.proCodigoPrincipal && esEditable : esEditable && params.data.detPendiente;
        },
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
            name: 'detCantidad',
            id: "detCantidadRender",
            habilitarBtn: contexto.accion !== LS.ACCION_MAYORIZAR ?
              (params.data.proCodigoPrincipal && esEditable) :
              (esEditable && params.data.detPendiente)
          }
        },
        cellEditor: 'inputNumeric',
        cellEditorParams: {
          name: 'detCantidad',
          idRender: 'detCantidadRender',
          id: "detCantidad",
          maxlength: 13,
          placeholder: '0.00',
          configAutonumeric: contexto.configAutonumeric,
          title: LS.MSJ_ACCION_CANTIDADES,
          clase: LS.ICON_CALCULADORA
        }
      },
      {
        headerName: LS.TAG_UNIDAD_MEDIDA,
        field: 'medidaDetalle',
        width: 180,
        minWidth: 150,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_UNIDAD_MEDIDA,
          text: LS.TAG_UN_MEDIDA,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_PRECIO,
        field: 'detPrecio',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: numberFormatter
      },
      {
        headerName: LS.TAG_ESTADO,
        field: 'proEstadoIva',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueGetter: (params) => { return (params.data.proEstadoIva === 'GRAVA' ? contexto.invCompraTO.compIvaVigente + '%' : '0%') }
      },
      {
        headerName: LS.TAG_PARCIAL,
        field: 'parcialProducto',
        width: 100,
        minWidth: 100,
        cellClass: "cell-editing text-right",
        cellClassRules: {
          "cell-with-errors": (params) => {
            return params.data.proCodigoPrincipal && !this.validarParcial(params.data);
          }
        },
        valueFormatter: numberFormatter,
        valueGetter: (params) => { return (!params.node.rowPinned ? params.data.parcialProducto : '') },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'parcialProducto', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.event.keyCode === LS.KEYCODE_TAB) {
            params.event.srcElement.blur()
          }
          contexto.agregarFilaAlFinal(params);
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listInvComprasDetalleTO) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: (params) => {
          return contexto.accion !== LS.ACCION_MAYORIZAR ? esEditable : esEditable && params.data.detPendiente;
        }
      }
    );

    if (contexto.accion !== LS.ACCION_CREAR) {
      columnas.push(
        {
          headerName: LS.TAG_PENDIENTE,
          headerClass: 'text-md-center',//Clase a nivel de th
          field: 'detPendiente',
          width: 115,
          minWidth: 115,
          cellRendererFramework: InputEstadoComponent,
          cellClass: 'text-md-center'
        })
    }
    columnas.push(this.utilService.getColumnaOpciones());

    return columnas;
  }

  //Permiso
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

  obtenerAutonumeric() {
    return {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '9999999999.999999',
      minimumValue: '0'
    }
  }

  //Validaciones
  validarNumero(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/validarNumero", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeValidarNumero(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_INFORMACION);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  convertirInvCompraEnInvListaConsultaCompraTO(invCompraTO: InvComprasTO, consultaCompra, proveedor: InvProveedorTO) {
    let compra: InvListaConsultaCompraTO = { ...consultaCompra };
    compra.compTotal = invCompraTO.compTotal;
    compra.compStatus = invCompraTO.compAnulado ? LS.ETIQUETA_ANULADO : (invCompraTO.compPendiente ? LS.ETIQUETA_PENDIENTE : " ");
    compra.compObservaciones = invCompraTO.compObservaciones;
    compra.compFecha = invCompraTO.compFecha;
    compra.compDocumentoNumero = invCompraTO.compDocumentoNumero;
    compra.compFormaPago = invCompraTO.compFormaPago;
    compra.provCodigo = proveedor.provCodigo;
    compra.provRazonSocial = proveedor.provRazonSocial;
    return compra;
  }

  validarProducto(data): boolean {
    return data.proCodigoPrincipal ? true : false;
  }

  validarBodega(data): boolean {
    return data.bodCodigo ? true : false;
  }

  validarCantidad(data): boolean {
    let cantidad = data.detCantidad ? data.detCantidad.toString().replace(/,/gi, "") : 0;
    return cantidad && cantidad >= 0.01;
  }

  validarParcial(data): boolean {
    let parcialProducto = data.parcialProducto ? data.parcialProducto.toString().replace(/,/gi, "") : 0;
    return parcialProducto && parcialProducto >= 0.01;
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

  algunaFilaPendienteOAnulada(listado: Array<InvListaConsultaCompraTO>, empresa: string) {
    let respuesta = { isPendienteAnulado: false, listadoPk: [] };

    for (let item of listado) {
      if (item.compStatus === LS.ETIQUETA_PENDIENTE || item.compStatus === LS.ETIQUETA_ANULADO) {
        respuesta.isPendienteAnulado = true;
        break;
      }
      if (item.compNumero) {
        let pk = new InvComprasPK({
          compEmpresa: empresa,
          compPeriodo: item.compNumero.split('|')[0],
          compMotivo: item.compNumero.split('|')[1],
          compNumero: item.compNumero.split('|')[2]
        });
        respuesta.listadoPk.push(pk)
      }
    }
    return respuesta;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}


