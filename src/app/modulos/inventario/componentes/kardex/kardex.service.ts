import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '../../../../../../node_modules/@angular/common';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    private authService: AuthService
  ) { }

  getListaInvKardexTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getListaInvKardexTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          respuesta.extraInfo = respuesta.extraInfo.length > 0 && respuesta.extraInfo[0].kFecha === null ? respuesta.extraInfo.slice(1, respuesta.extraInfo.length) : respuesta.extraInfo;
          contexto.despuesDeGetListaInvKardexTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeGetListaInvKardexTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  obtenerDatosParaKardex(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/obtenerDatosParaKardex", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerDatosParaKardex(respuesta.extraInfo);
        } else {
          contexto.despuesDeObtenerDatosParaKardex(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  cambiarFechaRecepcion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvComprasRecepcionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeCambiarFechaRecepcion(respuesta.extraInfo);
        } else {
          contexto.despuesDeCambiarFechaRecepcion(null);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarCambioFechaRecepcion(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarModificarComprasRecepcionTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO) {
          contexto.despuesDeInsertarCambioFechaRecepcion(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnasKardex(tipokardex: string, contexto, isModal?: boolean): Array<any> {
    let isValorizado = tipokardex === 'kardexValorizado' ? true : false;//kSimple
    let columnas: Array<any> = new Array();
    columnas.push(
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-sm-center',
        field: 'kStatus',
        width: 120,
        minWidth: 120,
        cellClass: 'text-sm-center',
        cellRenderer: 'iconoEstado'
      }
    );
    if (contexto.parametrosBusqueda && !contexto.parametrosBusqueda.bodega) {
      columnas.push(
        {
          headerName: LS.TAG_BODEGA,
          field: 'kBodega',
          width: 150,
          minWidth: 150,
        }
      );
    }

    columnas.push(
      {
        headerName: LS.TAG_TRANSACCION,
        field: 'kTransaccion',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'kFecha',
        width: 120,
        minWidth: 120
      }
    )

    if (isValorizado) {
      columnas.push(
        {
          headerName: LS.TAG_E_CANTIDAD,
          headerClass: 'text-sm-right',
          field: 'kEntradasCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_ENTRADA_CANTIDAD,
            text: LS.TAG_E_CANTIDAD
          }
        },
        {
          headerName: LS.TAG_E_COSTO,
          headerClass: 'text-sm-right',
          field: 'kEntradasCosto',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_ENTRADA_COSTO,
            text: LS.TAG_E_COSTO
          }
        },
        {
          headerName: LS.TAG_S_CANTIDAD,
          headerClass: 'text-sm-right',
          field: 'kSalidasCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_SALIDA_CANTIDAD,
            text: LS.TAG_S_CANTIDAD
          }
        },
        {
          headerName: LS.TAG_S_COSTO,
          headerClass: 'text-sm-right',
          field: 'kSalidasCosto',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_SALIDA_COSTO,
            text: LS.TAG_S_COSTO
          }
        },
        {
          headerName: LS.TAG_SAL_CANTIDAD,
          headerClass: 'text-sm-right',
          field: 'kSaldosCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_SALDO_CANTIDAD,
            text: LS.TAG_SAL_CANTIDAD
          }
        },
        {
          headerName: LS.TAG_SAL_COSTO,
          headerClass: 'text-sm-right',
          field: 'kSaldosCosto',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_SALDO_COSTO,
            text: LS.TAG_SAL_COSTO
          }
        },
        {
          headerName: LS.TAG_C_ACTUAL,
          headerClass: 'text-sm-right',
          field: 'kCostoActual',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter,
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: '',
            tooltip: LS.TAG_COSTO_ACTUAL,
            text: LS.TAG_C_ACTUAL
          }
        }
      )
    } else {
      columnas.push(
        {
          headerName: LS.TAG_ENTRADAS,
          headerClass: 'text-sm-right',
          field: 'kEntradasCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter
        },
        {
          headerName: LS.TAG_SALIDAS,
          headerClass: 'text-sm-right',
          field: 'kSalidasCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter
        },
        {
          headerName: LS.TAG_SALDOS,
          headerClass: 'text-sm-right',
          field: 'kSaldosCantidad',
          width: 120,
          minWidth: 120,
          cellClass: 'text-sm-right',
          valueFormatter: numberFormatter
        })
    }
    columnas.push(
      {
        headerName: LS.TAG_CP_CC,
        field: 'kSectorPiscina',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_CENTRO_PRODUCCION_CENTRO_COSTO,
          text: LS.TAG_CP_CC
        },
      },
      {
        headerName: LS.TAG_NUMERO_SISTEMA,
        field: 'kNumeroSistema',
        width: 200,
        minWidth: 190
      },
      {
        headerName: LS.TAG_OBSERVACIONES,
        field: 'kObservaciones',
        width: 300,
        minWidth: 290,
      }
    );
    if (!isValorizado && !isModal) {
      columnas.push(
        {
          headerName: LS.TAG_OPCIONES,
          headerClass: 'cell-header-center',//Clase a nivel de th
          cellClass: (params) => { return (!params.data.kFecha) ? 'd-none' : 'text-center' },
          width: LS.WIDTH_OPCIONES,
          minWidth: LS.WIDTH_OPCIONES,
          cellRendererFramework: BotonOpcionesComponent,
          headerComponentFramework: TooltipReaderComponent,
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: '',
            enableSorting: false
          }
        }
      )
    }
    return columnas;
  }
}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
