import { DecimalPipe } from '@angular/common';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from './../../../../serviciosgenerales/api-request.service';
import { Injectable } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoRolPagosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhConsolidadoRolesTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhConsolidadoRolesTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhConsolidadoRolesTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhConsolidadoRolesTO([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas() {
    return [
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'crpId',
        width: 170,
        minWidth: 150,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'crpNombres',
        width: 300,
        minWidth: 300,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita' : '';
        }
      },
      {
        headerName: LS.TAG_DL,
        field: 'crpDl',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_LABORADOS, text: LS.TAG_DL }
      },
      {
        headerName: LS.TAG_DF,
        field: 'crpDf',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_FALTA, text: LS.TAG_DF },
      },
      {
        headerName: LS.TAG_DE,
        field: 'crpDe',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_EXTRAS, text: LS.TAG_DE },
      },
      {
        headerName: LS.TAG_DD,
        field: 'crpDd',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DESCANSO_MEDICO, text: LS.TAG_DD },
      },
      {
        headerName: LS.TAG_DP,
        field: 'crpDp',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DIAS_PAGADOS, text: LS.TAG_DP },
      },
      {
        headerName: LS.TAG_SUELDO,
        field: 'crpSueldo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_50,
        field: 'crpHorasExtras',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_HORAS_EXTRAS_100,
        field: 'crpHorasExtras100',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_BONOS,
        field: 'crpBonos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_BONOS_ND,
        field: 'crpBonosnd',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_BONOS_NO_DEDUCIBLE, text: LS.TAG_BONOS_ND }
      },
      {
        headerName: LS.TAG_BONOS_FIJO,
        field: 'crpBonoFijo',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_BONOS_FIJO_ND,
        field: 'crpBonoFijoNd',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_BONOS_FIJO_NO_DEDUCIBLE, text: LS.TAG_BONOS_FIJO_ND }
      },
      {
        headerName: LS.TAG_OTROS_INGRESOS,
        field: 'crpOtrosIngresos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_FONDO_RESERVA,
        field: 'crpFondoReserva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_LIQUIDACION,
        field: 'crpLiquidacion',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_INGRESOS,
        field: 'crpIngresos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_ANTICIPOS,
        field: 'crpAnticipos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_PRESTAMOS,
        field: 'crpPrestamos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_IESS,
        field: 'crpIess',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_IESS_EXTENSION,
        field: 'crpIessExtension',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_P_QUIROGRAFARIOS,
        field: 'crpPrestamoQuirografario',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_PRESTAMOS_QUIROGRAFARIOS, text: LS.TAG_P_QUIROGRAFARIOS }
      },
      {
        headerName: LS.TAG_P_HIPOTECARIOS,
        field: 'crpPrestamoHipotecario',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
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
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_D_FONDO_RESERVA,
        field: 'crpDescuentosFondoReserva',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        },
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_DESCUENTO_FONDO_RESERVA, text: LS.TAG_D_FONDO_RESERVA }
      },
      {
        headerName: LS.TAG_DESCUENTOS,
        field: 'crpDescuentos',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
        }
      },
      {
        headerName: LS.TAG_TOTAL,
        field: 'crpTotal',
        width: 150,
        minWidth: 150,
        valueFormatter: numberFormatter,
        cellClass: (params) => {
          return (!params.data.crpId) ? 'tr-negrita text-right' : 'text-right';
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
          if (!params.data.crpId) {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          } else {
            return {
              icono: LS.ICON_CONSULTAR,
              tooltip: LS.MSJ_CONSULTAR_ROL_PAGO,
              accion: LS.ACCION_CONSULTAR
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


function numberFormatter(params) {
  return new DecimalPipe('en-US').transform(params.value, '1.2-2');
}
