import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { RhListaEmpleadoLoteTO } from '../../../../entidadesTO/rrhh/RhListaEmpleadoLoteTO';

@Injectable({
  providedIn: 'root'
})
export class RolPagoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

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

  fpPorPagar(): any {
    return {
      ctaCodigo: "000000000000",
      fpDetalle: "POR PAGAR",
      validar: false
    }
  }

  // el extraInfo retorna Listas para llenar combos
  obtenerDatosParaRolesDePago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaRolesDePago", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaRolesDePago(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna el contable para enviar a imprimir
  insertarRhRol(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhRol", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeInsertarRhRol(data);
        } else {
          this.utilService.generarSwal(LS.TALENTO_HUMANO_ROL_DE_PAGOS, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna el contable para enviar a imprimir
  modificarRhRol(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhRol", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeModificarRhRol(data);
        } else {
          this.utilService.generarSwal(LS.TALENTO_HUMANO_ROL_DE_PAGOS, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna una List<ItemListaRolTO>
  calcularValoresRolesPago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/calcularValoresRolesPago", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeCalcularValoresRolesPago(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna RhRol
  completarDatosDelRolDePago(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/completarDatosDelRolDePago", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeCompletarDatosDelRolDePago(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 100,
        minWidth: 100,
        valueGetter: (params) => {
          return params.data.prId;
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 270,
        minWidth: 270,
        valueGetter: (params) => {
          return params.data.prNombres;
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_50_PORCENTAJE,
        field: 'horas50',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_HORAS_EXTRAS_50_PORCENTAJE,
          text: LS.TAG_H_EXTRAS_50_PORCENTAJE,
          enableSorting: true
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'horas50',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_100_PORCENTAJE,
        field: 'horas100',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_HORAS_EXTRAS_100_PORCENTAJE,
          text: LS.TAG_H_EXTRAS_100_PORCENTAJE,
          enableSorting: true
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'horas100',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_DIAS_FALTA,
        field: 'diasFalta',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA0Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.diasFalta > 0 && params.data.fpSeleccionada ? !this.validarDias(params.data) : false;
          }
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_DIAS_FALTA,
          text: LS.TAG_D_FALTA,
          enableSorting: true
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'diasFalta',
          maxlength: 12,
          placeholder: '0',
          configAutonumeric: contexto.autonumeric30
        }
      },
      {
        headerName: LS.TAG_PERMISO,
        field: 'rolDescuentoPermisoMedico',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.rolDescuentoPermisoMedico > 0 && params.data.fpSeleccionada ? !this.validarPermiso(params.data) : false;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'rolDescuentoPermisoMedico',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS,
        field: 'prestamos',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          if (contexto.esContable && contexto.puedeEditarTabla) {
            return true;
          }
          if (!contexto.puedeEditarTabla) {
            return false;
          }
          return !params.node.rowPinned && params.data.prestamos > 0;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.prestamos > 0 ? this.validarCantidad(params.data) : false;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'prestamos',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS_QUIROGRAFARIOS,
        field: 'prestamosQ',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_PRESTAMOS_QUIROGRAFARIOS,
          text: LS.TAG_P_QUIROGRAFARIOS,
          enableSorting: true
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'prestamosQ',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS_HIPOTECARIOS,
        field: 'prestamosH',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 100,
        minWidth: 100,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_PRESTAMOS_HIPOTECARIOS,
          text: LS.TAG_P_HIPOTECARIOS,
          enableSorting: true
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'prestamosH',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'fpSeleccionada',
        width: 140,
        minWidth: 140,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-center' : 'text-right tr-negrita';
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.node.rowPinned) {
              return false;
            }
            if (contexto.esContable && !(params.data.fpSeleccionada && params.data.fpSeleccionada.fpDetalle)) {
              return true;
            }
            return params.data.prValor > 0 && !(params.data.fpSeleccionada && params.data.fpSeleccionada.fpDetalle);
          }
        },
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var fpSeleccionada = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          return {
            value: fpSeleccionada,
            name: 'fpSeleccionada',
            obligatorio: false,
            listValues: contexto.formasDePago ? contexto.formasDePago : [],
            fieldsShow: ['fpDetalle']
          };
        },
        valueFormatter: function (params) {
          params.data.fpSeleccionada = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          if (params.data.fpSeleccionada) {
            return !params.node.rowPinned ? params.data.fpSeleccionada.fpDetalle : params.data.fpSeleccionada;
          }
          return contexto.fpSeleccionada ? contexto.fpSeleccionada.fpDetalle : '';
        }
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'documento',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          return !params.node.rowPinned ? 'mousetrap' : 'text-right tr-negrita';
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.node.rowPinned || !contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.errorEnDocumento || params.data.documentoRepetido;
          }
        },
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'documento',
          inputClass: 'text-uppercase',
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_NUMERO_DOCUMENTO,
          text: LS.TAG_N_DOCUMENTO,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'observacion',
        width: 200,
        minWidth: 200,
        cellClass: "mousetrap",
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoEmpleadosLote)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'observacion',
          inputClass: 'text-uppercase',
        }
      }
    );
    if (contexto.esContable && contexto.puedeEditarTabla) {
      columnas.push(
        this.utilService.getColumnaOpciones()
      )
    } else {
      columnas.push(
        this.utilService.getColumnaBotonAccion()
      )
    }
    return columnas;
  }

  generarPinnedBottonRowData(): Array<any> {
    return [
      {
        fpSeleccionada: LS.TAG_N_ROLES,
        documento: 0
      }
    ]
  }

  establecerPrestamos(listaResultado: Array<RhListaEmpleadoLoteTO>): Array<any> {
    let listaFormateada: Array<any> = listaResultado;
    for (let i = 0; i < listaResultado.length; i++) {
      listaFormateada[i].prestamos = listaResultado[i].prSaldoPrestamos > 0 && listaResultado[i].prSaldoCuotas > 0 ? this.mathRound2(listaResultado[i].prSaldoPrestamos / listaResultado[i].prSaldoCuotas) : 0;
    }
    return listaFormateada;
  }

  validarDias(data) {
    let diasFalta = this.mathRound2(data.diasFalta);
    if (diasFalta > 30) {
      return false;
    }
    return true;
  }

  validarPermiso(data) {
    if (data.rolDescuentoPermisoMedico > this.utilService.quitarComasNumero(data.prSueldo)) {
      return false;
    }
    return true;
  }

  mathRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  validarCantidad(data): boolean {
    return data.prestamos > data.prSaldoPrestamos;
  }

  formatearA2Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return new DecimalPipe('en-US').transform(value, '1.2-2');
  }

  formatearA0Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return value;
  }
}
