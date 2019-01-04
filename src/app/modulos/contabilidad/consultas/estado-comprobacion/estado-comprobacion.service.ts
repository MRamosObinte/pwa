import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EstadoComprobacionService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarEstadoComprobacion(parametro, contexto, empresaSelect) {
    contexto.filasTiempo ? contexto.filasTiempo.iniciarContador() : null;
    this.api.post("todocompuWS/contabilidadWebController/getListaBalanceComprobacionTO", parametro, empresaSelect)
      .then(respuesta => {
        contexto.filasTiempo ? contexto.filasTiempo.finalizarContador() : null;
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarEstadoComprobacion([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarEstadoComprobacion(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarEstadoComprobacion([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }


  generarColumnas(contexto, filtrarLista, longitudGrupo1) {
    if (contexto.ocultarOpciones) {
      return [
        {
          headerName: LS.TAG_CUENTA,
          field: 'bcCuenta',
          width: 150,
          minWidth: 150,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura && !filtrarLista) {
              return 'tr-negrita ';
            } else {
              return 'text-whitespace ';
            }
          }
        },
        {
          headerName: LS.TAG_DETALLE,
          field: 'bcDetalle',
          width: 250,
          minWidth: 250,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace';
            } else {
              return 'text-whitespace';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO_ANTERIOR,
          field: 'bcSaldoAnterior',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_TOTAL_DEBITOS,
          field: 'bcTotalDebito',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_TOTAL_CREDITOS,
          field: 'bcTotalCredito',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO_FINAL,
          field: 'bcSaldoFinal',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        }
      ];
    } else {
      return [
        {
          headerName: LS.TAG_CUENTA,
          field: 'bcCuenta',
          width: 150,
          minWidth: 150,
          cellClass: (params) => {
            if (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura) {
              return 'tr-negrita ';
            } else {
              return 'text-whitespace ';
            }
          }
        },
        {
          headerName: LS.TAG_DETALLE,
          field: 'bcDetalle',
          width: 250,
          minWidth: 250,
          cellClass: (params) => {
            if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura)) {
              return 'tr-negrita text-whitespace';
            } else {
              return 'text-whitespace';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO_ANTERIOR,
          field: 'bcSaldoAnterior',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_TOTAL_DEBITOS,
          field: 'bcTotalDebito',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_TOTAL_CREDITOS,
          field: 'bcTotalCredito',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO_FINAL,
          field: 'bcSaldoFinal',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (!params.data.bcCuenta || (params.data.bcCuenta && params.data.bcCuenta.length !== contexto.tamanioEstructura)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
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
            if (params.data.bcCuenta && params.data.bcCuenta.length === contexto.tamanioEstructura) {
              return {
                icono: LS.ICON_CONSULTAR,
                tooltip: LS.MSJ_CONSULTAR_MAYOR_AUXILIAR,
                accion: LS.ACCION_CONSULTAR
              };
            } else {
              return {
                icono: null,
                tooltip: null,
                accion: null
              };
            }
          },
          headerComponent: 'toolTip',
          headerComponentParams: {
            class: LS.ICON_OPCIONES,
            tooltip: LS.TAG_OPCIONES,
            text: ''
          }
        }
      ];

    }

  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
