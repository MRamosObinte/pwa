import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EstadoResultadoIntegralComparativoService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService
  ) { }

  listarEstadoIntegralComparativo(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getConBalanceResultadoComparativoTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          if (respuesta.extraInfo.length === 1) {
            this.toastr.warning(LS.MSJ_NO_DATA, 'Aviso');
            contexto.despuesDeListarEstadoIntegralComparativo([]);
            contexto.cargando = false;
          } else {
            contexto.despuesDeListarEstadoIntegralComparativo(respuesta.extraInfo);
          }
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.despuesDeListarEstadoIntegralComparativo([]);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(contexto, filtrarLista, longitudGrupo1) {
    if (contexto.ocultarOpciones) {
      return [
        {
          headerName: LS.TAG_CUENTA,
          field: 'brcCuenta',
          width: 100,
          minWidth: 100,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista) {
              return 'tr-negrita ';
            } else {
              return 'text-whitespace ';
            }
          }
        },
        {
          headerName: LS.TAG_DETALLE,
          field: 'brcDetalle',
          width: 200,
          minWidth: 200,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if ((!filtrarLista && params.data.brcCuenta) || (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace';
            } else {
              return 'text-whitespace';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO,
          field: 'brcSaldo',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if ((!filtrarLista && params.data.brcCuenta) || (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO2,
          field: 'brcSaldo2',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if ((!filtrarLista && params.data.brcCuenta) || (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
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
          field: 'brcCuenta',
          width: 100,
          minWidth: 100,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista) {
              return 'tr-negrita ';
            } else {
              return 'text-whitespace ';
            }
          }
        },
        {
          headerName: LS.TAG_DETALLE,
          field: 'brcDetalle',
          width: 200,
          minWidth: 200,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.brcCuenta || (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace';
            } else {
              return 'text-whitespace';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO,
          field: 'brcSaldo',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.brcCuenta || (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
              return 'tr-negrita text-whitespace text-right';
            } else {
              return 'text-whitespace text-right';
            }
          }
        },
        {
          headerName: LS.TAG_SALDO2,
          field: 'brcSaldo2',
          width: 150,
          minWidth: 150,
          valueFormatter: numberFormatter,
          cellClass: (params) => {
            if (params.data.brcCuenta && params.data.brcCuenta.length === longitudGrupo1) {
              return 'tr-negrita ';
            } else if (!params.data.brcCuenta || (params.data.brcCuenta && params.data.brcCuenta.length !== contexto.tamanioEstructura && !filtrarLista)) {
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
            if (params.data.brcCuenta && params.data.brcCuenta.length === contexto.tamanioEstructura) {
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
    }
  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}