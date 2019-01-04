import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SaldoBodegaComprobacionMontosService {
  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarInvFunSaldoBodegaComprobacionCantidadesTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvFunSaldoBodegaComprobacionCantidadesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvFunSaldoBodegaComprobacionCantidadesTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvFunSaldoBodegaComprobacionCantidadesTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }


  generarColumnas() {
    return [
      {
        headerName: LS.TAG_PRODUCTO,
        field: 'sbcProductoNombre',
        width: 250,
        minWidth: 250,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita' : '' }
      },
      {
        headerName: LS.TAG_CODIGO,
        field: 'sbcProductoCodigo',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_MEDIDA,
        field: 'sbcMedida',
        width: 180,
        minWidth: 150
      },
      {
        headerName: LS.TAG_INICIAL,
        field: 'sbcInicial',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' }
      },
      {
        headerName: LS.TAG_COMPRA,
        field: 'sbcCompra',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' }
      },
      {
        headerName: LS.TAG_VENTA,
        field: 'sbcVenta',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' }
      },
      {
        headerName: LS.TAG_CONSUMO,
        field: 'sbcConsumo',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' }
      },
      {
        headerName: LS.TAG_TRANSFERENCIA_I,
        field: 'sbcTransferenciaI',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TRANSFERENCIA_INTERNA,
          text: LS.TAG_TRANSFERENCIA_I
        }
      },
      {
        headerName: LS.TAG_TRANSFERENCIA_E,
        field: 'sbcTransferenciaE',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TRANSFERENCIA_EXTERNA,
          text: LS.TAG_TRANSFERENCIA_E
        }
      },
      {
        headerName: LS.TAG_DEVOLUCION_C,
        field: 'sbcDevolucionC',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_DEVOLUCION_COMPRAS,
          text: LS.TAG_DEVOLUCION_C
        }
      },
      {
        headerName: LS.TAG_DEVOLUCION_V,
        field: 'sbcDevolucionV',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_DEVOLUCION_VENTAS,
          text: LS.TAG_DEVOLUCION_V
        }
      },
      {
        headerName: LS.TAG_FINAL,
        field: 'sbcFinal',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' }
      },
      {
        headerName: LS.TAG_DIFERENCIA,
        field: 'sbcDiferencia',
        width: 180,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => { return (!params.data.sbcProductoCodigo) ? 'tr-negrita text-right' : ' text-right ' }
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
          if (params.data.sbcProductoCodigo) {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_KARDEX,
              accion: LS.ACCION_CONSULTAR
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
      },
    ];
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
