import { DecimalPipe } from '@angular/common';
import { LS } from './../../../../constantes/app-constants';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { Injectable } from '@angular/core';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { InputCellComponent } from '../../../componentes/input-cell/input-cell.component';
import { CheckboxCellComponent } from '../../../componentes/checkbox-cell/checkbox-cell.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { PinnedCellComponent } from '../../../componentes/pinned-cell/pinned-cell.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class BonosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
  ) { }

  listarBonos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhBonos", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarBonos(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarBonos([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }


  insertarBonos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhBono", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeInsertarBonos(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.enviarAccion ? contexto.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false }) : contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  modificarRhBono(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhBono", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarBonos(respuesta);
        } else {
          this.utilService.generarSwalHTML(LS.SWAL_INCORRECTO, LS.SWAL_ERROR, respuesta.operacionMensaje, LS.ICON_ERROR_SWAL, LS.SWAL_ERROR);
          contexto.enviarAccion ? contexto.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false }) : contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto) {
    let columnas = [];
    columnas.push(
      {
        headerName: LS.TAG_N_IDENTIFICACION,
        field: 'rhListaEmpleadoLoteTO.prId',
        width: 125,
        minWidth: 50,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_NUMERO_IDENTIFICACION, text: LS.TAG_N_IDENTIFICACION },
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'rhListaEmpleadoLoteTO.prNombres',
        width: 250,
        minWidth: 250
      },
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'concepto',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_CONCEPTO },
        cellClass: (params) => { return !params.node.rowPinned ? '' : 'tr-negrita' },
        cellEditorFramework: SelectCellComponent,
        valueFormatter: function (params) {
          params.data.concepto = (contexto.conceptoSeleccionado && !params.node.rowPinned) ? contexto.conceptoSeleccionado : params.data.concepto;
          if (params.data.concepto) {
            return !params.node.rowPinned ? params.data.concepto.bcDetalle : LS.TAG_TOTAL_PUNTOS;
          }
          return '';
        },
        cellEditorParams: function (params) {
          var concepto = params.data.concepto ? params.data.concepto : null;
          return {
            value: concepto,
            name: 'concepto',
            obligatorio: true,
            ejecutarMetodoChange: false,
            listValues: contexto.listadoConceptos,
            fieldsShow: ['bcDetalle']
          }
        },
        editable: contexto.puedeEditarTabla,
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return !params.node.rowPinned && !params.data.isConceptoValido;
          }
        }
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'rhListaEmpleadoLoteTO.prValor',
        width: 120,
        minWidth: 80,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-right' : 'text-right tr-negrita' },
        valueGetter: (params) => { return (params.node.rowPinned ? (contexto.total ? contexto.total : 0) : params.data.rhListaEmpleadoLoteTO.prValor) },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: { name: 'rhListaEmpleadoLoteTO.prValor', maxlength: 25, placeholder: '0.00', configAutonumeric: contexto.configAutonumeric },
        suppressKeyboardEvent: (params) => {
          if (params.editing && !params.node.rowPinned) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: contexto.puedeEditarTabla,
        cellClassRules: {
          "cell-with-errors": (params) => {
            if (!contexto.puedeEditarTabla) {
              return false;
            }
            return !params.node.rowPinned && !params.data.isValorValido;
          }
        }
      },
      {
        headerName: LS.TAG_CENTRO_COSTO,
        field: 'piscina',
        width: 180,
        minWidth: 180,
        headerComponent: 'toolTip',
        headerComponentParams: { class: '', text: LS.TAG_CENTRO_COSTO },
        cellEditorFramework: SelectCellComponent,
        cellClass: (params) => { return !params.node.rowPinned ? '' : 'tr-negrita' },
        valueFormatter: function (params) {
          params.data.piscina = (contexto.piscinaSeleccionada && !params.node.rowPinned && contexto.inicializandoPiscinas) ? contexto.piscinaSeleccionada : params.data.piscina;
          if (params.data.piscina) {
            return !params.node.rowPinned ? params.data.piscina.pisNombre : LS.TAG_N_BONOS;
          }
          return '';
        },
        cellEditorParams: function (params) {
          var piscina = params.data.piscina ? params.data.piscina : null;
          return {
            value: piscina,
            name: 'piscina',
            obligatorio: false,
            ejecutarMetodoChange: false,
            listValues: contexto.piscinaSeleccionada ? contexto.listadoPiscinas : params.data.listaPiscinas,
            fieldsShow: ['pisNombre', 'pisNumero']
          }
        },
        editable: contexto.puedeEditarTabla
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'observacion',
        width: 300,
        minWidth: 300,
        cellClass: (params) => { return !params.node.rowPinned ? 'text-uppercase' : 'text-right tr-negrita' },
        suppressKeyboardEvent: (params) => {
          if (params.editing) { return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaResultado) || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode)) }
        },
        editable: contexto.puedeEditarTabla,
        cellEditorFramework: InputCellComponent,
        cellEditorParams: {
          name: 'observacion',
          maxlength: 1000,
          inputClass: 'text-uppercase',
          placeholder: ''
        }
      }
    );
    if (contexto.puedeEditarTabla) {
      columnas.push(
        {
          headerName: LS.TAG_DEDUCIBLE,
          cellClass: 'text-center',
          field: "deducible",
          width: 140,
          minWidth: 80,
          cellRendererFramework: CheckboxCellComponent,
          cellRendererParams: (params) => { return (params.node.rowPinned ? null : params.data.deducible) },
        }
      )
    } else {
      columnas.push(
        {
          headerName: LS.TAG_DEDUCIBLE,
          cellClass: 'text-center',
          field: "deducible",
          width: 140,
          minWidth: 80,
          cellRendererFramework: InputEstadoComponent,
          cellRendererParams: (params) => { return (params.node.rowPinned ? '' : params.data.deducible) },
          pinnedRowCellRendererFramework: PinnedCellComponent,
          pinnedRowCellRendererParams: { value: '' }
        }
      )
    }
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
