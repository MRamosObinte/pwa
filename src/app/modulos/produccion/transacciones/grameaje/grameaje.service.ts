import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { PiscinaComponent } from '../../archivos/piscina/piscina.component';

@Injectable({
  providedIn: 'root'
})
export class GrameajeService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
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

  listarGramaje(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaPiscinasGrameaje", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesListarGramaje(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarGramajeListado(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarGrameajeListado", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarGramaje(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  eliminarGramaje(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/eliminarGrameaje", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeEliminarGramaje(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto): Array<any> {
    let columnDefs: Array<any> = [];
    columnDefs = [
      {
        headerName: LS.TAG_PISCINA,
        field: 'graPiscinaNombre',
        width: 100,
        minWidth: 100,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_HECTAREAS,
        field: 'graHectareas',
        width: 80,
        minWidth: 80,
        valueFormatter: this.numberFormatter,
        cellClass: 'cell-block text-right'
      },
      {
        headerName: LS.TAG_DIAS_CULTIVO,
        field: 'graDiasCultivo',
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
        cellClass: 'cell-block text-right'
      },
      {
        headerName: LS.TAG_LARVAS,
        field: 'graCantidadLarvas',
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
        cellClass: 'cell-block text-right'
      },
      {
        headerName: LS.TAG_ULTIMO_PESO,
        field: 'graPesoAnterior',
        width: 90,
        minWidth: 90,
        valueFormatter: this.numberFormatter,
        cellClass: 'cell-block text-right '
      },
      {
        headerName: LS.TAG_GRAMOS_PROMEDIO,
        field: 'graPesoActual',
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned && !params.data.noEditable ? 'text-right cell-editing' : 'text-right cell-block' },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultado)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        editable: (params) => { return !params.node.rowPinned ? !params.data.noEditable : false },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'graPesoActual',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        },
        cellClassRules: { "has-warning": (params) => { return params.node.rowPinned ? false : params.data.isMenorQuePesoAnterior } },
      },
      {
        headerName: LS.TAG_BIOMASA,
        field: 'graBiomasa',
        width: 80,
        minWidth: 80,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-right cell-block' : 'text-right tr-negrita cell-block' }
      },
      {
        headerName: LS.TAG_SOBREVIVENCIA,
        field: 'graSobrevivencia',
        width: 90,
        minWidth: 90,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned && !params.data.noEditable ? 'text-right cell-editing' : 'text-right cell-block' },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultado)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClassRules: { "has-warning": (params) => { return params.node.rowPinned ? false : params.data.isMayorQueSobrevivenciaAnterior } },
        editable: (params) => { return !params.node.rowPinned ? !params.data.noEditable : false },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'graSobrevivencia',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        },
      },
      {
        headerName: LS.TAG_ANIMALES_M2,
        field: 'graAnimalesM2',
        width: 100,
        minWidth: 100,
        valueFormatter: this.numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned && !params.data.noEditable ? 'text-right cell-editing' : 'text-right cell-block' },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultado)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        editable: (params) => { return !params.node.rowPinned ? !params.data.noEditable : false },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'graAnimalesM2',
          maxlength: 12,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric92
        }
      },
      {
        headerName: LS.TAG_COMENTARIO,
        field: 'graComentario',
        width: 100,
        minWidth: 100,
        cellClass: (params) => { return !params.node.rowPinned && !params.data.noEditable ? 'cell-editing' : 'cell-block' },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultado)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        editable: (params) => { return !params.node.rowPinned ? !params.data.noEditable : false },
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'graComentario',
          maxlength: 100,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.graSobrevivencia && params.data.graPesoActual) {
            return {
              icono: LS.ICON_ELIMINAR,
              tooltip: LS.MSJ_ELIMINAR_GRAMAJE,
              accion: LS.ACCION_ELIMINAR
            };
          } else {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          }
        }
        ,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ];
    return columnDefs;
  }

  numberFormatter(params) {
    let value = params.value ? params.value.toString().replace(/,/gi, "") : 0;
    return new DecimalPipe('en-US').transform(value, '1.2-2');
  }

  calculoGramajeBiomasa(piscina): number {
    let biomasa = 0;
    if (piscina.graSobrevivencia) {
      biomasa = this.utilService.matRound2((((piscina.graPesoActual * piscina.graCantidadLarvas) / 453.60) * piscina.graSobrevivencia) / 100);
    }
    return biomasa;
  }

  /**Se ingresa graAnimalesM2 */
  calculoGramajeAnimalesM2Sobrevivencia(piscina): number {
    let sobrevicencia = 0;
    let hectareas = piscina.graHectareas * 10000;
    let numeroAnimalesPorMetroCuadrado = (piscina.graCantidadLarvas / hectareas)
    sobrevicencia = this.utilService.matRound2(((piscina.graAnimalesM2 * 100) / numeroAnimalesPorMetroCuadrado));
    return sobrevicencia;
  }

  calculoGramajeAnimalesM2(piscina): number {
    let graAnimalesM2 = 0;
    let hectareas = piscina.graHectareas * 10000;
    let numeroAnimalesPorMetroCuadrado = (piscina.graCantidadLarvas / hectareas)
    graAnimalesM2 = this.utilService.matRound2((piscina.graSobrevivencia * numeroAnimalesPorMetroCuadrado) / 100);
    return graAnimalesM2;
  }

  /**Peso actual es menor que peso anterior , se pintara el input como advertencia */
  verificarPeso(piscina): boolean {
    let isMenorQuePesoAnterior = (piscina.graPesoAnterior > piscina.graPesoActual && piscina.graPesoActual > 0);
    if (isMenorQuePesoAnterior) {
      this.toastr.warning(LS.MSJ_PESO_ACTUAL_NO_PUEDE_SER_MENOR_PESO_ANTERIOR, LS.TOAST_INFORMACION);
    }
    return isMenorQuePesoAnterior;
  }

  /**sobrevivencia actual es mayor que sobrevivencia anterior , se pintara el input como advertencia */
  verificarSobrevivencia(piscina): boolean {
    let isMayorQueSobrevivenciaAnterior = (piscina.graSobrevivencia > piscina.graSobrevivenciaAnterior);
    if (isMayorQueSobrevivenciaAnterior) {
      this.toastr.warning(LS.MSJ_SOBREVIVENCIA_ACTUAL_NO_PUEDE_SER_MAYOR_ANTERIOR, LS.TOAST_INFORMACION);
    }
    return isMayorQueSobrevivenciaAnterior;
  }
}
