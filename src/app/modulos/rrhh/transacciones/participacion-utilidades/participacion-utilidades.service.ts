import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class ParticipacionUtilidadesService {

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

  // el extraInfo retorna Listas para llenar combos
  obtenerDatosParaCrudUtilidades(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaCrudUtilidades", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudUtilidades(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna el contable para enviar a imprimir
  insertarRhUtilidades(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhUtilidades", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeInsertarRhUtilidades(data);
        } else {
          this.utilService.generarSwal(LS.TALENTO_HUMANO_PARTICIPACION_UTILIDADES, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna el contable para enviar a imprimir
  modificarRhUtilidades(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhUtilidades", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeModificarRhUtilidades(data);
        } else {
          this.utilService.generarSwal(LS.TALENTO_HUMANO_PARTICIPACION_UTILIDADES, LS.SWAL_ERROR, data.operacionMensaje);
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
        width: 120,
        minWidth: 120,
        valueGetter: (params) => {
          return params.data.utiId;
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'prNombres',
        width: 300,
        minWidth: 300,
        cellClass: (params) => {
          return !params.node.rowPinned ? '' : 'text-right tr-negrita';
        },
        valueGetter: (params) => {
          return !params.node.rowPinned ? params.data.utiApellidos + " " + params.data.utiNombres : LS.TAG_TOTAL_PUNTOS;
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'valor',
        valueFormatter: this.formatearA2Decimales,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoUtilidades)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        width: 110,
        minWidth: 110,
        editable: (params) => {
          return !params.node.rowPinned && contexto.puedeEditarTabla;
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'valor',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'fpSeleccionada',
        width: 160,
        minWidth: 160,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoUtilidades)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-center' : 'text-right tr-negrita';
        },
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.node.rowPinned || !contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.valor > 0 && !(params.data.fpSeleccionada && params.data.fpSeleccionada.fpDetalle);
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
            obligatorio: true,
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
        width: 140,
        minWidth: 140,
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
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoUtilidades)
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
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoUtilidades)
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
        this.utilService.getColumnaEliminar()
      )
    }
    return columnas;
  }

  generarPinnedBottonRowData(): Array<any> {
    return [
      {
        utiId: '',
        prNombres: LS.TAG_TOTAL_PUNTOS,
        valor: 0,
        fpSeleccionada: LS.TAG_N_UTILIDADES,
        documento: 0,
        observacion: ''
      }
    ]
  }

  formatearA2Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return new DecimalPipe('en-US').transform(value, '1.2-2');
  }
}
