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

@Injectable({
  providedIn: 'root'
})
export class AnticiposService {

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
  obtenerDatosParaCrudAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/obtenerDatosParaCrudAnticipos", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudAnticipos(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna el contable para enviar a imprimir
  insertarRhAnticipo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhAnticipo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeInsertarRhAnticipo(data);
        } else {
          this.utilService.generarSwal(LS.TAG_ANTICIPO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna el contable para enviar a imprimir
  modificarRhAnticipo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhAnticipo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeModificarRhAnticipo(data);
        } else {
          this.utilService.generarSwal(LS.TAG_ANTICIPO, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto): Array<any> {
    let columnas: Array<any> = [];
    if (contexto.parametrosFormulario && !contexto.parametrosFormulario.sector) {
      columnas.push(
        {
          headerName: LS.TAG_SECTOR,
          width: 90,
          minWidth: 90,
          valueGetter: (params) => {
            return params.data.prSector;
          }
        }
      )
    }
    columnas.push(
      {
        headerName: LS.TAG_IDENTIFICACION,
        width: 120,
        minWidth: 120,
        valueGetter: (params) => {
          return params.data.prId;
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 300,
        minWidth: 300,
        valueGetter: (params) => {
          return params.data.prNombres;
        }
      },
      {
        headerName: LS.TAG_INGRESOS,
        field: 'prIngresos',
        width: 110,
        minWidth: 110,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        }
      },
      {
        headerName: LS.TAG_S_ANTICIPO,
        field: 'prSaldoAnticipos',
        width: 110,
        cellClass: (params) => {
          return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita';
        },
        valueFormatter: (params) => {
          return !params.node.rowPinned ? this.formatearA2Decimales(params) : null
        },
        minWidth: 110,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: {
          tooltip: LS.TAG_SALDO_ANTICIPO,
          text: LS.TAG_S_ANTICIPO,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'prValor',
        valueFormatter: this.formatearA2Decimales,
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoAnticipos)
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
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (params.node.rowPinned || !contexto.puedeEditarTabla) {
              return false;
            }
            return params.data.prValor > 0 ? !this.validarCantidad(params.data) : false;
          }
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'prValor',
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
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoAnticipos)
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
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoAnticipos)
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
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listadoAnticipos)
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
        prSector: '',
        prId: '',
        prNombres: '',
        prIngresos: null,
        prSaldoAnticipos: LS.TAG_TOTAL_PUNTOS,
        prValor: 0,
        fpSeleccionada: LS.TAG_N_ANTICIPOS,
        documento: 0,
        observacion: ''
      }
    ]
  }

  validarCantidad(data) {
    let ingresos = this.matRound2(data.prIngresos);
    let anticipado = this.matRound2(data.prSaldoAnticipos);
    let loquePuedeAnticipar = this.matRound2(ingresos - anticipado);
    let valor = this.matRound2(data.prValor);
    if (valor > loquePuedeAnticipar) {
      return false;
    }
    return true;
  }

  matRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  formatearA2Decimales(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return new DecimalPipe('en-US').transform(value, '1.2-2');
  }

}
