import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { LS } from '../../../../../constantes/app-constants';
import { SelectCellComponent } from '../../../../componentes/select-cell/select-cell.component';
import { SoloNumerosComponent } from '../../../../componentes/solo-numeros/solo-numeros.component';
import { InputCellComponent } from '../../../../componentes/input-cell/input-cell.component';
import { NumericCellComponent } from '../../../../componentes/numeric-cell/numeric-cell.component';
import { MaskCalendarComponent } from '../../../../componentes/mask-calendar/mask-calendar.component';
import { PagoService } from '../../pago-formulario/pago.service';

@Injectable({
  providedIn: 'root'
})
export class CobroFormaDetalleService {

  constructor(
    private utilService: UtilService,
    private pagoService: PagoService
  ) { }

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'fpForma',
        width: 100,
        minWidth: 100,
        maxWitdh: 100,
        hide: contexto.accion === LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'fpSeleccionada',
        width: 160,
        minWidth: 160,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: 'text-center',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.fpSeleccionada && contexto.accion === LS.ACCION_CREAR;
          }
        },
        editable: contexto.accion === LS.ACCION_CREAR,
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var fpSeleccionada = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          return {
            value: fpSeleccionada,
            name: 'fpSeleccionada',
            obligatorio: true,
            listValues: contexto.listaFormaPago ? contexto.listaFormaPago : [],
            fieldsShow: ['fpDetalle']
          };
        },
        valueFormatter: function (params) {
          params.data.fpSeleccionada = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          if (params.data.fpSeleccionada) {
            return !params.node.rowPinned ? params.data.fpSeleccionada.fpDetalle : params.data.fpSeleccionada;
          }
          return contexto.fpSeleccionada ? contexto.fpSeleccionada.fpDetalle : '';
        },
        hide: contexto.accion != LS.ACCION_CREAR
      },
      {
        headerName: LS.TAG_BANCO,
        field: 'bancoSeleccionado',
        width: 160,
        minWidth: 160,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: 'text-center',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.bancoSeleccionado && contexto.accion === LS.ACCION_CREAR;
          }
        },
        editable: (params) => {
          return contexto.accion === LS.ACCION_CREAR && params.data.fpSeleccionada && params.data.fpSeleccionada.postFechados;
        },
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var bancoSeleccionado = params.data.fpSeleccionada ? params.data.fpSeleccionada : contexto.fpSeleccionada;
          return {
            value: bancoSeleccionado,
            name: 'bancoSeleccionado',
            obligatorio: true,
            listValues: contexto.bancos ? contexto.bancos : [],
            fieldsShow: ['banNombre']
          };
        },
        valueFormatter: function (params) {
          params.data.bancoSeleccionado = params.data.bancoSeleccionado ? params.data.bancoSeleccionado : contexto.bancoSeleccionado;
          if (params.data.bancoSeleccionado) {
            return !params.node.rowPinned ? params.data.bancoSeleccionado.banNombre : params.data.bancoSeleccionado;
          }
          return contexto.bancoSeleccionado ? contexto.bancoSeleccionado.banNombre : '';
        },
        hide: !contexto.esPostFechado
      },
      {
        headerName: LS.TAG_CUENTA,
        field: 'detCuenta',
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 160,
        minWidth: 160,
        editable: (params) => {
          return contexto.accion === LS.ACCION_CREAR && params.data.fpSeleccionada && params.data.fpSeleccionada.postFechados;
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.detCuenta && params.data.fpSeleccionada && params.data.fpSeleccionada.postFechados && contexto.accion === LS.ACCION_CREAR;
          }
        },
        cellEditorFramework: SoloNumerosComponent,
        cellEditorParams: { name: 'detCuenta', maxlength: 50, inputClass: 'text-uppercase', placeholder: '' },
        hide: !contexto.esPostFechado
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'detFechaPst',
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 160,
        minWidth: 160,
        editable: (params) => {
          return contexto.accion === LS.ACCION_CREAR && params.data.fpSeleccionada && params.data.fpSeleccionada.postFechados;
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (contexto.accion !== LS.ACCION_CREAR) {
              return false;
            }
            return params.data.fpSeleccionada && params.data.fpSeleccionada.postFechados && !this.pagoService.validarFecha(params.data, contexto.fechaActual);
          }
        },
        cellEditorFramework: MaskCalendarComponent,
        cellEditorParams: { name: 'detFechaPst', minDate: new Date() },
        hide: !contexto.esPostFechado
      },
      {
        headerName: LS.TAG_REFERENCIA,
        field: 'detReferencia',
        width: 110,
        minWidth: 110,
        cellClass: "mousetrap",
        cellClassRules: {
          "cell-with-errors": (params) => {
            return (params.data.errorEnDocumento || params.data.documentoRepetido) && contexto.accion === LS.ACCION_CREAR;
          }
        },
        editable: contexto.accion === LS.ACCION_CREAR,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'detReferencia',
          inputClass: 'text-uppercase',
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'detValor',
        valueFormatter: numberFormatter,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 110,
        minWidth: 110,
        editable: contexto.accion === LS.ACCION_CREAR,
        cellClass: 'text-right',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return (!params.data.detValor || params.data.detValor === 0) && contexto.accion === LS.ACCION_CREAR;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'detValor',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.configAutonumericReales
        }
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'detObservaciones',
        width: 200,
        minWidth: 200,
        cellClass: "mousetrap",
        editable: contexto.accion === LS.ACCION_CREAR,
        suppressKeyboardEvent: (params) => {
          contexto.agregarFilaAlFinal(params);
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoDeFormasDeCobro)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'detObservaciones',
          inputClass: 'text-uppercase',
        }
      }
    );
    if (contexto.accion === LS.ACCION_CREAR) {
      columnas.push(
        this.utilService.getColumnaOpciones()
      )
    }
    return columnas;
  }

}

function numberFormatter(params) {
  if (!params.value) {
    params.value = 0;
  }
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
