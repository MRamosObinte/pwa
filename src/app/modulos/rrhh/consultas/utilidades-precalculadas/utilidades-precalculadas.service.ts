import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesPrecalculadasService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listautilidadesPrecalculadas(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhFunCalcularUtilidades", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarutilidadesPrecalculadas(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarutilidadesPrecalculadas([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'utiId',
        width: 130,
        minWidth: 130
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        width: 200,
        minWidth: 200,
        valueGetter(params) {
          return params.data.utiNombres + " " + params.data.utiApellidos
        }
      },
      {
        headerName: LS.TAG_GENERO,
        field: 'utiGenero',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_FECHA_INGRESO,
        field: 'utiFechaIngreso',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_FECHA_SALIDA,
        field: 'utiFechaSalida',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_CARGO,
        field: 'utiCargo',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_CARGAS_FAMILIARES,
        field: 'utiCargasFamiliares',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
      },
      {
        headerName: LS.TAG_DIAS_LABORADOS,
        field: 'utiDiasLaborados',
        width: 130,
        minWidth: 130,
        cellClass: "text-right"
      },
      {
        headerName: LS.TAG_V_UTILIDADES,
        field: 'utiValorUtilidades',
        width: 100,
        minWidth: 100,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_UTILIDADES, text: LS.TAG_V_UTILIDADES },
      },
      {
        headerName: LS.TAG_V_SUELDO,
        field: 'utiValorSueldos',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_SUELDO, text: LS.TAG_V_SUELDO },
      },
      {
        headerName: LS.TAG_V_BONOS,
        field: 'utiValorBonos',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_BONOS, text: LS.TAG_V_BONOS },
      },
      {
        headerName: LS.TAG_V_XIII,
        field: 'utiValorXiii',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_XIII, text: LS.TAG_V_XIII },
      },
      {
        headerName: LS.TAG_V_XIV,
        field: 'utiValorXiv',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_XIV, text: LS.TAG_V_XIV },
      },
      {
        headerName: LS.TAG_V_F_RESERVA,
        field: 'utiValorFondoReserva',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_FONDO_RESERVA, text: LS.TAG_V_F_RESERVA },
      },
      {
        headerName: LS.TAG_VALOR_SUELDO_DIGNO,
        field: 'utiValorSalarioDigno',
        width: 130,
        minWidth: 130,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_SUELDO_DIGNO, text: LS.TAG_V_S_DIGNO },
      },
      {
        headerName: LS.TAG_V_U_ANTERIOR,
        field: 'utiValorUtilidadAnterior',
        width: 100,
        minWidth: 100,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_UTILIDAD_ANTERIOR, text: LS.TAG_V_U_ANTERIOR },
      },
      {
        headerName: LS.TAG_V_IMPUESTO,
        field: 'utiValorXiv',
        width: 100,
        minWidth: 100,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_IMPUESTO, text: LS.TAG_V_IMPUESTO },
      },
    ];

    return columnDefs;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
