import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';
import { InvTransferenciasTO } from '../../../../entidadesTO/inventario/InvTransferenciasTO';
import { InvTransferenciaTO } from '../../../../entidadesTO/inventario/InvTransferenciaTO';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InvTransferenciasPK } from '../../../../entidades/inventario/InvTransferenciasPK';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';

@Injectable({
  providedIn: 'root'
})
export class TransferenciasService {

  constructor(
    public api: ApiRequestService,
    private utilService: UtilService,
    public toastr: ToastrService,
    private archivoService: ArchivoService,
  ) { }

  listarTransferencias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvConsultaTransferencias", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarTransferencia(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarTransferencia(null);
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosParaTransferenciaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosParaTransferencia", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarDatosTransferenciaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarDatosTransferenciaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarInvTransferenciaTO(parametro, contexto, empresaSelect, estado) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvTransferenciaTO", parametro, empresaSelect)
      .then(respuesta => {
        contexto.cargando = false;
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeInsertarTransferencia(respuesta, estado);
        } else {
          this.utilService.generarSwal(LS.TAG_TRANSFERENCIA, LS.SWAL_ERROR, respuesta.operacionMensaje + " " + respuesta.extraInfo.listaErrores1);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  obtenerObjetoItemListaTransferenciaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/consultaTransferencia", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeConsultarTransferencia(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  desmayorizarTransferencias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/desmayorizarTransferencia", parametro, empresaSelect)
      .then(data => {
        if (data && data.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeDesmayorizarTransferencia(data);
        } else {
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  desmayorizarTransferenciaPorLote(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/desmayorizarTransferenciaPorLote", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeDesmayorizarPorLote(respuesta);
        } else {
          this.utilService.generarSwal(LS.ACCION_DESMAYORIZAR + " " + LS.TAG_TRANSFERENCIA, LS.SWAL_ERROR, respuesta.operacionMensaje);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  anularTransferencias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/anularTransferencia", parametro, empresaSelect)
      .then(data => {
        if (data && data.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeAnularTransferencia(data);
        } else {
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  restaurarTransferencias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/restaurarTransferencia", parametro, empresaSelect)
      .then(data => {
        if (data && data.estadoOperacion === LS.KEY_EXITO) {
          contexto.data.vistaFormulario = false;
          contexto.despuesDeRestaurarTransferencia(data);
        } else {
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  modificarInvTransferenciasTO(parametro, contexto, empresaSelect, estado) {
    this.api.post("todocompuWS/inventarioWebController/modificarInvTransferenciasTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeModificarTransferencia(respuesta, estado);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, this));
  }

  imprimirTransferencia(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteTrasferencias", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('transferencia' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirTransferenciaPorLote(parametro, contexto, empresaSelect) {
    this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReportePorLoteTrasferencias", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('transferencia' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  construirObjetoParaPonerloEnLaLista(transferencia: InvTransferenciasTO): InvTransferenciaTO {
    let objeto: InvTransferenciaTO = new InvTransferenciaTO();
    objeto.transNumero = transferencia.invTransferenciasPK.transPeriodo + '|' + transferencia.invTransferenciasPK.transMotivo + '|' + transferencia.invTransferenciasPK.transNumero;
    if (transferencia.transAnulado) {
      objeto.transStatus = "ANULADO";
    } else if (transferencia.transPendiente) {
      objeto.transStatus = "PENDIENTE";
    } else {
      objeto.transStatus = "";
    }
    objeto.transObservaciones = transferencia.transObservaciones;
    objeto.transFecha = transferencia.transFecha;
    return objeto;
  }

  construirObjetoParaPonerloEnLaListaAnularRestaurar(transferencia: InvTransferenciasTO): InvTransferenciaTO {
    let objeto: InvTransferenciaTO = new InvTransferenciaTO();
    objeto.transNumero = transferencia.transPeriodo + '|' + transferencia.transMotivo + '|' + transferencia.transNumero;
    if (transferencia.transAnulado) {
      objeto.transStatus = "ANULADO";
    } else if (transferencia.transPendiente) {
      objeto.transStatus = "PENDIENTE";
    } else {
      objeto.transStatus = "";
    }
    objeto.transObservaciones = transferencia.transObservaciones;
    objeto.transFecha = transferencia.transFecha;
    return objeto;
  }

  getTransferenciasPKDeListaConContableTO(listarTransferencias: Array<InvTransferenciaTO>): Array<String> {
    let listaTransferenciaPK = Array();
    let transferenciaPK = new InvTransferenciasPK();
    for (let transferenciaTO of listarTransferencias) {
      transferenciaPK.transNumero = transferenciaTO.transNumero;
      listaTransferenciaPK.push(transferenciaPK.transNumero);
    }
    return listaTransferenciaPK;
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

  enfocarInput(id) {
    let element = document.getElementById(id);
    element ? element.focus() : null;
  }

  generarColumnas() {
    return [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 60,
        minWidth: 60
      },
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-sm-center',
        field: 'transStatus',
        width: 80,
        minWidth: 80,
        cellRendererFramework: IconoEstadoComponent,
        cellClass: 'text-center',
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'transFecha',
        width: 100,
        minWidth: 100,
        valueFormatter: this.formatearFecha,
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'transObservaciones',
        width: 600,
        minWidth: 100
      },
      {
        headerName: LS.TAG_NUMERO,
        field: 'transNumero',
        width: 150,
        minWidth: 150
      },
      this.utilService.getColumnaOpciones()
    ];
  }

  generarColumnasFormulario(contexto): Array<any> {
    let esEditable = contexto.data.accion === LS.ACCION_NUEVO || contexto.data.accion === LS.ACCION_MAYORIZAR || contexto.data.accion === LS.ACCION_DESMAYORIZAR ? true : false;
    let columnas: Array<any> = [];
    if (esEditable) {
      columnas.push(
        {
          headerName: LS.TAG_MOVER_FILA,
          headerClass: 'cell-header-center pr-0',
          cellClass: 'text-center cell-block',
          width: 35,
          minWidth: 35,
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
          cellClass: "cell-editing",
          cellClassRules: {
            "cell-with-errors": (params) => {
              return esEditable ? !this.validarProducto(params.data) : false;
            }
          },
          suppressKeyboardEvent: (params) => {
            if (params.event.keyCode !== LS.KEYCODE_UP && params.event.keyCode !== LS.KEYCODE_DOWN) {
              contexto.buscarProducto(params);
              if (params.editing) { return true; }
            } else {
              if (params.editing) { return this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvDetalleTran) }
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
          suppressKeyboardEvent: (params) => {
            switch (params.event.keyCode) {//elegir accion de acuerdo a la tecla presionada
              case LS.KEYCODE_TAB:
                contexto.cantidadFocusAndEditingCell(params.node.rowIndex);
                break;
              case LS.KEYCODE_DOWN:
              case LS.KEYCODE_UP:
                this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvDetalleTran);
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
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidad',
          width: 120,
          minWidth: 120,
          valueFormatter: this.formatearA2Decimales,
          cellFocused: (params) => {
            contexto.gridApi ? contexto.startEditingCell({ rowIndex: params.node.rowIndex, colKey: 'detCantidad' }) : null;
          },
          suppressKeyboardEvent: (params) => {
            if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaInvDetalleTran) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
          },
          editable: (params) => { return params.data.proCodigoPrincipal },
          cellClass: 'text-right cell-editing p-0',
          cellClassRules: {
            "cell-with-errors": (params) => {
              return !this.validarCantidad(params.data);
            }
          },
          cellEditorFramework: NumericCellComponent,
          cellEditorParams: {
            name: 'cantidad',
            maxlength: 13,
            placeholder: '0.00',
            configAutonumeric: contexto.configAutonumeric
          }
        },
        {
          headerName: LS.TAG_MEDIDA,
          field: 'medDetalle',
          width: 150,
          minWidth: 150,
          cellClass: "cell-block",
          valueGetter: (params) => {
            return params.data.medDetalle;
          },
        },
      );
    } else {
      columnas.push(
        {
          headerName: LS.TAG_CODIGO,
          field: 'proCodigoPrincipal',
          width: 120,
          minWidth: 120,
        },
        {
          headerName: LS.TAG_DESCRIPCION,
          field: 'proNombre',
          width: 200,
          minWidth: 200,
        },
        {
          headerName: LS.TAG_CANTIDAD,
          field: 'detCantidad',
          width: 120,
          minWidth: 120,
          valueFormatter: this.formatearA2Decimales,
          cellClass: 'text-right'
        },
        {
          headerName: LS.TAG_MEDIDA,
          field: 'medDetalle',
          width: 150,
          minWidth: 150,
        },
      );
    }
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
          cellClassRules: { "cell-block": (params) => { return ((params.node.rowPinned || contexto.accion === LS.ACCION_CONSULTAR) ? false : true) } },
          headerComponentParams: { class: LS.ICON_OPCIONES, tooltip: LS.TAG_OPCIONES, text: '', enableSorting: false },
          pinnedRowCellRenderer: PinnedCellComponent,
        }
      );
    }
    return columnas;
  }

  validarProducto(data): boolean {
    return data.proCodigoPrincipal ? true : false;
  }

  validarCantidad(data): boolean {
    let cantidadSolicitada = data.detCantidad;
    let minimo = 0.01;
    return cantidadSolicitada && cantidadSolicitada >= minimo;
  }

  formatearFecha(params) {
    return new DatePipe('en-US').transform(params.value, 'yyyy-MM-dd');
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
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularTransferencias;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruEliminarTransferencias;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruMayorizarTransferencias;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruDesmayorizarTransferencias;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruAnularTransferencias;
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

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}

