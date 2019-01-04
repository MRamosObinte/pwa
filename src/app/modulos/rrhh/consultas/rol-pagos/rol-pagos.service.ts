import { TooltipReaderComponent } from './../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from './../../../componentes/boton-opciones/boton-opciones.component';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';
import { IconoEstadoComponent } from '../../../componentes/icono-estado/icono-estado.component';

@Injectable({
  providedIn: 'root'
})
export class RolPagosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhDetalleRolesTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhDetalleRolesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhDetalleRolesTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhDetalleRolesTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      /*
      {
        headerName: LS.TAG_ESTADO,
        headerClass: 'text-center',
        width: 100,
        minWidth: 90,
        pinned: 'left',
        cellClass: 'text-center',
        cellRendererFramework: IconoEstadoComponent,
        valueGetter: (params) => {
          if (params.data.lrpAnulado) {
            params.value = LS.ETIQUETA_ANULADO;
            return params.value;
          }
          if (params.data.lrpPendiente) {
            params.value = LS.ETIQUETA_PENDIENTE;
            return params.value;
          }
          return '';
        }
      },
      */
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 70,
        minWidth: 70,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'lrpId',
        width: 170,
        minWidth: 150,
        pinned: 'left',
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'lrpNombres',
        width: 300,
        minWidth: 300,
        pinned: 'left',
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_CARGO,
        field: 'lrpCargo',
        width: 150,
        minWidth: 120,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_DESDE,
        field: 'lrpDesde',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_HASTA,
        field: 'lrpHasta',
        width: 120,
        minWidth: 120,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_DL,
        field: 'lrpDl',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_LABORADOS, text: LS.TAG_DL }
      },
      {
        headerName: LS.TAG_DF,
        field: 'lrpDf',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_FALTA, text: LS.TAG_DF }
      },
      {
        headerName: LS.TAG_DE,
        field: 'lrpDe',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_EXTRAS, text: LS.TAG_DE }
      },
      {
        headerName: LS.TAG_DD,
        field: 'lrpDd',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_DESCANSO_MEDICO, text: LS.TAG_DD }
      },
      {
        headerName: LS.TAG_DPM,
        field: 'lrpDpm',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_PERMISO_MEDICO, text: LS.TAG_DPM }
      },
      {
        headerName: LS.TAG_DP,
        field: 'lrpDp',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_PAGADOS, text: LS.TAG_DP }
      },
      {
        headerName: LS.TAG_SALDO,
        field: 'lrpSaldo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_INGRESOS,
        field: 'lrpIngresos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_50,
        field: 'lrplrpHorasExtras',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_100,
        field: 'lrpHorasExtras100',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_BONOS,
        field: 'lrpBonos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_BONOS_ND,
        field: 'lrpBonosnd',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_BONOS_NO_DEDUCIBLE, text: LS.TAG_BONOS_ND }
      },
      {
        headerName: LS.TAG_BONOS_FIJO,
        field: 'lrpBonosFijo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_BONOS_FIJO_ND,
        field: 'lrpBonosFijoNd',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_BONOS_FIJO_NO_DEDUCIBLE, text: LS.TAG_BONOS_FIJO_ND }
      },
      {
        headerName: LS.TAG_LIQUIDACION,
        field: 'lrpLiquidacion',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_FONDO_RESERVA,
        field: 'lrpFondoReserva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_TOTAL_INGRESO,
        field: 'lrpTotalIngresos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_ANTICIPOS,
        field: 'lrpAnticipos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS,
        field: 'lrpPrestamos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_IESS,
        field: 'lrpIess',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_IESS_EXTENSION,
        field: 'lrpIessExtension',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_P_QUIROGRAFARIOS,
        field: 'lrpPrestamoQuirografario',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_PRESTAMOS_QUIROGRAFARIOS, text: LS.TAG_P_QUIROGRAFARIOS }
      },
      {
        headerName: LS.TAG_P_HIPOTECARIOS,
        field: 'lrpRetencion',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_PRESTAMOS_HIPOTECARIOS, text: LS.TAG_P_HIPOTECARIOS }
      },
      {
        headerName: LS.TAG_RETENCION,
        field: 'crpRetencion',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_D_PERMISO_MEDICO,
        field: 'lrpDescuentoPermisoMedico',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DESCUENTO_PERMISO_MEDICO, text: LS.TAG_D_PERMISO_MEDICO },
      },
      {
        headerName: LS.TAG_DESCUENTOS,
        field: 'lrpDescuentos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'lrpTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_FORMA_PAGO,
        field: 'lrpFormaPago',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_DOCUMENTO,
        field: 'lrpDocumento',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'lrpContable',
        width: 150,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.lrpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        cellClass: (params) => { return (!params.data.lrpId) ? 'd-none' : 'text-center' },
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
    ];
  }

  generarColumnasConfirmacionRol() {
    return [
      {
        headerName: LS.TAG_CONCEPTO,
        field: 'sedConcepto',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'sedDetalle',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_CP,
        field: 'sedCp',
        width: 100,
        minWidth: 100,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_CENTRO_PRODUCCION, text: LS.TAG_CP }
      },
      {
        headerName: LS.TAG_CC,
        field: 'sedCc',
        width: 100,
        minWidth: 100,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_CENTRO_COSTO, text: LS.TAG_CC }
      },
      {
        headerName: LS.TAG_FECHA,
        field: 'sedFecha',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_VALOR,
        field: 'sedValor',
        cellClass: 'text-right',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'sedContable',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_OBSERVACION,
        field: 'sedObservaciones',
        width: 200,
        minWidth: 200
      }
    ]
  }

}

function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}

