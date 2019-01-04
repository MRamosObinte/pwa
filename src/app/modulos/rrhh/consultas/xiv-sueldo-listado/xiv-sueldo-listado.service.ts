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
export class XivSueldoListadoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhFunConsultarXivSueld(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhFunConsultarXivSueldo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhFunConsultarXivSueld(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhFunConsultarXivSueld([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'xivCategoria',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'xivSector',
        width: 200,
        minWidth: 200,
        hide: contexto.sectorSeleccionado
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'xivId',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'xivApellidos',
        width: 200,
        minWidth: 200,
        valueGetter: (params) => { return (params.data.xivApellidos + " " + params.data.xivNombres) },
      },
      {
        headerName: LS.TAG_GENERO,
        field: 'xivGenero',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_FECHA_INGRESO,
        field: 'xivFechaIngreso',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_CARGO,
        field: 'xivCargo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_TOTAL_INGRESO,
        field: 'xivTotalIngresos',
        width: 200,
        minWidth: 200,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
      },
      {
        headerName: LS.TAG_DIAS_LABORADOS,
        field: 'xivDiasLaborados',
        width: 200,
        minWidth: 200,
        cellClass: "text-right"
      },
      {
        headerName: LS.TAG_V_XIV_SUELDO,
        field: 'xivValorXivSueldo',
        width: 200,
        minWidth: 200,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_XIV_SUELDO, text: LS.TAG_V_XIV_SUELDO },
      },
      {
        headerName: LS.TAG_C_MINISTERIAL,
        field: 'xivCodigoMinisterial',
        width: 130,
        minWidth: 130,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_CODIGO_MINISTERIAL, text: LS.TAG_C_MINISTERIAL },
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'xivNumero',
        width: 200,
        minWidth: 200,
        valueGetter: (params) => { return (params.data.xivPeriodo + "|" + params.data.xivTipo + "|" + params.data.xivNumero) },
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
