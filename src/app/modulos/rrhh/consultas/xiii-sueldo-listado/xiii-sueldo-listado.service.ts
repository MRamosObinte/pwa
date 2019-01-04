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
export class XiiiSueldoListadoService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listaRhFunConsultarXiiiSueld(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhFunConsultarXiiiSueldo", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarRhFunConsultarXiiiSueld(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarRhFunConsultarXiiiSueld([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(contexto) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: "",
        field: "",
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 70,
        minWidth: 70
      },
      {
        headerName: LS.TAG_CATEGORIA,
        field: 'xiiiCategoria',
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'xiiiSector',
        width: 100,
        minWidth: 100,
        hide: contexto.sectorSeleccionado
      },
      {
        headerName: LS.TAG_NUMERO_IDENTIFICACION,
        field: 'xiiiId',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_APELLIDOS_Y_NOMBRES,
        field: 'xiiiApellidos',
        width: 200,
        minWidth: 200,
        valueGetter: (params) => { return (params.data.xiiiApellidos + " " + params.data.xiiiNombres) },
      },
      {
        headerName: LS.TAG_GENERO,
        field: 'xiiiGenero',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_FECHA_INGRESO,
        field: 'xiiiFechaIngreso',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_CARGO,
        field: 'xiiiCargo',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_TOTAL_INGRESO,
        field: 'xiiiTotalIngresos',
        width: 200,
        minWidth: 200,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
      },
      {
        headerName: LS.TAG_DIAS_LABORADOS,
        field: 'xiiiDiasLaborados',
        width: 200,
        minWidth: 200,
        cellClass: "text-right"
      },
      {
        headerName: LS.TAG_V_XIII_SUELDO,
        field: 'xiiiValorXiiiSueldo',
        width: 200,
        minWidth: 200,
        valueFormatter: this.formatearA2Decimales,
        cellClass: "text-right",
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_VALOR_XIII_SUELDO, text: LS.TAG_V_XIII_SUELDO },
      },
      {
        headerName: LS.TAG_C_MINISTERIAL,
        field: 'xiiiCodigoMinisterial',
        width: 130,
        minWidth: 130,
        headerComponentFramework: TooltipReaderComponent,
        headerComponentParams: { class: '', tooltip: LS.TAG_CODIGO_MINISTERIAL, text: LS.TAG_C_MINISTERIAL },
      },
      {
        headerName: LS.TAG_CONTABLE,
        field: 'xiiiNumero',
        width: 200,
        minWidth: 200,
        valueGetter: (params) => { return (params.data.xiiiPeriodo + "|" + params.data.xiiiTipo + "|" + params.data.xiiiNumero) },
      },
      this.utilService.getColumnaOpciones()
    ];

    return columnDefs;
  }


  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }
}
