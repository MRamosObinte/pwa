import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { DecimalPipe } from '@angular/common';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { SelectCellAtributoComponent } from '../../../componentes/select-cell-atributo/select-cell-atributo.component';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SelectCellComponent } from '../../../componentes/select-cell/select-cell.component';

@Injectable({
  providedIn: 'root'
})
export class CorridaService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarPrdListaCorridaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaCorridaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarCorrida(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarCorrida([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  //devuelve PrdCorrida
  listarCorridas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/getListaCorridasPorEmpresaSectorPiscina", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarCorridas(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  //devuelve el detalle de corrida
  obtenerDetalleCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/obtenerDetalleCorrida", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDetalleCorrida(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de obtiene datos para crud corrida
  obtenerDatosParaCrudCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/obtenerDatosParaCrudCorrida", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeObtenerDatosParaCrudCorrida(data.extraInfo);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CORRIDA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de inserta corrida
  insertarCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/insertarPrdCorrida", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeInsertarCorrida(data);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CORRIDA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de modificar corrida
  modificarCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/modificarPrdCorrida", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeModificarCorrida(data);
        } else {
          this.utilService.generarSwal(contexto.accion + " " + LS.TAG_CORRIDA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de elimina corrida
  eliminarCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/eliminarPrdCorrida", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeEliminaCorrida(data);
        } else {
          this.utilService.generarSwal(LS.TAG_CORRIDA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // metodo de caMBIA EL NUMERO DE LA corrida
  cambiarCodigoCorrida(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/produccionWebController/cambiarCodigoPrdCorrida", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeCambiarCodigoCorrida(data);
        } else {
          this.utilService.generarSwal(LS.TAG_CORRIDA, LS.SWAL_ERROR, data.operacionMensaje);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnasCorrida(contexto) {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_MOVER_FILA,
        headerClass: 'cell-header-center',
        cellClass: 'text-center cell-block',
        width: 55,
        minWidth: 55,
        maxWidth: 55,
        rowDrag: true, //Para mover las filas
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
        headerName: LS.TAG_SECTOR,
        field: 'secCodigo',
        width: 140,
        minWidth: 140,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaCorridaDetalleDestino)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: 'cell-block text-center',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.secCodigo;
          }
        },
        editable: true,
        cellEditorFramework: SelectCellAtributoComponent,
        cellEditorParams: function (params) {
          return {
            value: contexto.sectores ? params.data.secCodigo : null,
            name: 'secCodigo',
            atributo: 'secCodigo',
            obligatorio: true,
            ejecutarMetodoChange: true,
            listValues: contexto.sectores ? contexto.sectores : [],
            fieldsShow: ['secCodigo', 'secNombre']
          };
        },
        valueFormatter: function (params) {
          if (contexto.todoLosSectores && contexto.todoLosSectores.length > 0) {
            let sector: PrdListaSectorTO;
            sector = contexto.todoLosSectores.find(item => item.secCodigo == params.data.secCodigo);
            return sector ? sector.secCodigo + " - " + sector['secNombre'] : params.data.secCodigo;
          }
          return params.data.secCodigo;
        }
      },
      {
        headerName: LS.TAG_PISCINA,
        field: 'piscinaSeleccionada',
        width: 140,
        minWidth: 140,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaCorridaDetalleDestino)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: 'cell-block text-center',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !(params.data.piscinaSeleccionada && params.data.piscinaSeleccionada.pisNumero);
          }
        },
        editable: true,
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var piscinaSeleccionada = params.data.piscinaSeleccionada ? params.data.piscinaSeleccionada : [];
          return {
            value: piscinaSeleccionada,
            name: 'piscinaSeleccionada',
            obligatorio: true,
            ejecutarMetodoChange: true,
            callbackCompareWith: 'seleccionarPiscina',
            listValues: (params.data && params.data.listapiscinaSeleccionada) ? params.data.listapiscinaSeleccionada : [],
            fieldsShow: ['pisNumero', 'pisNombre']
          };
        },
        valueFormatter: function (params) {
          return params.data.piscinaSeleccionada && params.data.piscinaSeleccionada.pisNumero
            ? params.data.piscinaSeleccionada.pisNumero + " - " + params.data.piscinaSeleccionada.pisNombre : '';
        }
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'corridaSeleccionada',
        width: 140,
        minWidth: 140,
        suppressKeyboardEvent: (params) => {
          if (params.editing) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaCorridaDetalleDestino)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        cellClass: 'cell-block text-center',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !(params.data.corridaSeleccionada && params.data.corridaSeleccionada.prdCorridaPK && params.data.corridaSeleccionada.prdCorridaPK.corNumero);
          }
        },
        editable: true,
        cellEditorFramework: SelectCellComponent,
        cellEditorParams: function (params) {
          var corridaSeleccionada = params.data.corridaSeleccionada ? params.data.corridaSeleccionada : [];
          return {
            value: corridaSeleccionada,
            name: 'corridaSeleccionada',
            obligatorio: true,
            ejecutarMetodoChangeAlterno: true,
            listValues: (params.data && params.data.listacorridaSeleccionada) ? params.data.listacorridaSeleccionada : [],
            fieldsShow: ['prdCorridaPK.corNumero']
          };
        },
        valueFormatter: function (params) {
          return params.data.corridaSeleccionada && params.data.corridaSeleccionada.prdCorridaPK && params.data.corridaSeleccionada.prdCorridaPK.corNumero
            ? params.data.corridaSeleccionada.prdCorridaPK.corNumero : '';
        }
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'detPorcentaje',
        valueFormatter: this.formatearA2Decimales,
        width: 120,
        minWidth: 120,
        suppressKeyboardEvent: (params) => {
          contexto.agregarFilaAlFinal(params)
          if (params.editing) {
            return (this.utilService.desplazarTablaArribaAbajo(params.event.keyCode, params.node.rowIndex, contexto.listaCorridaDetalleDestino)
              || this.utilService.desplazarseInputIzquierdaDerecha(params.event.keyCode))
          }
        },
        editable: true,
        cellClass: 'text-right cell-block',
        cellClassRules: {
          "cell-with-errors": (params) => {
            return !params.data.detPorcentaje || params.data.detPorcentaje <= 0 || !contexto.validar100(false);
          },
        },
        cellEditorFramework: NumericCellComponent,
        cellEditorParams: {
          name: 'detPorcentaje',
          maxlength: 25,
          placeholder: '0.00',
          configAutonumeric: contexto.autonumeric62
        }
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  };

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

}
