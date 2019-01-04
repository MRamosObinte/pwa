import { NumericCellComponent } from './../../../componentes/numeric-cell/numeric-cell.component';
import { SelectCellComponent } from './../../../componentes/select-cell/select-cell.component';
import { PinnedCellComponent } from './../../../componentes/pinned-cell/pinned-cell.component';
import { LS } from './../../../../constantes/app-constants';
import { InputCellComponent } from './../../../componentes/input-cell/input-cell.component';
import { DecimalPipe } from '@angular/common';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { Injectable } from '@angular/core';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';

@Injectable({
  providedIn: 'root'
})
export class XivSueldoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
  ) { }

  listarRhxivSueldoxivSueldoCalcular(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhXivSueldoXivSueldoCalcular", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhxivSueldoxivSueldoCalcular(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhxivSueldoxivSueldoCalcular([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarRhXivSueldoXivSueldoCalcular(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhXivSueldoXivSueldoCalcular", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarRhXivSueldoXivSueldoCalcular(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.enviarAccion ? contexto.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false }) : contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarRhXivSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhXivSueldo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarRhXivSueldoXivSueldoCalcular(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.enviarAccion ? contexto.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false }) : contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  autonumeric() {
    return {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '360',
      minimumValue: '0',
    }
  }

  generarColumnas(contexto) {
    let columnas = [];
    let esEditable = contexto.puedeEditarTabla;

    columnas.push(
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        field: 'rhXivSueldo.rhEmpleado.rhEmpleadoPK.empId',
        width: 180,
        minWidth: 180
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'rhXivSueldo.rhEmpleado.empNombres',
        width: 250,
        minWidth: 250,
        valueGetter: (params) => { return (params.node.rowPinned ? '' : params.data.rhXivSueldo.rhEmpleado.empApellidos + ' ' + params.data.rhXivSueldo.rhEmpleado.empNombres) },
      },
      {
        headerName: LS.TAG_DIAS_CALCULADOS,
        field: 'rhXivSueldo.xivDiasLaboradosEmpleado',
        width: 180,
        minWidth: 180,
        valueFormatter: numberFormatter,
        cellClass: "text-right",
        valueGetter: (params) => { return (params.node.rowPinned ? '' : params.data.rhXivSueldo.xivDiasLaboradosEmpleado) },
      },
      {
        headerComponentFramework: InputLabelCellComponent,
        headerClass: 'pr-0',
        headerComponentParams: { name: LS.TAG_DIAS_REALES, value: contexto.apruebaTodos, tooltipText: LS.TAG_TODOS, noVisible: esEditable ? false : true },

        headerName: LS.TAG_DIAS_REALES,
        field: 'diasLaborados',
        width: 180,
        minWidth: 180,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-right' : 'tr-negrita' },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'diasLaborados', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultadoXivSueldo) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: esEditable,
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return !params.node.rowPinned && !params.data.isValorValido;
          }
        },
        pinnedRowCellRendererFramework: PinnedCellComponent,
        pinnedRowCellRendererParams: { value: LS.TAG_TOTAL_PUNTOS }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'rhXivSueldo.xivValor',
        width: 180,
        minWidth: 180,
        valueFormatter: numberFormatter2,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-right' : 'tr-negrita text-right' },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.total : params.data.rhXivSueldo.xivValor) }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'formaPago',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_FORMA_PAGO },
        cellEditorFramework: SelectCellComponent,
        cellClass: (params) => { return !params.node.rowPinned ? '' : 'tr-negrita' },
        valueFormatter: function (params) {
          params.data.formaPago = params.data.formaPago ? params.data.formaPago : contexto.formaPagoSeleccionado;
          if (params.data.formaPago) {
            return !params.node.rowPinned ? params.data.formaPago.fpDetalle : LS.TAG_N_XIV_SUELDO;
          }
          return contexto.formaPagoSeleccionado && !params.node.rowPinned ? contexto.formaPagoSeleccionado.fpDetalle : '';
        },
        cellEditorParams: function (params) {
          var formaPago = params.data.formaPago;
          return {
            value: formaPago,
            name: 'formaPago',
            obligatorio: true,
            ejecutarMetodoChange: false,
            listValues: contexto.listaFormasPagoBeneficio,
            fieldsShow: ['fpDetalle', 'ctaCodigo']
          }
        },
        editable: esEditable,
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return !params.node.rowPinned && !params.data.isFormaPagoValido;
          }
        }
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'rhXivSueldo.xivDocumento',
        width: 200,
        minWidth: 100,
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultadoXivSueldo) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'rhXivSueldo.xivDocumento',
          maxlength: 1000,
          inputClass: 'text-uppercase',
          placeholder: ''
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.node.rowPinned || !contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.errorEnDocumento || params.data.documentoRepetido;
          }
        },
        editable: (params) => { return !params.node.rowPinned && contexto.puedeEditarTabla },
        cellClass: (params) => { return !params.node.rowPinned ? 'mousetrap' : 'text-right tr-negrita' },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.cantidadXivSueldo : params.data.rhXivSueldo.xivDocumento) },
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'rhXivSueldo.xivObservaciones',
        width: 350,
        minWidth: 350,
        cellClass: 'text-uppercase',
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultadoXivSueldo) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: esEditable,
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'rhXivSueldo.xivObservaciones',
          maxlength: 1000,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      }
    )
    if (contexto.esContable && contexto.puedeEditarTabla) {
      columnas.push(
        this.utilService.getColumnaEliminar()
      )
    }
    return columnas;
  }
}

function numberFormatter2(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.0-0');
}