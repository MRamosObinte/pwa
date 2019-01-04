import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { LS } from '../../../../constantes/app-constants';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { DecimalPipe } from '@angular/common';
import { InputLabelCellComponent } from '../../../componentes/input-label-cell/input-label-cell.component';

@Injectable({
  providedIn: 'root'
})
export class XiiiSueldoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  listarRhXiiiSueldoXiiiSueldoCalcular(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhXiiiSueldoXiiiSueldoCalcular", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhXiiiSueldoXiiiSueldoCalcular(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhXiiiSueldoXiiiSueldoCalcular([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  xiiiSueldoVerificarMayor(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/xiiiSueldoVerificarMayor", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeXiiiSueldoVerificarMayor(respuesta.extraInfo);
        } else {
          contexto.despuesDeXiiiSueldoVerificarMayor(null);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarRhXiiiSueldoXiiiSueldoCalcula(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhXiiiSueldoXiiiSueldoCalcular", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarRhXiiiSueldoXiiiSueldoCalcular(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.enviarAccion ? contexto.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false }) : contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarRhXiiiSueldo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhXiiiSueldo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarRhXiiiSueldoXiiiSueldoCalcular(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.enviarAccion ? contexto.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false }) : contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto) {
    let esEditable = contexto.puedeEditarTabla;
    let columnas = [
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        field: 'rhXiiiSueldo.rhEmpleado.rhEmpleadoPK.empId',
        width: 180,
        minWidth: 150
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'rhXiiiSueldo.rhEmpleado.empNombres',
        width: 250,
        minWidth: 250,
        valueGetter: (params) => { return (params.node.rowPinned ? '' : params.data.rhXiiiSueldo.rhEmpleado.empApellidos + ' ' + params.data.rhXiiiSueldo.rhEmpleado.empNombres) },
      },
      {
        headerName: LS.TAG_INGRESOS_CALCULADOS,
        field: 'ingresosCalculados',
        width: 180,
        minWidth: 180,
        valueFormatter: numberFormatter,
        cellClass: "text-right",
        valueGetter: (params) => { return (params.node.rowPinned ? '' : params.data.ingresosCalculados) }
      },
      {
        headerComponentFramework: InputLabelCellComponent,
        headerClass: 'pr-0',
        headerComponentParams: { name: LS.TAG_INGRESOS_REALES, value: contexto.apruebaTodos, tooltipText: LS.TAG_TODOS, noVisible: esEditable ? false : true },
        headerName: LS.TAG_INGRESOS_REALES,
        field: 'rhXiiiSueldo.xiiiBaseImponible',
        width: 180,
        minWidth: 180,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-right' : 'tr-negrita' },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'rhXiiiSueldo.xiiiBaseImponible', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultadoXiiiSueldo) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.node.rowPinned && !params.data.isValorValido;
          }
        },
        editable: esEditable,
        pinnedRowCellRendererFramework: PinnedCellComponent,
        pinnedRowCellRendererParams: { value: LS.TAG_TOTAL_PUNTOS }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'rhXiiiSueldo.xiiiValor',
        width: 180,
        minWidth: 180,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita' },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.total : params.data.rhXiiiSueldo.xiiiValor) }
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
            return !params.node.rowPinned ? params.data.formaPago.fpDetalle : LS.TAG_N_XIII_SUELDO;
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
            return !params.node.rowPinned && !params.data.isFormaPagoValido;
          }
        }
      },
      {
        headerName: LS.TAG_NUMERO_DOCUMENTO,
        field: 'rhXiiiSueldo.xiiiDocumento',
        width: 200,
        minWidth: 200,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultadoXiiiSueldo) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'rhXiiiSueldo.xiiiDocumento',
          maxlength: 1000,
          inputClass: 'text-uppercase',
          placeholder: ''
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.node.rowPinned) {
              return false;
            }
            return params.data.errorEnDocumento || params.data.documentoRepetido;
          }
        },
        editable: (params) => { return !params.node.rowPinned && esEditable },
        cellClass: (params) => { return !params.node.rowPinned ? 'mousetrap' : 'text-right tr-negrita' },
        valueGetter: (params) => { return (params.node.rowPinned ? contexto.cantidadXiiiSueldo : params.data.rhXiiiSueldo.xiiiDocumento) }
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'rhXiiiSueldo.xiiiObservaciones',
        width: 350,
        minWidth: 350,
        cellClass: 'text-uppercase',
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultadoXiiiSueldo) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: esEditable,
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'rhXiiiSueldo.xiiiObservaciones',
          maxlength: 1000,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      }
    ];
    if (contexto.esContable && contexto.puedeEditarTabla) {
      columnas.push(
        this.utilService.getColumnaEliminar()
      )
    }
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
